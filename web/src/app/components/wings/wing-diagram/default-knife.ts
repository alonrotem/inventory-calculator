// The knife drawn when a wing has no knife: the shape of the original hard-coded wing diagram.

import { KnifeShape } from '../knife-editor/knife-shape';

// the original outline in px at 15 px per cm, clockwise from the outer end of L1's ledge
const PX_PER_CM = 15;
const OUTLINE_PX: [number, number][] = [
  [221, 315],     // 0  outer end of the ledge (L1 from)
  [234, 315],     // 1  inner corner of the step
  [234, 301.5],   // 2  top of the riser (L1 to, Lefts from)
  [354, 231.5],   // 3  Lefts to, Top from
  [385, 231.5],   // 4  Top to, Rights from
  [510, 290],     // 5  Rights to, Crown from
  [510, 326],     // 6  Crown to
  [475, 326],     // 7
  [358.5, 495],   // 8
  [358.5, 531.5], // 9
  [221, 531.5],   // 10
];

const minX = Math.min(...OUTLINE_PX.map(p => p[0]));
const minY = Math.min(...OUTLINE_PX.map(p => p[1]));
const maxX = Math.max(...OUTLINE_PX.map(p => p[0]));
const maxY = Math.max(...OUTLINE_PX.map(p => p[1]));

export const DEFAULT_KNIFE: KnifeShape = {
  size_cm: { width: (maxX - minX) / PX_PER_CM, height: (maxY - minY) / PX_PER_CM },
  nodes: OUTLINE_PX.map(([x, y], i) => ({
    id: i,
    p: { x: (x - minX) / PX_PER_CM, y: (y - minY) / PX_PER_CM },
    hIn: null,
    hOut: null,
    smooth: false
  })),
  regions: {
    l1: { from: 0, to: 2 },
    lefts: { from: 2, to: 3 },
    top: { from: 3, to: 4 },
    rights: { from: 4, to: 5 },
    crown: { from: 5, to: 6 }
  }
};
