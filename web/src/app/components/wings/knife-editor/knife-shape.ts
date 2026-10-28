// Knife outline model: a closed path of nodes joined by straight lines or cubic Bezier curves.

export interface Vec { x: number; y: number; }

export interface KnifeNode {
  id: number;
  p: Vec;            // anchor point
  hIn: Vec | null;   // control point of the segment arriving at this node (null = no handle)
  hOut: Vec | null;  // control point of the segment leaving this node (null = no handle)
  smooth: boolean;   // keep hIn / hOut aligned while editing
}

export type RegionKey = 'l1' | 'lefts' | 'top' | 'rights' | 'crown';

/** A run of the outline, from node `from` forward (in node order) to node `to`. */
export interface KnifeRegion { from: number; to: number; }

export type KnifeRegions = Partial<Record<RegionKey, KnifeRegion>>;

export const REGION_KEYS: RegionKey[] = ['l1', 'lefts', 'top', 'rights', 'crown'];

export const REGION_INFO: Record<RegionKey, { label: string; color: string }> = {
  l1:     { label: 'L1',     color: '#0d6efd' },
  lefts:  { label: 'Lefts',  color: '#20c997' },
  top:    { label: 'Top',    color: '#ffc107' },
  rights: { label: 'Rights', color: '#fd7e14' },
  crown:  { label: 'Crown',  color: '#d63384' },
};

/**
 * Stored knife drawing (Knife.data). Units are cm, y grows downward, origin is the top-left of the bounding box.
 * Nodes run clockwise and start at the beginning of L1; node ids are their indexes.
 */
export interface KnifeShape {
  size_cm: { width: number; height: number };   // bounding box
  nodes: KnifeNode[];
  regions: KnifeRegions;
}

export type Bezier = [Vec, Vec, Vec, Vec];

const SAMPLE_STEPS = 16;

export function add(a: Vec, b: Vec): Vec { return { x: a.x + b.x, y: a.y + b.y }; }
export function sub(a: Vec, b: Vec): Vec { return { x: a.x - b.x, y: a.y - b.y }; }
export function mul(a: Vec, k: number): Vec { return { x: a.x * k, y: a.y * k }; }
export function dot(a: Vec, b: Vec): number { return a.x * b.x + a.y * b.y; }
export function len(a: Vec): number { return Math.hypot(a.x, a.y); }
export function dist(a: Vec, b: Vec): number { return Math.hypot(a.x - b.x, a.y - b.y); }
export function lerp(a: Vec, b: Vec, t: number): Vec { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }
export function norm(a: Vec): Vec {
  const l = len(a);
  return l === 0 ? { x: 0, y: 0 } : { x: a.x / l, y: a.y / l };
}

export function bezierPoint(b: Bezier, t: number): Vec {
  const mt = 1 - t;
  const k0 = mt * mt * mt, k1 = 3 * mt * mt * t, k2 = 3 * mt * t * t, k3 = t * t * t;
  return {
    x: k0 * b[0].x + k1 * b[1].x + k2 * b[2].x + k3 * b[3].x,
    y: k0 * b[0].y + k1 * b[1].y + k2 * b[2].y + k3 * b[3].y
  };
}

/** Segment i runs from nodes[i] to the next node (wrapping around). */
export function segment(nodes: KnifeNode[], i: number): Bezier {
  const a = nodes[i], b = nodes[(i + 1) % nodes.length];
  return [a.p, a.hOut ?? a.p, b.hIn ?? b.p, b.p];
}

export function isStraight(nodes: KnifeNode[], i: number): boolean {
  return !nodes[i].hOut && !nodes[(i + 1) % nodes.length].hIn;
}

/** Points along segment i, including both ends. */
export function sampleSegment(nodes: KnifeNode[], i: number, steps = SAMPLE_STEPS): Vec[] {
  const b = segment(nodes, i);
  if (isStraight(nodes, i)) {
    return [b[0], b[3]];
  }
  const pts: Vec[] = [];
  for (let s = 0; s <= steps; s++) {
    pts.push(bezierPoint(b, s / steps));
  }
  return pts;
}

export function segmentLength(nodes: KnifeNode[], i: number): number {
  const pts = sampleSegment(nodes, i);
  let total = 0;
  for (let k = 1; k < pts.length; k++) {
    total += dist(pts[k - 1], pts[k]);
  }
  return total;
}

export function indexOfId(nodes: KnifeNode[], id: number): number {
  return nodes.findIndex(n => n.id === id);
}

/** Indexes of the segments covered by a region, in order. */
export function regionSegments(nodes: KnifeNode[], region: KnifeRegion): number[] {
  let i = indexOfId(nodes, region.from);
  const end = indexOfId(nodes, region.to);
  const segs: number[] = [];
  if (i < 0 || end < 0) {
    return segs;
  }
  while (i !== end && segs.length < nodes.length) {
    segs.push(i);
    i = (i + 1) % nodes.length;
  }
  return segs;
}

export function regionLength(nodes: KnifeNode[], region: KnifeRegion): number {
  return regionSegments(nodes, region).reduce((total, i) => total + segmentLength(nodes, i), 0);
}

export function sampleRegion(nodes: KnifeNode[], region: KnifeRegion): Vec[] {
  return regionSegments(nodes, region).flatMap(i => sampleSegment(nodes, i));
}

/** A dense polyline along a region, from `from` to `to`, without repeated points. */
export function regionPolyline(nodes: KnifeNode[], region: KnifeRegion, steps = 32): Vec[] {
  const pts: Vec[] = [];
  for (const i of regionSegments(nodes, region)) {
    const seg = sampleSegment(nodes, i, steps);
    pts.push(...(pts.length ? seg.slice(1) : seg));
  }
  return pts;
}

/** Divides a polyline into equal-length parts: returns parts + 1 points with the direction of travel there. */
export function divideAlong(poly: Vec[], parts: number): { p: Vec; tangent: Vec }[] {
  if (poly.length < 2 || parts < 1) {
    return [];
  }
  const cumulative = [0];
  for (let i = 1; i < poly.length; i++) {
    cumulative.push(cumulative[i - 1] + dist(poly[i - 1], poly[i]));
  }
  const total = cumulative[cumulative.length - 1];
  const out: { p: Vec; tangent: Vec }[] = [];
  let seg = 1;
  for (let j = 0; j <= parts; j++) {
    const target = total * j / parts;
    while (seg < poly.length - 1 && cumulative[seg] < target) seg++;
    const a = poly[seg - 1], b = poly[seg];
    const segLen = cumulative[seg] - cumulative[seg - 1];
    out.push({ p: lerp(a, b, segLen ? (target - cumulative[seg - 1]) / segLen : 0), tangent: norm(sub(b, a)) });
  }
  return out;
}

/** The region between two nodes, going whichever way around the outline is shorter. */
export function shortestRegion(nodes: KnifeNode[], idA: number, idB: number): KnifeRegion {
  const forward = { from: idA, to: idB };
  const backward = { from: idB, to: idA };
  return regionLength(nodes, forward) <= regionLength(nodes, backward) ? forward : backward;
}

/** Splits segment i at t, inserting a new node after nodes[i]. The curve shape is preserved. */
export function splitSegment(nodes: KnifeNode[], i: number, t: number, id: number): KnifeNode {
  const a = nodes[i], b = nodes[(i + 1) % nodes.length];
  let node: KnifeNode;
  if (isStraight(nodes, i)) {
    node = { id, p: lerp(a.p, b.p, t), hIn: null, hOut: null, smooth: false };
  }
  else {
    // de Casteljau
    const [p0, c1, c2, p3] = segment(nodes, i);
    const q0 = lerp(p0, c1, t), q1 = lerp(c1, c2, t), q2 = lerp(c2, p3, t);
    const r0 = lerp(q0, q1, t), r1 = lerp(q1, q2, t);
    a.hOut = a.hOut ? q0 : null;
    b.hIn = b.hIn ? q2 : null;
    node = { id, p: lerp(r0, r1, t), hIn: r0, hOut: r1, smooth: true };
  }
  nodes.splice(i + 1, 0, node);
  return node;
}

export function mapNode(n: KnifeNode, f: (p: Vec) => Vec): KnifeNode {
  return { id: n.id, p: f(n.p), hIn: n.hIn && f(n.hIn), hOut: n.hOut && f(n.hOut), smooth: n.smooth };
}

export function cloneNodes(nodes: KnifeNode[]): KnifeNode[] {
  return nodes.map(n => mapNode(n, p => ({ x: p.x, y: p.y })));
}

export function outlineSamples(nodes: KnifeNode[]): Vec[] {
  return nodes.flatMap((_, i) => sampleSegment(nodes, i));
}

/**
 * Horizontal span from L1's mount to the rightmost point of the Crown, measured after `orient` (rotation / flip) is applied.
 * L1 sits in a mirrored-L corner on the left: the width starts at the L's rightmost (vertical) part, not at the ledge's outer end.
 */
export function measureSpan(nodes: KnifeNode[], regions: KnifeRegions, orient: (p: Vec) => Vec): { left: number; right: number } | null {
  if (!regions.l1 || !regions.crown) {
    return null;
  }
  const l1 = sampleRegion(nodes, regions.l1).map(orient);
  const crown = sampleRegion(nodes, regions.crown).map(orient);
  if (!l1.length || !crown.length) {
    return null;
  }
  return {
    left: Math.max(...l1.map(p => p.x)),
    right: Math.max(...crown.map(p => p.x))
  };
}

const round4 = (v: number) => Math.round(v * 10000) / 10000;

/**
 * Bakes the editor state into a stored shape: applies orientation, keeps the outline clockwise,
 * starts it at L1, moves it to the origin and converts units to cm.
 */
export function bakeShape(nodes: KnifeNode[], regions: KnifeRegions, orient: (p: Vec) => Vec,
                          mirrored: boolean, unitsPerCm: number): KnifeShape {
  let baked = nodes.map(n => mapNode(n, orient));
  const bakedRegions: KnifeRegions = {};
  for (const key of REGION_KEYS) {
    const r = regions[key];
    if (r) {
      bakedRegions[key] = mirrored ? { from: r.to, to: r.from } : { from: r.from, to: r.to };
    }
  }
  if (mirrored) {
    // mirroring turns the outline counter-clockwise; reverse it back
    baked = baked.reverse().map(n => ({ ...n, hIn: n.hOut, hOut: n.hIn }));
  }

  const start = bakedRegions.l1 ? Math.max(0, indexOfId(baked, bakedRegions.l1.from)) : 0;
  baked = [...baked.slice(start), ...baked.slice(0, start)];

  const pts = outlineSamples(baked);
  const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
  const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
  const toCm = (p: Vec): Vec => ({ x: round4((p.x - minX) / unitsPerCm), y: round4((p.y - minY) / unitsPerCm) });

  const newIds = new Map(baked.map((n, i) => [n.id, i]));
  const outRegions: KnifeRegions = {};
  for (const key of REGION_KEYS) {
    const r = bakedRegions[key];
    if (r) {
      outRegions[key] = { from: newIds.get(r.from)!, to: newIds.get(r.to)! };
    }
  }

  return {
    size_cm: { width: round4((maxX - minX) / unitsPerCm), height: round4((maxY - minY) / unitsPerCm) },
    nodes: baked.map((n, i) => ({ ...mapNode(n, toCm), id: i })),
    regions: outRegions
  };
}
