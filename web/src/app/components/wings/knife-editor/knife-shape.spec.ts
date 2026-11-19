import { KnifeNode, pointAlong, regionLength, shortestRegion } from './knife-shape';

describe('pointAlong', () => {
  // a 10 x 10 square, clockwise from the top left corner
  const corner = (id: number, x: number, y: number): KnifeNode => ({ id, p: { x, y }, hIn: null, hOut: null, smooth: false });
  const square = [corner(0, 0, 0), corner(1, 10, 0), corner(2, 10, 10), corner(3, 0, 10)];

  it('walks forward from a node, along the segments', () => {
    const at = pointAlong(square, 0, true, 3)!;
    expect(at.index).toBe(0);
    expect(at.t).toBeCloseTo(0.3, 6);
    expect(at.point.x).toBeCloseTo(3, 6);
    const around = pointAlong(square, 0, true, 15)!;   // 10 along the top, 5 down the right side
    expect(around.index).toBe(1);
    expect(around.t).toBeCloseTo(0.5, 6);
    expect(around.point).toEqual({ x: 10, y: 5 });
  });

  it('walks backward from a node, the other way round', () => {
    const at = pointAlong(square, 0, false, 4)!;   // down the left side from the top left corner: segment 3, which runs up
    expect(at.index).toBe(3);
    expect(at.t).toBeCloseTo(0.6, 6);
    expect(at.point.y).toBeCloseTo(4, 6);
  });

  it('is the length that regionLength gives from the start', () => {
    const at = pointAlong(square, 1, true, 13)!;
    expect(regionLength(square, shortestRegion(square, 1, 3))).toBeCloseTo(20, 6);
    expect(at.point).toEqual({ x: 7, y: 10 });
    expect(pointAlong(square, 1, true, 41)).toBeNull();   // more than the whole outline
  });
});
