import { PrintedDiagram } from '../../wings/wing-diagram/wing-diagram.component';
import { tileStarts } from '../../wings/wing-diagram/print-fit';

/** The printable area of an A4 page with 10 mm margins, in millimeters, and the caption (title and ruler) at its top. */
export const DIAGRAM_PAGE = { widthMm: 190, heightMm: 276, captionMm: 14 };

/** The ruler of every page: 10 cm of the diagram, which is in real size, so 100 mm on the paper. If it measures less, the page was not printed at 100%. */
export const RULER_MM = 100;

const DPI = 300;
const PX_PER_MM = DPI / 25.4;

export interface DiagramPageTexts {
  title: string;
  rulerLabel: string;
  /** the language is written right to left: the title and the ruler swap sides */
  rtl: boolean;
}

/**
 * The pages of the diagram, each as one image the size of the printable area (190 x 276 mm): a title with a ruler of exactly 10 cm,
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
  const xs = tileStarts(diagram.widthMm, pageWidth, overlap);
  const ys = tileStarts(diagram.heightMm, pageHeight, overlap);
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

/** The title on one side, the ruler on the other. */
function caption(ctx: CanvasRenderingContext2D, canvasWidth: number, title: string, texts: DiagramPageTexts) {
  const textWidth = (DIAGRAM_PAGE.widthMm - RULER_MM - 6) * PX_PER_MM;
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'top';
  ctx.direction = texts.rtl ? 'rtl' : 'ltr';
  ctx.textAlign = texts.rtl ? 'right' : 'left';
  ctx.font = `bold ${4.4 * PX_PER_MM}px Arial`;
  ctx.fillText(title, texts.rtl ? canvasWidth : 0, 0, textWidth);

  const rulerStart = texts.rtl ? 0 : canvasWidth - RULER_MM * PX_PER_MM;
  const rulerY = 8 * PX_PER_MM;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 0.35 * PX_PER_MM;
  ctx.beginPath();
  ctx.moveTo(rulerStart, rulerY);
  ctx.lineTo(rulerStart + RULER_MM * PX_PER_MM, rulerY);
  for (let cm = 0; cm <= RULER_MM / 10; cm++) {
    const x = rulerStart + cm * 10 * PX_PER_MM;
    const tick = (cm === 0 || cm === RULER_MM / 10) ? 3 : 1.8;
    ctx.moveTo(x, rulerY - tick * PX_PER_MM);
    ctx.lineTo(x, rulerY + tick * PX_PER_MM);
  }
  ctx.stroke();
  ctx.direction = 'ltr';
  ctx.textAlign = 'center';
  ctx.font = `${3.3 * PX_PER_MM}px Arial`;
  ctx.fillText(texts.rulerLabel, rulerStart + RULER_MM * PX_PER_MM / 2, rulerY + 4.2 * PX_PER_MM);
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
