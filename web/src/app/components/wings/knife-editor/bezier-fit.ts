// Turns a traced contour into a few editable nodes: sharp corners are detected first,
// then the runs between them are fitted with cubic Bezier curves (Philip J. Schneider,
// "An Algorithm for Automatically Fitting Digitized Curves", Graphics Gems, 1990).

import { Bezier, KnifeNode, Vec, add, bezierPoint, dot, len, mul, norm, sub } from './knife-shape';

export interface FitOptions {
  tolerance: number;      // max distance (px) allowed between the contour and the curves
  cornerAngle: number;    // a turn sharper than this (degrees) becomes a corner node
  cornerWindow?: number;  // contour points on each side used to measure the turn
}

export type FittedNode = Omit<KnifeNode, 'id'>;

export function fitOutline(contour: Vec[], opts: FitOptions): FittedNode[] {
  const n = contour.length;
  const k = opts.cornerWindow ?? 5;
  const maxError = opts.tolerance * opts.tolerance;
  const corners = findCorners(contour, opts.cornerAngle, k);
  const beziers: Bezier[] = [];
  const startsAtCorner: boolean[] = [];

  if (!corners.length) {
    // fully smooth outline: fit it as one closed run
    const tangent = norm(sub(contour[1], contour[n - 1]));
    for (const b of fitCubic([...contour, contour[0]], tangent, mul(tangent, -1), maxError)) {
      beziers.push(b);
      startsAtCorner.push(false);
    }
  }
  else {
    for (let c = 0; c < corners.length; c++) {
      const s = corners[c], e = corners[(c + 1) % corners.length];
      const pts: Vec[] = [];
      let i = s;
      do {
        pts.push(contour[i]);
        i = (i + 1) % n;
      } while (i !== e);
      pts.push(contour[e]);

      const m = Math.min(3, pts.length - 1);
      const leftTangent = norm(sub(pts[m], pts[0]));
      const rightTangent = norm(sub(pts[pts.length - 1 - m], pts[pts.length - 1]));
      fitCubic(pts, leftTangent, rightTangent, maxError).forEach((b, bi) => {
        beziers.push(b);
        startsAtCorner.push(bi === 0);
      });
    }
  }

  const count = beziers.length;
  const nodes: FittedNode[] = beziers.map((b, i) => ({ p: b[0], hIn: null, hOut: b[1], smooth: !startsAtCorner[i] }));
  beziers.forEach((b, i) => {
    nodes[(i + 1) % count].hIn = b[2];
  });
  // nearly flat curves become plain lines
  beziers.forEach((b, i) => {
    if (distToLine(b[1], b[0], b[3]) <= opts.tolerance / 2 && distToLine(b[2], b[0], b[3]) <= opts.tolerance / 2) {
      nodes[i].hOut = null;
      nodes[(i + 1) % count].hIn = null;
    }
  });
  return nodes;
}

/** Indexes of contour points where the outline turns sharply (local maxima of the turn angle). */
function findCorners(pts: Vec[], minAngle: number, k: number): number[] {
  const n = pts.length;
  if (n < 2 * k + 1) {
    return [];
  }
  const turn = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const v1 = sub(pts[i], pts[(i - k + n) % n]);
    const v2 = sub(pts[(i + k) % n], pts[i]);
    const cos = dot(v1, v2) / ((len(v1) * len(v2)) || 1);
    turn[i] = Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
  }
  const corners: number[] = [];
  for (let i = 0; i < n; i++) {
    if (turn[i] < minAngle) continue;
    let isMax = true;
    for (let j = -k; j <= k && isMax; j++) {
      if (j === 0) continue;
      const other = turn[(i + j + n) % n];
      // on a plateau the first point wins
      if (other > turn[i] || (other === turn[i] && j < 0)) isMax = false;
    }
    if (isMax) corners.push(i);
  }
  return corners;
}

function distToLine(p: Vec, a: Vec, b: Vec): number {
  const ab = sub(b, a);
  const l = len(ab);
  if (l === 0) {
    return len(sub(p, a));
  }
  return Math.abs(ab.x * (p.y - a.y) - ab.y * (p.x - a.x)) / l;
}

function fitCubic(points: Vec[], leftTangent: Vec, rightTangent: Vec, maxError: number): Bezier[] {
  if (points.length === 2) {
    const d = len(sub(points[1], points[0])) / 3;
    return [[points[0], add(points[0], mul(leftTangent, d)), add(points[1], mul(rightTangent, d)), points[1]]];
  }

  let u = chordLengthParameterize(points);
  let bez = generateBezier(points, u, leftTangent, rightTangent);
  let [error, split] = computeMaxError(points, bez, u);
  if (error < maxError) {
    return [bez];
  }
  // close enough: try improving the parameterization before splitting
  if (error < maxError * 4) {
    for (let i = 0; i < 20; i++) {
      u = reparameterize(bez, points, u);
      bez = generateBezier(points, u, leftTangent, rightTangent);
      [error, split] = computeMaxError(points, bez, u);
      if (error < maxError) {
        return [bez];
      }
    }
  }

  // split at the worst point and fit both halves
  let toCenter = norm(sub(points[split - 1], points[split + 1]));
  if (toCenter.x === 0 && toCenter.y === 0) {
    toCenter = norm(sub(points[split - 1], points[split]));
  }
  return [
    ...fitCubic(points.slice(0, split + 1), leftTangent, toCenter, maxError),
    ...fitCubic(points.slice(split), mul(toCenter, -1), rightTangent, maxError)
  ];
}

function chordLengthParameterize(points: Vec[]): number[] {
  const u = [0];
  for (let i = 1; i < points.length; i++) {
    u.push(u[i - 1] + len(sub(points[i], points[i - 1])));
  }
  const total = u[u.length - 1] || 1;
  return u.map(v => v / total);
}

/** Least-squares fit of the handle lengths, with the handle directions fixed by the tangents. */
function generateBezier(points: Vec[], u: number[], leftTangent: Vec, rightTangent: Vec): Bezier {
  const first = points[0], last = points[points.length - 1];
  let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0;
  for (let i = 0; i < points.length; i++) {
    const t = u[i], mt = 1 - t;
    const a0 = mul(leftTangent, 3 * mt * mt * t);
    const a1 = mul(rightTangent, 3 * mt * t * t);
    c00 += dot(a0, a0);
    c01 += dot(a0, a1);
    c11 += dot(a1, a1);
    const tmp = sub(points[i], bezierPoint([first, first, last, last], t));
    x0 += dot(a0, tmp);
    x1 += dot(a1, tmp);
  }
  const det = c00 * c11 - c01 * c01;
  let alphaL = det === 0 ? 0 : (x0 * c11 - x1 * c01) / det;
  let alphaR = det === 0 ? 0 : (c00 * x1 - c01 * x0) / det;

  const segLength = len(sub(last, first));
  const epsilon = 1e-6 * segLength;
  if (alphaL < epsilon || alphaR < epsilon) {
    alphaL = alphaR = segLength / 3;
  }
  return [first, add(first, mul(leftTangent, alphaL)), add(last, mul(rightTangent, alphaR)), last];
}

/** Largest squared distance between the points and the curve, and where it happens. */
function computeMaxError(points: Vec[], bez: Bezier, u: number[]): [number, number] {
  let maxDist = 0;
  let split = Math.floor(points.length / 2);
  for (let i = 1; i < points.length - 1; i++) {
    const d = sub(bezierPoint(bez, u[i]), points[i]);
    const sq = dot(d, d);
    if (sq > maxDist) {
      maxDist = sq;
      split = i;
    }
  }
  return [maxDist, split];
}

/** One Newton-Raphson step per point towards the curve parameter closest to it. */
function reparameterize(bez: Bezier, points: Vec[], u: number[]): number[] {
  return u.map((t, i) => {
    const d = sub(bezierPoint(bez, t), points[i]);
    const d1 = firstDerivative(bez, t);
    const d2 = secondDerivative(bez, t);
    const denominator = dot(d1, d1) + dot(d, d2);
    const next = denominator === 0 ? t : t - dot(d, d1) / denominator;
    return Math.max(0, Math.min(1, next));
  });
}

function firstDerivative(b: Bezier, t: number): Vec {
  const mt = 1 - t;
  return add(add(mul(sub(b[1], b[0]), 3 * mt * mt), mul(sub(b[2], b[1]), 6 * mt * t)), mul(sub(b[3], b[2]), 3 * t * t));
}

function secondDerivative(b: Bezier, t: number): Vec {
  const p = add(sub(b[2], mul(b[1], 2)), b[0]);
  const q = add(sub(b[3], mul(b[2], 2)), b[1]);
  return add(mul(p, 6 * (1 - t)), mul(q, 6 * t));
}
