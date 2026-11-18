import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { WingDiagramComponent } from './wing-diagram.component';
import { MM_PER_PX, tileStarts } from './print-fit';
import { DIAGRAM_PAGE, composeDiagramPages } from '../../customers/order-editor/order-diagram-page';

describe('WingDiagramComponent for paper', () => {
  async function diagram() {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(WingDiagramComponent);
    const component = fixture.componentInstance;
    component.lefts = [8, 9, 10, 11];
    component.rights = [8, 9, 10];
    component.top_length = [12];
    component.crown = [10, 10, 10, 10];
    component.show_texts = true;
    fixture.detectChanges();
    await fixture.whenStable();
    component.Rebuild();
    return component;
  }
  const pagesOf = (plan: { cols: number; rows: number }) => plan.cols * plan.rows;

  it('draws in real size on a page that is big enough: black on white, upright, on one page', async () => {
    const component = await diagram();
    const printed = component.renderForPrint({ widthMm: 600, heightMm: 800 })!;

    expect(printed).not.toBeNull();
    expect(printed.rotated).toBeFalse();
    expect(printed.croppedMm).toBe(0);
    expect(pagesOf(printed.plan)).toBe(1);
    // the canvas has the size on paper it claims: 3 canvas pixels per CSS pixel, a CSS pixel is 1/96 inch
    expect(printed.canvas.width / 3 * MM_PER_PX).toBeCloseTo(printed.widthMm, 3);
    expect(printed.canvas.height / 3 * MM_PER_PX).toBeCloseTo(printed.heightMm, 3);
    const corner = printed.canvas.getContext('2d')!.getImageData(1, 1, 1, 1).data;
    expect([corner[0], corner[1], corner[2], corner[3]]).toEqual([255, 255, 255, 255]);   // white paper
    const data = printed.canvas.getContext('2d')!.getImageData(0, 0, printed.canvas.width, printed.canvas.height).data;
    let dark = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] < 100) dark++;
    expect(dark).toBeGreaterThan(1000);   // something was drawn
  });

  it('turns it 90 degrees clockwise on a page that is too narrow, still on one page and in real size', async () => {
    const component = await diagram();
    const upright = component.renderForPrint({ widthMm: 600, heightMm: 800 })!;
    const narrow = component.renderForPrint({ widthMm: upright.widthMm - 30, heightMm: 800 })!;

    expect(narrow.rotated).toBeTrue();
    expect(pagesOf(narrow.plan)).toBe(1);
    expect(narrow.heightMm).toBeCloseTo(upright.widthMm, 0);   // turned: what was its width now runs along the page
    expect(narrow.widthMm).toBeLessThanOrEqual(upright.widthMm - 30 + 1);
  });

  it('cuts the bottom off a diagram that is too tall for the page when turned, but never into the babies', async () => {
    const component = await diagram();
    const upright = component.renderForPrint({ widthMm: 600, heightMm: 800 })!;
    const across = upright.heightMm - 20;   // less than the height of the diagram, but more than its babies need
    const turned = component.renderForPrint({ widthMm: across, heightMm: upright.widthMm + 10 })!;

    expect(turned.rotated).toBeTrue();
    expect(pagesOf(turned.plan)).toBe(1);
    expect(turned.croppedMm).toBeGreaterThan(0);
    expect(turned.widthMm).toBeLessThanOrEqual(across + 1);
    // the live drawing is not changed by drawing for paper
    expect(component.renderForPrint({ widthMm: 600, heightMm: 800 })!.widthMm).toBeCloseTo(upright.widthMm, 6);
  });

  it('takes more pages, still in real size, when one page cannot hold it', async () => {
    const component = await diagram();
    const upright = component.renderForPrint({ widthMm: 600, heightMm: 800 })!;
    const small = component.renderForPrint({ widthMm: 120, heightMm: 120 })!;

    expect(pagesOf(small.plan)).toBeGreaterThan(1);
    // real size: the content is as big as the diagram (turned, or not), and only its bottom may be cut off
    const bigSide = Math.max(small.widthMm, small.heightMm), smallSide = Math.min(small.widthMm, small.heightMm);
    expect(bigSide).toBeCloseTo(Math.max(upright.widthMm, upright.heightMm - small.croppedMm), 0);
    expect(smallSide).toBeLessThanOrEqual(Math.min(upright.widthMm, upright.heightMm) + 1);
  });

  it('cuts the pages so that neighbours show the same drawing in the strip they share', async () => {
    const component = await diagram();
    component.lefts = Array(14).fill(15);     // a wing far too big for one page
    component.rights = Array(14).fill(15);
    component.Rebuild();
    const printed = component.renderForPrint({ widthMm: DIAGRAM_PAGE.widthMm, heightMm: DIAGRAM_PAGE.heightMm - DIAGRAM_PAGE.captionMm })!;
    expect(pagesOf(printed.plan)).toBeGreaterThan(1);

    const pages = composeDiagramPages(printed, { title: 'Order', rulerLabel: '10 cm', rtl: false });
    const pageHeight = DIAGRAM_PAGE.heightMm - DIAGRAM_PAGE.captionMm;
    const xs = tileStarts(printed.widthMm, DIAGRAM_PAGE.widthMm, printed.plan.overlapMm);
    const ys = tileStarts(printed.heightMm, pageHeight, printed.plan.overlapMm);
    expect(pages.length).toBe(xs.length * ys.length);
    for (const page of pages) {
      expect(page.width).toBe(Math.round(190 / 25.4 * 300));    // 190 x 276 mm at 300 dpi
      expect(page.height).toBe(Math.round(276 / 25.4 * 300));
    }

    const pxPerMm = 300 / 25.4;
    const read = (page: HTMLCanvasElement, xMm: number, yMm: number, widthMm: number, heightMm: number) =>
      page.getContext('2d')!.getImageData(Math.round(xMm * pxPerMm), Math.round(yMm * pxPerMm), Math.round(widthMm * pxPerMm), Math.round(heightMm * pxPerMm)).data;
    const caption = DIAGRAM_PAGE.captionMm;
    let a: Uint8ClampedArray, b: Uint8ClampedArray;
    if (xs.length > 1) {
      // across: the first page from where the second begins, the second from its start; 3 mm in from the dashed edges
      const width = DIAGRAM_PAGE.widthMm - xs[1] - 6;
      a = read(pages[0], xs[1] + 3, caption + 3, width, 100);
      b = read(pages[1], 3, caption + 3, width, 100);
    }
    else {
      // down
      const height = pageHeight - ys[1] - 6;
      a = read(pages[0], 3, caption + ys[1] + 3, 100, height);
      b = read(pages[1], 3, caption + 3, 100, height);
    }
    let different = 0;
    for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) > 60) different++;
    expect(different / (a.length / 4)).toBeLessThan(0.002);
  });
});
