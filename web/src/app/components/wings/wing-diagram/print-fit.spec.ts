import { DiagramSize, MM_PER_PX, OVERLAP_MM, PX_PER_CM_1TO1, planPages, tileCount, tileStarts } from './print-fit';

describe('real size on paper', () => {
  it('a centimeter is a real centimeter: 96 CSS pixels are an inch', () => {
    expect(PX_PER_CM_1TO1 * MM_PER_PX).toBeCloseTo(10, 6);   // 1 cm drawn is 10 mm on paper
  });
});

describe('tiles', () => {
  it('counts the pages a length needs, when neighbours overlap', () => {
    expect(tileCount(190, 190)).toBe(1);
    expect(tileCount(100, 190)).toBe(1);
    expect(tileCount(190.5, 190)).toBe(2);
    expect(tileCount(302.4, 190)).toBe(2);
    expect(tileCount(370, 190)).toBe(2);          // 190 + 180
    expect(tileCount(370.5, 190)).toBe(3);
  });

  it('starts every page where the previous one ends, minus the overlap, and the last one ends at the end', () => {
    expect(tileStarts(100, 190)).toEqual([0]);
    expect(tileStarts(302.4, 190)).toEqual([0, 302.4 - 190]);
    expect(tileStarts(370, 190)).toEqual([0, 180]);
    expect(tileStarts(560, 190)).toEqual([0, 180, 360, 370]);   // the last one ends at 560
  });

  it('covers the whole length, and neighbours share at least the overlap (many lengths)', () => {
    for (let length = 50; length <= 900; length += 7.3) {
      const starts = tileStarts(length, 190);
      expect(starts.length).toBe(tileCount(length, 190));
      expect(starts[0]).toBe(0);
      expect(Math.max(...starts) + 190).toBeGreaterThanOrEqual(length - 1e-9);
      for (let i = 1; i < starts.length; i++) {
        expect(starts[i - 1] + 190 - starts[i]).toBeGreaterThanOrEqual(OVERLAP_MM - 1e-9);
      }
    }
  });
});

describe('planPages', () => {
  const PAGE_W = 190, PAGE_H = 262;
  const pages = (plan: { cols: number; rows: number }) => plan.cols * plan.rows;

  it('keeps it upright on one page when all of it fits', () => {
    const plan = planPages({ widthMm: 150, heightMm: 200, babiesBottomMm: 120 }, PAGE_W, PAGE_H);
    expect(plan).toEqual({ rotated: false, cropBottomMm: 0, contentWidthMm: 150, contentHeightMm: 200, cols: 1, rows: 1, overlapMm: OVERLAP_MM });
  });

  it('turns it 90 degrees when it is too wide for the page, keeping everything', () => {
    const plan = planPages({ widthMm: 230, heightMm: 150, babiesBottomMm: 140 }, PAGE_W, PAGE_H);
    expect(plan.rotated).toBeTrue();
    expect(plan.cropBottomMm).toBe(0);
    expect(plan.contentWidthMm).toBe(150);    // its height, now across the page
    expect(plan.contentHeightMm).toBe(230);   // its width, now along the page
    expect(pages(plan)).toBe(1);
  });

  it('turns it and cuts its bottom off when it is too tall, as far as the babies allow', () => {
    const plan = planPages({ widthMm: 240, heightMm: 300, babiesBottomMm: 150 }, PAGE_W, PAGE_H);
    expect(plan.rotated).toBeTrue();
    expect(pages(plan)).toBe(1);
    expect(plan.contentWidthMm).toBe(PAGE_W);          // as much as the page's width holds...
    expect(plan.cropBottomMm).toBe(300 - PAGE_W);      // ...of the 300 mm height
    expect(300 - plan.cropBottomMm).toBeGreaterThanOrEqual(150);   // all the babies are in what is left
  });

  it('uses more pages, in real size, when one page cannot hold it: the wide wing measured from the seed data', () => {
    // 28.95 x 23.57 cm of drawing and margins: 302.4 x 257.7 mm, its babies reach 160 mm from the top
    const plan = planPages({ widthMm: 302.4, heightMm: 257.7, babiesBottomMm: 160 }, PAGE_W, PAGE_H);
    expect(pages(plan)).toBe(2);
    expect(plan.rotated).toBeFalse();            // a tie in pages: the one that cuts nothing off, upright
    expect(plan.cropBottomMm).toBe(0);
    expect(plan.contentWidthMm).toBe(302.4);
    expect(plan.cols).toBe(2);
    expect(plan.rows).toBe(1);
  });

  it('cuts the bottom off only to save a page, never into the babies', () => {
    // 600 mm wide: 4 pages across upright; turned it is 3 pages along, and its 280 mm height is 2 across, or 1 when the bottom is cut
    const size: DiagramSize = { widthMm: 600, heightMm: 280, babiesBottomMm: 150 };
    const plan = planPages(size, PAGE_W, PAGE_H);
    expect(pages(plan)).toBeLessThanOrEqual(3);
    expect(size.heightMm - plan.cropBottomMm).toBeGreaterThanOrEqual(size.babiesBottomMm);
  });

  it('never cuts into the babies, always covers what it keeps, and prefers fewer pages (many sizes)', () => {
    for (let widthMm = 80; widthMm <= 700; widthMm += 40) {
      for (let heightMm = 80; heightMm <= 500; heightMm += 40) {
        for (const share of [0.3, 0.6, 0.9, 1]) {
          const size = { widthMm, heightMm, babiesBottomMm: heightMm * share };
          const plan = planPages(size, PAGE_W, PAGE_H);
          const label = JSON.stringify({ size, plan });
          const visibleHeight = size.heightMm - plan.cropBottomMm;
          expect(plan.cropBottomMm).withContext(label).toBeGreaterThanOrEqual(0);
          expect(visibleHeight).withContext(label).toBeGreaterThanOrEqual(size.babiesBottomMm - 1e-6);
          // the content is the diagram turned or not, minus its bottom
          expect(plan.contentWidthMm).withContext(label).toBeCloseTo(plan.rotated ? visibleHeight : size.widthMm, 6);
          expect(plan.contentHeightMm).withContext(label).toBeCloseTo(plan.rotated ? size.widthMm : visibleHeight, 6);
          // and the pages cover it
          expect(plan.cols).withContext(label).toBe(tileCount(plan.contentWidthMm, PAGE_W));
          expect(plan.rows).withContext(label).toBe(tileCount(plan.contentHeightMm, PAGE_H));
          // no layout the planner could have chosen takes fewer pages (upright or turned, bottom cut off as far as the babies allow)
          const upright = tileCount(size.widthMm, PAGE_W) * tileCount(size.babiesBottomMm, PAGE_H);
          const turned = tileCount(size.widthMm, PAGE_H) * tileCount(size.babiesBottomMm, PAGE_W);
          expect(pages(plan)).withContext(label).toBeLessThanOrEqual(Math.max(1, Math.min(upright, turned)));
        }
      }
    }
  });
});
