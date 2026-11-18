import { DEFAULT_KNIFE } from '../wing-diagram/default-knife';
import { buildWingBabies } from './baby-preview';

describe('the shape of the top baby', () => {
  const spec = { lefts: [6, 8, 10, 12], rights: [6, 8, 10, 12], top: 10, crown: [10, 10] };
  const build = (extra: { topTilt?: number; topOpening?: number }) =>
    buildWingBabies(DEFAULT_KNIFE.nodes, DEFAULT_KNIFE.regions, 1, { ...spec, ...extra });
  const side = (b: { corners: { x: number; y: number }[] }, from: number, to: number) =>
    Math.atan2(b.corners[to].y - b.corners[from].y, b.corners[to].x - b.corners[from].x) * 180 / Math.PI;
  const widths = (b: { corners: { x: number; y: number }[] }) => [
    Math.hypot(b.corners[3].x - b.corners[0].x, b.corners[3].y - b.corners[0].y),
    Math.hypot(b.corners[2].x - b.corners[1].x, b.corners[2].y - b.corners[1].y)];

  it('is a rectangle without tilt and opening, as before', () => {
    const top = build({}).find(b => b.position == 'TOP')!;
    const [bottom, end] = widths(top);
    expect(end).toBeCloseTo(bottom, 6);
    expect(side(top, 0, 1)).toBeCloseTo(side(top, 3, 2), 6);
    // the same as when the parameters are given as 0
    expect(JSON.stringify(build({ topTilt: 0, topOpening: 0 }))).toBe(JSON.stringify(build({})));
  });

  it('leans as a whole with the tilt, keeping its sides parallel', () => {
    const straight = build({}).find(b => b.position == 'TOP')!;
    const tilted = build({ topTilt: 20 }).find(b => b.position == 'TOP')!;
    expect(side(tilted, 0, 1) - side(straight, 0, 1)).toBeCloseTo(20, 6);
    expect(side(tilted, 3, 2)).toBeCloseTo(side(tilted, 0, 1), 6);
  });

  it('gets wider at its end with the opening, a trapezoid', () => {
    const top = build({ topOpening: 10 }).find(b => b.position == 'TOP')!;
    const [bottom, end] = widths(top);
    expect(end).toBeGreaterThan(bottom);
    expect(Math.abs(side(top, 0, 1) - side(top, 3, 2))).toBeCloseTo(20, 6);   // 10 degrees each side
  });

  it('turns the babies next to it: the last Left and Right follow the side of the Top beside them', () => {
    const last = (babies: ReturnType<typeof build>, p: string) => babies.find(b => b.position == p)!;
    const before = build({}), after = build({ topTilt: 25 });
    // the whole fan leans with the top
    expect(side(last(after, 'L4'), 3, 2)).not.toBeCloseTo(side(last(before, 'L4'), 3, 2), 3);
    expect(side(last(after, 'R4'), 3, 2)).not.toBeCloseTo(side(last(before, 'R4'), 3, 2), 3);
    // the first babies of each side keep to the knife: L1 on the ledge, R1 beside the crown
    expect(side(last(after, 'L1'), 0, 1)).toBeCloseTo(side(last(before, 'L1'), 0, 1), 6);
    expect(side(last(after, 'R1'), 0, 1)).toBeCloseTo(side(last(before, 'R1'), 0, 1), 6);
  });
});

describe('L1 on a knife without a slit', () => {
  const spec = { lefts: [6, 8], rights: [6], top: 10, crown: [10] };
  // L1 is just the riser, a line without the ledge of the step
  const line = { ...DEFAULT_KNIFE.regions, l1: { from: 1, to: 2 } };
  const l1Dir = (horizontalLeft?: { x: number; y: number }) => {
    const l1 = buildWingBabies(DEFAULT_KNIFE.nodes, line, 1, { ...spec, horizontalLeft }).find(b => b.position == 'L1')!;
    return { x: l1.corners[1].x - l1.corners[0].x, y: l1.corners[1].y - l1.corners[0].y };
  };

  it('is horizontal, to the left', () => {
    const d = l1Dir();
    expect(d.y).toBeCloseTo(0, 6);
    expect(d.x).toBeLessThan(0);
  });

  it('is horizontal in the view when the view is turned: it follows the direction given', () => {
    const d = l1Dir({ x: -0.6, y: 0.8 });   // the view's left, in the nodes' coordinates
    const length = Math.hypot(d.x, d.y);
    expect(d.x / length).toBeCloseTo(-0.6, 6);
    expect(d.y / length).toBeCloseTo(0.8, 6);
  });

  it('keeps the ledge direction when L1 has the step (an L)', () => {
    const l1 = buildWingBabies(DEFAULT_KNIFE.nodes, DEFAULT_KNIFE.regions, 1, spec).find(b => b.position == 'L1')!;
    expect(l1.corners[1].y - l1.corners[0].y).toBeCloseTo(0, 6);   // the default ledge is horizontal too
    expect(l1.corners[0].x).toBeCloseTo(DEFAULT_KNIFE.nodes[1].p.x, 6);   // and L1 starts at the inner corner of the step
  });
});
