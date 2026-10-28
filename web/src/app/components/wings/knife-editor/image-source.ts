// Loads a scan (PNG / JPG / PDF page) into a canvas, along with its resolution when the file records it.

export interface LoadedSource {
  canvas: HTMLCanvasElement;
  dpi: number | null;
  pageCount: number;
}

// PDF pages are rendered at this resolution; their physical page size makes the DPI exact
const PDF_DPI = 300;

type PdfJs = typeof import('pdfjs-dist');
let pdfjsPromise: Promise<PdfJs> | null = null;

function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then(lib => {
      lib.GlobalWorkerOptions.workerPort = new Worker(new URL('./pdf.worker', import.meta.url), { type: 'module' });
      return lib;
    });
  }
  return pdfjsPromise;
}

export async function loadImageFile(file: File): Promise<LoadedSource> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
  bitmap.close();
  return { canvas, dpi: readDpi(bytes), pageCount: 1 };
}

export async function loadPdfPage(data: ArrayBuffer, pageNumber: number): Promise<LoadedSource> {
  const pdfjs = await loadPdfJs();
  // pdf.js takes ownership of the buffer it gets, so hand it a copy
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data.slice(0)) }).promise;
  try {
    const page = await doc.getPage(Math.min(Math.max(1, pageNumber), doc.numPages));
    const viewport = page.getViewport({ scale: PDF_DPI / 72 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    return { canvas, dpi: PDF_DPI, pageCount: doc.numPages };
  }
  finally {
    await doc.destroy();
  }
}

/** Reads the resolution stored in a PNG (pHYs chunk) or JPEG (JFIF header). */
export function readDpi(bytes: Uint8Array): number | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const isPng = bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (isPng) {
    let offset = 8;
    while (offset + 8 <= bytes.length) {
      const length = view.getUint32(offset);
      const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
      if (type === 'pHYs' && length >= 9) {
        const perMeter = view.getUint32(offset + 8);
        const unit = bytes[offset + 16];
        return unit === 1 && perMeter > 0 ? Math.round(perMeter * 0.0254) : null;
      }
      if (type === 'IDAT' || type === 'IEND') {
        break;
      }
      offset += 12 + length;
    }
    return null;
  }

  const isJpeg = bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8;
  if (isJpeg) {
    let offset = 2;
    while (offset + 4 <= bytes.length && bytes[offset] === 0xff) {
      const marker = bytes[offset + 1];
      const length = view.getUint16(offset + 2);
      const isJfif = marker === 0xe0 && String.fromCharCode(...bytes.subarray(offset + 4, offset + 9)) === 'JFIF\0';
      if (isJfif) {
        const units = bytes[offset + 11];
        const density = view.getUint16(offset + 12);
        if (units === 1 && density > 1) return density;
        if (units === 2 && density > 1) return Math.round(density * 2.54);
        return null;
      }
      if (marker === 0xda) {
        break;
      }
      offset += 2 + length;
    }
  }
  return null;
}
