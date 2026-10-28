// Finds the outline of the main object in a scanned image.
// Steps: binary mask -> keep the largest blob -> fill its holes -> follow its boundary -> resample & smooth.

import { Vec, dist } from './knife-shape';

export interface TraceResult {
  contour: Vec[];      // closed, clockwise (y down), evenly spaced points, in image pixels
  threshold: number;   // brightness threshold used (unused when the alpha channel was used)
  usedAlpha: boolean;  // the image had a transparent background, so alpha was used as the mask
}

const SAMPLE_SPACING = 2;  // px between contour points
const SMOOTH_PASSES = 2;
const CLOSE_RADIUS = 0.003;  // of the image diagonal: gaps narrower than twice this are filled

/**
 * @param image the scan
 * @param threshold brightness 0-255 separating object from background; auto (Otsu) when omitted
 */
export function traceOutline(image: ImageData, threshold?: number): TraceResult | null {
  const { width: w, height: h, data } = image;
  const n = w * h;
  const mask = new Uint8Array(n);

  let transparent = 0;
  for (let i = 0; i < n; i++) {
    if (data[i * 4 + 3] < 128) transparent++;
  }
  const usedAlpha = transparent > n * 0.01;
  let t = threshold ?? 128;

  if (usedAlpha) {
    for (let i = 0; i < n; i++) {
      mask[i] = data[i * 4 + 3] >= 128 ? 1 : 0;
    }
  }
  else {
    const lum = new Uint8Array(n);
    const hist = new Uint32Array(256);
    for (let i = 0; i < n; i++) {
      const l = (data[i * 4] * 299 + data[i * 4 + 1] * 587 + data[i * 4 + 2] * 114) / 1000 | 0;
      lum[i] = l;
      hist[l]++;
    }
    t = threshold ?? otsuThreshold(hist, n);

    // the background is whatever most of the image border is
    let darkBorder = 0, border = 0;
    const countBorder = (i: number) => { border++; if (lum[i] < t) darkBorder++; };
    for (let x = 0; x < w; x++) { countBorder(x); countBorder((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { countBorder(y * w); countBorder(y * w + w - 1); }
    const darkObject = darkBorder < border / 2;

    for (let i = 0; i < n; i++) {
      mask[i] = (lum[i] < t) === darkObject ? 1 : 0;
    }
  }

  if (!keepLargestComponent(mask, w, h)) {
    return null;
  }
  // print touching the edge leaves small bites in the outline; close them
  closeMask(mask, w, h, Math.max(1, Math.round(Math.hypot(w, h) * CLOSE_RADIUS)));
  fillHoles(mask, w, h);

  const boundary = followBoundary(mask, w, h);
  if (boundary.length < 4) {
    return null;
  }
  let contour = resample(boundary, SAMPLE_SPACING);
  for (let p = 0; p < SMOOTH_PASSES; p++) {
    contour = smooth(contour);
  }
  if (signedArea(contour) < 0) {
    contour.reverse();
  }
  return { contour, threshold: t, usedAlpha };
}

function otsuThreshold(hist: Uint32Array, total: number): number {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0, wB = 0, best = -1, t = 128;
  for (let i = 0; i < 256; i++) {
    wB += hist[i];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += i * hist[i];
    const mB = sumB / wB, mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > best) {
      best = between;
      t = i + 1;
    }
  }
  return t;
}

/**
 * Keeps only the biggest 4-connected blob. Blobs touching the image edge (scanner lid, paper edge)
 * are penalized so they win only when nothing else is close in size.
 */
function keepLargestComponent(mask: Uint8Array, w: number, h: number): boolean {
  const labels = new Int32Array(w * h);
  const stack = new Int32Array(w * h);
  let label = 0, bestLabel = 0, bestScore = 0;

  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || labels[start]) continue;
    label++;
    let size = 0, touchesEdge = false, sp = 0;
    stack[sp++] = start;
    labels[start] = label;
    while (sp) {
      const i = stack[--sp];
      size++;
      const x = i % w, y = (i / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true;
      if (x > 0 && mask[i - 1] && !labels[i - 1]) { labels[i - 1] = label; stack[sp++] = i - 1; }
      if (x < w - 1 && mask[i + 1] && !labels[i + 1]) { labels[i + 1] = label; stack[sp++] = i + 1; }
      if (y > 0 && mask[i - w] && !labels[i - w]) { labels[i - w] = label; stack[sp++] = i - w; }
      if (y < h - 1 && mask[i + w] && !labels[i + w]) { labels[i + w] = label; stack[sp++] = i + w; }
    }
    const score = touchesEdge ? size / 4 : size;
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }
  if (!bestLabel) {
    return false;
  }
  for (let i = 0; i < mask.length; i++) {
    mask[i] = labels[i] === bestLabel ? 1 : 0;
  }
  return true;
}

/** Morphological closing (dilate, then erode) with a square of radius r. */
function closeMask(mask: Uint8Array, w: number, h: number, r: number) {
  const tmp = new Uint8Array(w * h);
  // one pass over rows or columns: dilate = any pixel set in the window, erode = all (in-bounds) pixels set
  const pass = (src: Uint8Array, dst: Uint8Array, horizontal: boolean, dilate: boolean) => {
    const lines = horizontal ? h : w, length = horizontal ? w : h;
    const step = horizontal ? 1 : w, lineStep = horizontal ? w : 1;
    for (let line = 0; line < lines; line++) {
      const base = line * lineStep;
      let count = 0;
      for (let k = 0; k < Math.min(r, length); k++) count += src[base + k * step];
      for (let k = 0; k < length; k++) {
        if (k + r < length) count += src[base + (k + r) * step];
        if (k - r - 1 >= 0) count -= src[base + (k - r - 1) * step];
        const windowSize = Math.min(length - 1, k + r) - Math.max(0, k - r) + 1;
        dst[base + k * step] = dilate ? (count > 0 ? 1 : 0) : (count === windowSize ? 1 : 0);
      }
    }
  };
  pass(mask, tmp, true, true);
  pass(tmp, mask, false, true);
  pass(mask, tmp, true, false);
  pass(tmp, mask, false, false);
}

/** Fills everything not reachable from the image border (printed letters, cut-outs, ...). */
function fillHoles(mask: Uint8Array, w: number, h: number) {
  const OUTSIDE = 2;
  const stack = new Int32Array(w * h);
  let sp = 0;
  const seed = (i: number) => { if (mask[i] === 0) { mask[i] = OUTSIDE; stack[sp++] = i; } };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
  while (sp) {
    const i = stack[--sp];
    const x = i % w, y = (i / w) | 0;
    if (x > 0) seed(i - 1);
    if (x < w - 1) seed(i + 1);
    if (y > 0) seed(i - w);
    if (y < h - 1) seed(i + w);
  }
  for (let i = 0; i < mask.length; i++) {
    mask[i] = mask[i] === OUTSIDE ? 0 : 1;
  }
}

/**
 * Walks along pixel edges keeping the object on the right hand side (clockwise with y down).
 * Returns the pixel-corner points where the direction changes.
 */
function followBoundary(mask: Uint8Array, w: number, h: number): Vec[] {
  const start = mask.indexOf(1);
  const sx = start % w, sy = (start / w) | 0;
  // directions: east, south, west, north
  const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];
  // pixel in the quadrant (qx, qy) around pixel corner (x, y)
  const filled = (x: number, y: number, qx: number, qy: number) => {
    const px = qx < 0 ? x - 1 : x, py = qy < 0 ? y - 1 : y;
    return px >= 0 && py >= 0 && px < w && py < h && mask[py * w + px] === 1;
  };

  // the top-left corner of the first pixel touches only that pixel, so it is passed exactly once
  const pts: Vec[] = [{ x: sx, y: sy }];
  let x = sx, y = sy, d = 0;
  const maxSteps = 4 * (w + 1) * (h + 1);
  for (let step = 0; step < maxSteps; step++) {
    const dx = DX[d], dy = DY[d], rx = -dy, ry = dx;
    const aheadRight = filled(x, y, dx + rx, dy + ry);
    const aheadLeft = filled(x, y, dx - rx, dy - ry);
    const nd = aheadRight ? (aheadLeft ? (d + 3) % 4 : d) : (d + 1) % 4;
    if (nd !== d && step > 0) {
      pts.push({ x, y });
    }
    d = nd;
    x += DX[d];
    y += DY[d];
    if (x === sx && y === sy) {
      break;
    }
  }
  return pts;
}

function resample(poly: Vec[], spacing: number): Vec[] {
  const out: Vec[] = [poly[0]];
  let carry = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const segLen = dist(a, b);
    let s = spacing - carry;
    while (s <= segLen) {
      out.push({ x: a.x + (b.x - a.x) * s / segLen, y: a.y + (b.y - a.y) * s / segLen });
      s += spacing;
    }
    carry = segLen - (s - spacing);
  }
  if (out.length > 1 && dist(out[out.length - 1], out[0]) < spacing / 2) {
    out.pop();
  }
  return out;
}

function smooth(pts: Vec[]): Vec[] {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    return { x: (a.x + 2 * p.x + b.x) / 4, y: (a.y + 2 * p.y + b.y) / 4 };
  });
}

/** Positive when clockwise on screen (y down). */
function signedArea(pts: Vec[]): number {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}
