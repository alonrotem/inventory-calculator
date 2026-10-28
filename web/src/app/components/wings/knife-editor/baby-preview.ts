// Babies laid out on the marked regions of a knife: a wing's real babies (buildWingBabies),
// or sample babies to check the regions before real babies exist (buildBabyPreview).
// Lefts, Top and Rights form one fan around the top of the knife:
//  - L1 sits on the riser of the step; its bottom side continues the step's ledge
//  - L1..Ln fan out from the ledge's direction up to the Top's direction
//  - Top: one baby, parallel sides, pointing out of the middle of the Top region
//  - R1 (next to the Crown) .. Rn (next to the Top) fan from the Crown's direction up to the Top's
//  - Crown: one baby split into strips, all parallel; C1 is the strip farthest from the Rights

import { KnifeNode, KnifeRegion, KnifeRegions, Vec, add, dist, divideAlong, indexOfId, mul, norm, regionPolyline, sub } from './knife-shape';

export interface BabyPreviewOptions {
  lefts: number;       // including L1
  rights: number;
  crownSplit: number;
}

/** The babies of a wing, lengths in cm. */
export interface WingBabiesSpec {
  lefts: number[];       // L1 -> Ln
  rights: number[];      // R1 -> Rn
  top: number | null;    // null or 0: no top baby
  crown: number[];       // C1 -> Cn
}

export interface PreviewBaby {
  position: string;    // as stored on a wing baby: 'L1', 'R2', 'TOP', 'C1'
  label: string;       // as shown: 'L1', 'R2', 'Top', 'Ca'
  length: number;      // cm
  corners: Vec[];      // base start, outer start, outer end, base end (model units)
}

// sample lengths in cm, graded like a typical wing
const TOP_LENGTH = 10;
const CROWN_LENGTH = 10;
const LEFT_LENGTHS = [6, 9.5];    // L1 -> Ln
const RIGHT_LENGTHS = [5.5, 9];   // R1 -> Rn

// with fewer babies on a side, they are sized as if there were this many (from L1 / R1), so they don't turn into wide wedges
const MIN_SIDE_SLOTS = 4;

interface Boundary { p: Vec; normal: Vec; }

// the outline runs clockwise (y down), so outward is to the left of the direction of travel
const outward = (t: Vec): Vec => ({ x: t.y, y: -t.x });
const angleOf = (v: Vec) => Math.atan2(v.y, v.x);
const direction = (a: number): Vec => ({ x: Math.cos(a), y: Math.sin(a) });

function lerpAngle(a: number, b: number, t: number): number {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
}

/** `count` + 1 directions evenly spread from `from` to `to`. */
function fan(from: Vec, to: Vec, count: number): Vec[] {
  const a0 = angleOf(from), a1 = angleOf(to);
  return Array.from({ length: count + 1 }, (_, i) => direction(lerpAngle(a0, a1, i / count)));
}

function graded(range: number[], i: number, count: number): number {
  const v = count > 1 ? range[0] + (range[1] - range[0]) * i / (count - 1) : range[0];
  return Math.round(v * 2) / 2;
}

function quad(a: Vec, b: Vec, dirA: Vec, dirB: Vec, length: number): Vec[] {
  return [a, add(a, mul(dirA, length)), add(b, mul(dirB, length)), b];
}

/** Divides a region into equal parts, numbered from the end nearest to `startNear`. */
function divideRegion(nodes: KnifeNode[], region: KnifeRegion, parts: number, startNear?: Vec): Boundary[] {
  const pts = divideAlong(regionPolyline(nodes, region), parts).map(b => ({ p: b.p, normal: outward(b.tangent) }));
  if (startNear && pts.length && dist(pts[pts.length - 1].p, startNear) < dist(pts[0].p, startNear)) {
    pts.reverse();
  }
  return pts;
}

/**
 * Direction of the outline edge just beyond a region's end node (end to neighbour, ignoring curvature,
 * so a rounded corner doesn't tilt it).
 */
function directionBeyond(nodes: KnifeNode[], region: KnifeRegion, endId: number): Vec | null {
  const i = indexOfId(nodes, endId);
  if (i < 0) return null;
  const n = nodes.length;
  // leaving backwards from `from`, forwards from `to`
  const neighbour = nodes[endId === region.from ? (i - 1 + n) % n : (i + 1) % n].p;
  return dist(neighbour, nodes[i].p) > 1e-6 ? norm(sub(neighbour, nodes[i].p)) : null;
}

/**
 * The step L1 sits in. L1 may be marked as the whole L (outer end of the ledge to the top of the riser)
 * or as the riser alone; in that case the ledge is the outline edge just below it.
 */
function findStep(nodes: KnifeNode[], l1: KnifeRegion, leftsLine: Vec[]): { corner: Vec; riserTop: Vec; ledgeDir: Vec } | null {
  const line = regionPolyline(nodes, l1);
  if (line.length < 2) {
    return null;
  }
  // the riser's top is the end touching Lefts
  const nearLefts = (p: Vec) => Math.min(dist(p, leftsLine[0]), dist(p, leftsLine[leftsLine.length - 1]));
  const upperIsTo = nearLefts(line[line.length - 1]) <= nearLefts(line[0]);
  if (!upperIsTo) {
    line.reverse();
  }
  const lower = line[0], riserTop = line[line.length - 1];

  // the inner corner of the L is the point farthest from the line joining the two ends
  const chord = sub(riserTop, lower);
  const chordLength = Math.hypot(chord.x, chord.y);
  let corner = lower, farthest = 0;
  for (const p of line) {
    const d = chordLength ? Math.abs(chord.x * (p.y - lower.y) - chord.y * (p.x - lower.x)) / chordLength : 0;
    if (d > farthest) {
      farthest = d;
      corner = p;
    }
  }
  if (farthest > chordLength * 0.15 && dist(corner, lower) > 1e-6) {
    return { corner, riserTop, ledgeDir: norm(sub(lower, corner)) };
  }

  // riser only
  const ledgeDir = directionBeyond(nodes, l1, upperIsTo ? l1.from : l1.to) ?? divideRegion(nodes, l1, 2)[1].normal;
  return { corner: lower, riserTop, ledgeDir };
}

/** The middle of a region and the outward direction there, e.g. to place things next to it. */
export function regionAnchor(nodes: KnifeNode[], region: KnifeRegion | undefined): { p: Vec; normal: Vec } | null {
  const pts = region ? divideRegion(nodes, region, 2) : [];
  return pts.length === 3 ? { p: pts[1].p, normal: pts[1].normal } : null;
}

/** Sample babies, graded like a typical wing. */
export function buildBabyPreview(nodes: KnifeNode[], regions: KnifeRegions, unitsPerCm: number, opts: BabyPreviewOptions): PreviewBaby[] {
  const leftCount = Math.max(1, opts.lefts);
  const rightCount = Math.max(1, opts.rights);
  return buildWingBabies(nodes, regions, unitsPerCm, {
    lefts: Array.from({ length: leftCount }, (_, i) => graded(LEFT_LENGTHS, i, leftCount)),
    rights: Array.from({ length: rightCount }, (_, i) => graded(RIGHT_LENGTHS, i, rightCount)),
    top: TOP_LENGTH,
    crown: Array(Math.max(1, opts.crownSplit)).fill(CROWN_LENGTH)
  });
}

/** Lays a wing's babies on the knife. Returns nothing unless all the regions are marked. */
export function buildWingBabies(nodes: KnifeNode[], regions: KnifeRegions, unitsPerCm: number, spec: WingBabiesSpec): PreviewBaby[] {
  const { l1, lefts, top, rights, crown } = regions;
  if (!l1 || !lefts || !top || !rights || !crown) {
    return [];
  }
  const babies: PreviewBaby[] = [];
  const addBaby = (position: string, label: string, length: number, a: Vec, b: Vec, dirA: Vec, dirB: Vec) =>
    babies.push({ position, label, length, corners: quad(a, b, dirA, dirB, length * unitsPerCm) });

  const topPts = divideRegion(nodes, top, 2);
  const crownPts = divideRegion(nodes, crown, 2);
  const leftsLine = regionPolyline(nodes, lefts);
  const rightsLine = regionPolyline(nodes, rights);
  if (topPts.length < 3 || crownPts.length < 3 || leftsLine.length < 2 || rightsLine.length < 2) {
    return [];
  }

  // Top
  const topDir = topPts[1].normal;
  if (spec.top) {
    addBaby('TOP', 'Top', spec.top, topPts[0].p, topPts[2].p, topDir, topDir);
  }

  // L1 sits in the step (a mirrored L): its base is the riser, its bottom continues the ledge
  const leftCount = spec.lefts.length;
  const leftSlots = Math.max(leftCount, MIN_SIDE_SLOTS);
  const step = leftCount ? findStep(nodes, l1, leftsLine) : null;
  if (step) {
    // L1..Ln share one fan from the ledge to the Top
    const leftDirs = fan(step.ledgeDir, topDir, leftSlots);
    addBaby('L1', 'L1', spec.lefts[0], step.corner, step.riserTop, leftDirs[0], leftDirs[1]);
    const leftPts = divideRegion(nodes, lefts, leftSlots - 1, step.riserTop);
    for (let i = 0; i < Math.min(leftCount - 1, leftPts.length - 1); i++) {
      addBaby('L' + (i + 2), 'L' + (i + 2), spec.lefts[i + 1], leftPts[i].p, leftPts[i + 1].p, leftDirs[i + 1], leftDirs[i + 2]);
    }
  }

  // R1..Rn: one fan from the Crown to the Top
  const rightCount = spec.rights.length;
  const crownDir = crownPts[1].normal;
  if (rightCount) {
    const rightSlots = Math.max(rightCount, MIN_SIDE_SLOTS);
    const rightDirs = fan(crownDir, topDir, rightSlots);
    const rightPts = divideRegion(nodes, rights, rightSlots, crownPts[1].p);
    for (let i = 0; i < Math.min(rightCount, rightPts.length - 1); i++) {
      addBaby('R' + (i + 1), 'R' + (i + 1), spec.rights[i], rightPts[i].p, rightPts[i + 1].p, rightDirs[i], rightDirs[i + 1]);
    }
  }

  // Crown strips: C1 (a) is the farthest from the Rights
  if (spec.crown.length) {
    const nearRights = dist(rightsLine[0], crownPts[1].p) < dist(rightsLine[rightsLine.length - 1], crownPts[1].p)
      ? rightsLine[0] : rightsLine[rightsLine.length - 1];
    const strips = divideRegion(nodes, crown, spec.crown.length, nearRights).reverse();
    for (let i = 0; i < strips.length - 1; i++) {
      addBaby('C' + (i + 1), 'C' + String.fromCharCode(97 + i), spec.crown[i], strips[i].p, strips[i + 1].p, crownDir, crownDir);
    }
  }
  return babies;
}
