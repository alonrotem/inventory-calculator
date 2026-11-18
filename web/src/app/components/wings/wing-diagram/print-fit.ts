/**
 * Putting a wing diagram on paper in real size (1:1), on as few pages as possible.
 * Everything here is in millimeters, measured on the paper.
 */

/** CSS pixels per centimeter at 100%: browsers (and PDF) show a CSS px as 1/96 inch, so this is what draws a real centimeter. */
export const PX_PER_CM_1TO1 = 96 / 2.54;
export const MM_PER_PX = 25.4 / 96;

/** How much two neighbouring pages show of the same drawing, so that they can be matched and taped together. */
export const OVERLAP_MM = 10;

/** What the diagram measures in real size. */
export interface DiagramSize {
  widthMm: number;
  heightMm: number;
  /** from the top of the diagram to the bottom of the lowest baby (with its length), which must never be cropped */
  babiesBottomMm: number;
}

export interface PagePlan {
  /** turned 90 degrees clockwise: the diagram's width runs along the height of the page */
  rotated: boolean;
  /** how much of the bottom of the diagram is cut off (before turning it) */
  cropBottomMm: number;
  /** the diagram as it is on paper (turned, with its bottom cut off), before it is cut into pages */
  contentWidthMm: number;
  contentHeightMm: number;
  /** pages across and down: 1 x 1 when it fits one page */
  cols: number;
  rows: number;
  overlapMm: number;
}

/** How many pages of a size are needed for a length, when neighbours overlap. */
export function tileCount(length: number, page: number, overlap = OVERLAP_MM): number {
  return length <= page + 1e-9 ? 1 : Math.ceil((length - overlap) / (page - overlap) - 1e-9);
}

/** Where each page starts along a length. The last one ends exactly at the end (so it overlaps its neighbour more). */
export function tileStarts(length: number, page: number, overlap = OVERLAP_MM): number[] {
  const count = tileCount(length, page, overlap);
  return Array.from({ length: count }, (_, k) => Math.max(0, Math.min(k * (page - overlap), length - page)));
}

/** The length that `count` pages can show. */
function capacity(count: number, page: number, overlap: number): number {
  return count * page - (count - 1) * overlap;
}

/**
 * Real size always, and the fewest pages:
 *  1. upright on one page, when all of it fits;
 *  2. otherwise turned 90 degrees on one page, where the bottom may be cut off as long as all the babies stay
 *     (and as much as fits under them is shown);
 *  3. otherwise on several pages that overlap: the upright or the turned layout that needs fewer pages
 *     (the babies are never cut off; on a tie the one that cuts less off, then the upright one).
 */
export function planPages(size: DiagramSize, pageWidthMm: number, pageHeightMm: number, overlap = OVERLAP_MM): PagePlan {
  const one = (rotated: boolean, visibleHeight: number): PagePlan => ({
    rotated,
    cropBottomMm: size.heightMm - visibleHeight,
    contentWidthMm: rotated ? visibleHeight : size.widthMm,
    contentHeightMm: rotated ? size.widthMm : visibleHeight,
    cols: 1,
    rows: 1,
    overlapMm: overlap
  });
  if (size.widthMm <= pageWidthMm && size.heightMm <= pageHeightMm) {
    return one(false, size.heightMm);
  }
  if (size.widthMm <= pageHeightMm && size.babiesBottomMm <= pageWidthMm) {
    return one(true, Math.min(size.heightMm, pageWidthMm));
  }

  const candidates: PagePlan[] = [false, true].map(rotated => {
    // the height of the diagram is on the page's height when upright, across it when turned
    const heightPage = rotated ? pageWidthMm : pageHeightMm;
    const widthPage = rotated ? pageHeightMm : pageWidthMm;
    const heightTiles = tileCount(size.babiesBottomMm, heightPage, overlap);   // the fewest that keep all the babies
    const visibleHeight = Math.min(size.heightMm, capacity(heightTiles, heightPage, overlap));   // and as much below them as they hold
    const widthTiles = tileCount(size.widthMm, widthPage, overlap);
    const usedHeightTiles = tileCount(visibleHeight, heightPage, overlap);
    return {
      rotated,
      cropBottomMm: size.heightMm - visibleHeight,
      contentWidthMm: rotated ? visibleHeight : size.widthMm,
      contentHeightMm: rotated ? size.widthMm : visibleHeight,
      cols: rotated ? usedHeightTiles : widthTiles,
      rows: rotated ? widthTiles : usedHeightTiles,
      overlapMm: overlap
    };
  });
  candidates.sort((a, b) =>
    (a.cols * a.rows - b.cols * b.rows) || (a.cropBottomMm - b.cropBottomMm) || (Number(a.rotated) - Number(b.rotated)));
  return candidates[0];
}
