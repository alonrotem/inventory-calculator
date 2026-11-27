// A knife's outline on an A4 page in real size (1:1, the knife is in cm): its title (name and width) and the outline, in the centre.
// Everything here is in millimeters, measured on the paper.

import { jsPDF } from 'jspdf';
import { Knife } from '../../../../types';
import { KnifeNode, Vec, isStraight, outlineSamples, segment } from './knife-shape';

const A4_MM = { w: 210, h: 297 };
const MARGIN_MM = 10;
/** the strip at the top (and the same at the bottom, to keep the knife in the centre) that is left for the title */
const TITLE_BAND_MM = 22;
const TITLE_HEIGHT_MM = 10;
const TITLE_FONT_MM = 5;
const LINE_WIDTH_MM = 0.3;

type Piece = { c1?: Vec; c2?: Vec; p: Vec };   // a straight line to p, or (with c1 and c2) a bezier curve

export interface KnifeSheet {
  landscape: boolean;
  pageW: number;
  pageH: number;
  title: string;
  start: Vec;
  pieces: Piece[];
}

/** Where the title and outline are on the page; null when the knife doesn't fit an A4 page in real size. */
export function layoutKnifeSheet(knife: Knife, title: string): KnifeSheet | null {
  const nodes = (knife?.data?.nodes ?? []) as KnifeNode[];
  if (nodes.length < 3) {
    return null;
  }
  const pts = outlineSamples(nodes);
  const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
  const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
  const widthMm = (maxX - minX) * 10, heightMm = (maxY - minY) * 10;

  // portrait when it fits, otherwise landscape
  const fits = (pageW: number, pageH: number) => widthMm <= pageW - 2 * MARGIN_MM && heightMm <= pageH - 2 * TITLE_BAND_MM;
  const landscape = !fits(A4_MM.w, A4_MM.h);
  const pageW = landscape ? A4_MM.h : A4_MM.w;
  const pageH = landscape ? A4_MM.w : A4_MM.h;
  if (landscape && !fits(pageW, pageH)) {
    return null;
  }

  // the middle of the knife is the middle of the page
  const dx = pageW / 2 - ((minX + maxX) / 2) * 10;
  const dy = pageH / 2 - ((minY + maxY) / 2) * 10;
  const toPage = (p: Vec): Vec => ({ x: p.x * 10 + dx, y: p.y * 10 + dy });

  const pieces: Piece[] = nodes.map((_, i) => {
    const b = segment(nodes, i);
    return isStraight(nodes, i)
      ? { p: toPage(b[3]) }
      : { c1: toPage(b[1]), c2: toPage(b[2]), p: toPage(b[3]) };
  });
  return { landscape, pageW, pageH, title, start: toPage(nodes[0].p), pieces };
}

/** The title as a picture (the PDF's own fonts have no Hebrew, Yiddish, etc.): a PNG data URL, of the size TITLE_* on the page. */
function titleImage(sheet: KnifeSheet): string {
  const dpi = 300;
  const px = (mm: number) => Math.round(mm / 25.4 * dpi);
  const canvas = document.createElement('canvas');
  canvas.width = px(sheet.pageW - 2 * MARGIN_MM);
  canvas.height = px(TITLE_HEIGHT_MM);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = px(TITLE_FONT_MM);
  const font = (s: number) => `bold ${s}px Arial, "Segoe UI", sans-serif`;
  ctx.font = font(size);
  // a long title is made smaller to fit the page
  const available = canvas.width;
  const measured = ctx.measureText(sheet.title).width;
  if (measured > available) {
    size = Math.floor(size * available / measured);
    ctx.font = font(size);
  }
  ctx.fillText(sheet.title, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL('image/png');
}

/** An A4 PDF with the knife in real size: vector outline, and the title. */
export function knifePdf(sheet: KnifeSheet): jsPDF {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: sheet.landscape ? 'landscape' : 'portrait' });
  pdf.addImage(titleImage(sheet), 'PNG', MARGIN_MM, MARGIN_MM, sheet.pageW - 2 * MARGIN_MM, TITLE_HEIGHT_MM);
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(LINE_WIDTH_MM);
  pdf.setLineJoin('round');
  // jsPDF's lines are relative to the point before them
  let cur = sheet.start;
  const lines = sheet.pieces.map(piece => {
    const rel = piece.c1 && piece.c2
      ? [piece.c1.x - cur.x, piece.c1.y - cur.y, piece.c2.x - cur.x, piece.c2.y - cur.y, piece.p.x - cur.x, piece.p.y - cur.y]
      : [piece.p.x - cur.x, piece.p.y - cur.y];
    cur = piece.p;
    return rel;
  });
  pdf.lines(lines, sheet.start.x, sheet.start.y, [1, 1], 'S', true);
  return pdf;
}

const escapeXml = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]!));

/** The same page as a document with an SVG in millimeters, for the browser to print. */
function knifeHtml(sheet: KnifeSheet): string {
  const f = (v: number) => Math.round(v * 1000) / 1000;
  const d = `M${f(sheet.start.x)} ${f(sheet.start.y)} ` + sheet.pieces.map(piece => piece.c1 && piece.c2
    ? `C${f(piece.c1.x)} ${f(piece.c1.y)} ${f(piece.c2.x)} ${f(piece.c2.y)} ${f(piece.p.x)} ${f(piece.p.y)}`
    : `L${f(piece.p.x)} ${f(piece.p.y)}`).join(' ') + ' Z';
  const { pageW, pageH } = sheet;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeXml(sheet.title)}</title>
<style>
  @page { size: A4 ${sheet.landscape ? 'landscape' : 'portrait'}; margin: 0; }
  html, body { margin: 0; padding: 0; width: ${pageW}mm; height: ${pageH}mm; overflow: hidden; background: #fff; }
  svg { display: block; }
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${pageW}mm" height="${pageH}mm" viewBox="0 0 ${pageW} ${pageH}">
  <text x="${pageW / 2}" y="${MARGIN_MM + TITLE_HEIGHT_MM / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, 'Segoe UI', sans-serif" font-weight="bold" font-size="${TITLE_FONT_MM}">${escapeXml(sheet.title)}</text>
  <path d="${d}" fill="none" stroke="#000" stroke-width="${LINE_WIDTH_MM}" stroke-linejoin="round"/>
</svg></body></html>`;
}

/** Prints the page (in a hidden frame, so that nothing else of the app is on it). */
export function printKnifeSheet(sheet: KnifeSheet): void {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  const cleanup = () => setTimeout(() => frame.remove(), 1000);
  frame.onload = () => {
    const win = frame.contentWindow!;
    win.addEventListener('afterprint', cleanup);
    win.focus();
    win.print();
  };
  frame.srcdoc = knifeHtml(sheet);
  document.body.appendChild(frame);
  // in case the browser doesn't tell when printing ends
  setTimeout(() => frame.remove(), 10 * 60 * 1000);
}
