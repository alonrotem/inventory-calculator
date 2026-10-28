// Draws a saved knife (Knife.data, in cm) on a canvas, scaled to fit, optionally with sample babies.

import { Knife } from '../../../../types';
import { BabyPreviewOptions, PreviewBaby, buildBabyPreview } from './baby-preview';
import {
  KnifeNode, KnifeRegions, REGION_INFO, REGION_KEYS, Vec, add, isStraight, lerp, mul, norm, outlineSamples,
  regionSegments, segment, sub
} from './knife-shape';

export interface KnifeRenderOptions {
  color: string;                         // outline and text
  showRegions?: boolean;                 // colour the marked regions
  babies?: BabyPreviewOptions | null;    // sample babies to draw around the knife
  margin?: number;                       // px around the drawing
}

export const DEFAULT_PREVIEW_BABIES: BabyPreviewOptions = { lefts: 8, rights: 8, crownSplit: 4 };

/** The knife's outline as an SVG path (in cm) with a fitting viewBox, e.g. for thumbnails. */
export function knifeSvgOutline(knife: { data?: Knife['data'] }, padding = 0.3): { d: string; viewBox: string } | null {
  const nodes = (knife?.data?.nodes ?? []) as KnifeNode[];
  if (nodes.length < 3) {
    return null;
  }
  const f = (v: number) => Math.round(v * 1000) / 1000;
  let d = `M${f(nodes[0].p.x)} ${f(nodes[0].p.y)}`;
  nodes.forEach((_, i) => {
    const b = segment(nodes, i);
    d += isStraight(nodes, i)
      ? ` L${f(b[3].x)} ${f(b[3].y)}`
      : ` C${f(b[1].x)} ${f(b[1].y)} ${f(b[2].x)} ${f(b[2].y)} ${f(b[3].x)} ${f(b[3].y)}`;
  });
  const pts = outlineSamples(nodes);
  const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
  const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
  return {
    d: d + ' Z',
    viewBox: `${f(minX - padding)} ${f(minY - padding)} ${f(maxX - minX + 2 * padding)} ${f(maxY - minY + 2 * padding)}`
  };
}

/**
 * Clears the canvas and draws the knife fitted into it.
 * `width` / `height` are the canvas' CSS size; the context must already be scaled for the device pixel ratio.
 */
export function drawKnife(ctx: CanvasRenderingContext2D, width: number, height: number, knife: Knife, opts: KnifeRenderOptions) {
  ctx.clearRect(0, 0, width, height);
  const nodes = (knife?.data?.nodes ?? []) as KnifeNode[];
  if (nodes.length < 3) {
    return;
  }
  const regions = (knife.data.regions ?? {}) as KnifeRegions;
  // drawing units are cm
  const babies: PreviewBaby[] = opts.babies ? buildBabyPreview(nodes, regions, 1, opts.babies) : [];

  // fit everything that is drawn into the canvas
  const pts = [...outlineSamples(nodes), ...babies.flatMap(b => b.corners)];
  const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
  const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
  const margin = opts.margin ?? 20;
  const scale = Math.min((width - 2 * margin) / ((maxX - minX) || 1), (height - 2 * margin) / ((maxY - minY) || 1));
  const offset = { x: (width - (maxX - minX) * scale) / 2 - minX * scale, y: (height - (maxY - minY) * scale) / 2 - minY * scale };
  const toScreen = (p: Vec): Vec => ({ x: offset.x + p.x * scale, y: offset.y + p.y * scale });

  const addSegment = (path: Path2D, i: number) => {
    const b = segment(nodes, i).map(toScreen);
    if (isStraight(nodes, i)) {
      path.lineTo(b[3].x, b[3].y);
    }
    else {
      path.bezierCurveTo(b[1].x, b[1].y, b[2].x, b[2].y, b[3].x, b[3].y);
    }
  };

  // outline
  const outline = new Path2D();
  const start = toScreen(nodes[0].p);
  outline.moveTo(start.x, start.y);
  nodes.forEach((_, i) => addSegment(outline, i));
  outline.closePath();
  ctx.save();
  ctx.fillStyle = 'rgba(13, 110, 253, 0.08)';
  ctx.fill(outline);
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = 1.5;
  ctx.stroke(outline);

  // regions
  if (opts.showRegions) {
    for (const key of REGION_KEYS) {
      const region = regions[key];
      const segs = region ? regionSegments(nodes, region) : [];
      if (!segs.length) continue;
      const path = new Path2D();
      const from = toScreen(nodes[segs[0]].p);
      path.moveTo(from.x, from.y);
      segs.forEach(i => addSegment(path, i));
      ctx.strokeStyle = REGION_INFO[key].color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.75;
      ctx.stroke(path);
      ctx.globalAlpha = 1;
    }
  }

  // babies
  ctx.lineWidth = 1;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '11px Arial';
  for (const baby of babies) {
    const c = baby.corners.map(toScreen);
    ctx.beginPath();
    ctx.moveTo(c[0].x, c[0].y);
    c.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 193, 7, 0.12)';
    ctx.fill();
    ctx.strokeStyle = opts.color;
    ctx.stroke();

    const center = mul(c.reduce((a, b) => add(a, b), { x: 0, y: 0 }), 1 / 4);
    const outer = lerp(c[1], c[2], 0.5);
    const lengthPos = add(outer, mul(norm(sub(outer, lerp(c[0], c[3], 0.5))), 10));
    ctx.fillStyle = opts.color;
    ctx.fillText(baby.label, center.x, center.y);
    ctx.fillText(String(baby.length), lengthPos.x, lengthPos.y);
  }
  ctx.restore();
}
