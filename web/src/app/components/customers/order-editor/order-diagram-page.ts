import { PrintedDiagram } from '../../wings/wing-diagram/wing-diagram.component';
import { tileStarts } from '../../wings/wing-diagram/print-fit';

/** The printable area of an A4 page with 10 mm margins, in millimeters, and the caption (a small title) at its top. */
export const DIAGRAM_PAGE = { widthMm: 190, heightMm: 276, captionMm: 7 };

/** A diagram this much over a page (or less) still takes that one page: the extra is margin. */
const SLIVER_MM = 0.6;

const DPI = 300;
const PX_PER_MM = DPI / 25.4;

export interface DiagramPageTexts {
  title: string;
  /** the language is written right to left: the title is written from the right */
  rtl: boolean;
}

/**
 * The pages of the diagram, each as one image the size of the printable area (190 x 276 mm): a small title,
 * and the diagram under it in real size. Printing shows each image at 190 x 276 mm and the PDF puts it on a page at the same size,
 * so the diagram is 1:1 on paper in both.
 * A diagram that is bigger than one page is cut into pages that overlap by a strip (see OVERLAP_MM): the drawing continues from one
 * page to the next, with dashed lines and crosses on the edges of the strip. To put the pages together, lay each one over its
 * neighbour so that the drawing and the crosses match, and tape them.
 */
export function composeDiagramPages(diagram: PrintedDiagram, texts: DiagramPageTexts): HTMLCanvasElement[] {
  const pageWidth = DIAGRAM_PAGE.widthMm;
  const pageHeight = DIAGRAM_PAGE.heightMm - DIAGRAM_PAGE.captionMm;
  const overlap = diagram.plan.overlapMm;
  // what is a hair over the page (the canvas has whole pixels) is not worth a page that would repeat nearly all of the last one
  const fits = (length: number, page: number) => length <= page + SLIVER_MM ? Math.min(length, page) : length;
  const xs = tileStarts(fits(diagram.widthMm, pageWidth), pageWidth, overlap);
  const ys = tileStarts(fits(diagram.heightMm, pageHeight), pageHeight, overlap);
  const sourcePxPerMm = diagram.canvas.width / diagram.widthMm;
  const total = xs.length * ys.length;

  const pages: HTMLCanvasElement[] = [];
  ys.forEach((sy, row) => xs.forEach((sx, col) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(DIAGRAM_PAGE.widthMm * PX_PER_MM);
    canvas.height = Math.round(DIAGRAM_PAGE.heightMm * PX_PER_MM);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const number = row * xs.length + col + 1;
    caption(ctx, canvas.width, total > 1 ? `${texts.title} (${number}/${total})` : texts.title, texts);

    // what this page shows of the diagram, and where: centered across the page when the diagram is narrower, else from its left
    const width = Math.min(pageWidth, diagram.widthMm - sx);
    const height = Math.min(pageHeight, diagram.heightMm - sy);
    const left = xs.length === 1 ? (pageWidth - width) / 2 : 0;
    const top = DIAGRAM_PAGE.captionMm;
    ctx.drawImage(diagram.canvas, sx * sourcePxPerMm, sy * sourcePxPerMm, width * sourcePxPerMm, height * sourcePxPerMm,
      left * PX_PER_MM, top * PX_PER_MM, width * PX_PER_MM, height * PX_PER_MM);

    // the strips shared with the neighbours: a dashed line where the neighbour's edge goes, with crosses at its ends
    const vertical = [
      ...(col < xs.length - 1 ? [xs[col + 1] - sx] : []),   // where the next page's left edge goes
      ...(col > 0 ? [xs[col - 1] + pageWidth - sx] : [])    // where the previous page's right edge goes
    ];
    const horizontal = [
      ...(row < ys.length - 1 ? [ys[row + 1] - sy] : []),
      ...(row > 0 ? [ys[row - 1] + pageHeight - sy] : [])
    ];
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.25 * PX_PER_MM;
    ctx.setLineDash([2 * PX_PER_MM, 2 * PX_PER_MM]);
    vertical.forEach(x => line(ctx, left + x, top, left + x, top + height));
    horizontal.forEach(y => line(ctx, left, top + y, left + width, top + y));
    ctx.setLineDash([]);
    vertical.forEach(x => [0, height].forEach(y => cross(ctx, left + x, top + y)));
    horizontal.forEach(y => [0, width].forEach(x => cross(ctx, left + x, top + y)));
    pages.push(canvas);
  }));
  return pages;
}

/** The title, small, at the top. */
function caption(ctx: CanvasRenderingContext2D, canvasWidth: number, title: string, texts: DiagramPageTexts) {
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'top';
  ctx.direction = texts.rtl ? 'rtl' : 'ltr';
  ctx.textAlign = texts.rtl ? 'right' : 'left';
  ctx.font = `bold ${3.4 * PX_PER_MM}px Arial`;
  ctx.fillText(title, texts.rtl ? canvasWidth : 0, 0.8 * PX_PER_MM, canvasWidth);
  ctx.direction = 'ltr';
  ctx.textAlign = 'center';
}

/** a line, in millimeters on the page */
function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1 * PX_PER_MM, y1 * PX_PER_MM);
  ctx.lineTo(x2 * PX_PER_MM, y2 * PX_PER_MM);
  ctx.stroke();
}

/** a registration cross, in millimeters on the page */
function cross(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const arm = 3;
  line(ctx, x - arm, y, x + arm, y);
  line(ctx, x, y - arm, x, y + arm);
}
