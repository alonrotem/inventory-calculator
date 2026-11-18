import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalsService } from '../../../services/globals.service';
import { KnivesService } from '../../../services/knives.service';
import { Knife } from '../../../../types';
import { DEFAULT_GUIDE_CM, GUIDE_COLOR, GUIDE_GRAB_PX, MAX_GUIDE_CM, knifeLeftEdge, snapGuideCm, KnifeRegion, KnifeShape, Vec, add, dist, isStraight, lerp, measureSpan, mul, norm, outlineSamples, segment, sub } from '../knife-editor/knife-shape';
import { PreviewBaby, buildWingBabies, regionAnchor } from '../knife-editor/baby-preview';
import { DEFAULT_KNIFE } from './default-knife';
import { WingBabyEdit } from './wing-baby-edit';
import { DiagramSize, MM_PER_PX, PX_PER_CM_1TO1, PagePlan, planPages } from './print-fit';

type AddSide = 'L' | 'R' | 'TOP' | 'C';
interface AddButton { side: AddSide; x: number; y: number; title: string; }

/** The diagram drawn for paper, always in real size: 1 cm drawn is 1 cm on paper. */
export interface PrintedDiagram {
  /** the diagram as it is on paper (turned and with its bottom cut off, see plan), which may be bigger than a page: it is cut into pages */
  canvas: HTMLCanvasElement;
  /** the size of the canvas on the paper */
  widthMm: number;
  heightMm: number;
  /** turned 90 degrees clockwise */
  rotated: boolean;
  /** the bottom of the diagram that was cut off (all the babies are always kept) */
  croppedMm: number;
  plan: PagePlan;
}

const BASE_PX_PER_CM = 15;           // scale 1
const MIN_PX_PER_CM_FIT = 0.5;       // auto fit limits
const MAX_PX_PER_CM = 24;
const AUTO_FIT_RATIO = 0.8;          // of the container's width, unless max_width is given (e.g. a small preview)
const ADD_BUTTON_SIZE = 24;          // px, as in the scss
const HIGHLIGHT_COLOR = '#ffc107';
const HIGHLIGHT_TEXT_COLOR = '#212529';
const DELETE_COLOR = '#dc3545';
const DELETE_RADIUS = 8;             // px
const WHEEL_STEP_DELTA = 50;         // wheel delta (px) per length step, so a touchpad doesn't race
const FONT = '11px Arial';
const WIDTH_DIMENSION_ROOM = 34;     // px under the knife for its width
const PRINT_RESOLUTION = 3;          // canvas pixels per CSS pixel when drawing for paper (288 dpi)

/**
 * Draws a wing: its knife, with the babies laid out around it.
 * The knife is loaded by id; without one, the default (original) wing shape is drawn.
 * Hovering a baby highlights it and shows a tooltip; clicking it emits babyClicked.
 * When editable, babies can also be added (+ buttons), removed (x) and resized (mouse wheel);
 * those edits are emitted through babyEdited and are shown once the host updates the inputs (see applyBabyEdit).
 */
import { TranslationService } from '../../../i18n/translation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-wing-diagram',
  standalone: true,
  imports: [],
  templateUrl: './wing-diagram.component.html',
  styleUrl: './wing-diagram.component.scss'
})
export class WingDiagramComponent implements AfterViewInit, OnChanges, OnDestroy {
  private translation = inject(TranslationService);


  //inputs
  @Input() lefts: number[] = [];          // lengths in cm, L1 -> Ln
  @Input() rights: number[] = [];         // lengths in cm, R1 -> Rn
  @Input() top_length: number[] = [];     // [length], or empty when there is no top baby
  @Input() crown: number[] = [];          // lengths in cm, C1 -> Cn (the split crown)
  @Input() split_l1 = 1;
  @Input() top_tilt = 0;                  // degrees the top baby leans to the right (negative: left)
  @Input() top_opening = 0;               // degrees each side of the top baby opens outwards (a trapezoid)
  @Input() knife_id: number | null = null;
  @Input() auto_fit = true;               // fit the container's width; otherwise drawn by `scale`
  @Input() scale = 1;                     // 1 = 15px per cm, when not auto fitting
  @Input() show_tooltips = true;
  @Input() highlight_mouseover_baby = true;
  @Input() show_texts = true;
  @Input() preset_theme = "";
  @Input() min_width: number | null = null;
  @Input() max_width: number | null = null;
  @Input() min_height: number | null = null;
  @Input() max_height: number | null = null;
  @Input() editable = false;
  @Input() min_baby_length = 5;
  @Input() max_baby_length = 16;
  @Input() baby_length_step = 0.5;
  @Output() babyClicked = new EventEmitter<string>();       // the baby's position, e.g. 'L1', 'TOP', 'C2'
  @Output() babyEdited = new EventEmitter<WingBabyEdit>();

  @ViewChild('diagram_container') containerRef!: ElementRef<HTMLElement>;
  @ViewChild('diagram_canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tooltip') tooltipRef!: ElementRef<HTMLElement>;

  addButtons: AddButton[] = [];

  color: string = "";
  backcolor: string = "";

  // null while the knife is loading
  private knife: KnifeShape | null = DEFAULT_KNIFE;
  private knifeWidth: number | null = null;
  private knifeRequest = 0;
  private babies: PreviewBaby[] = [];
  private screenBabies: Vec[][] = [];
  private pxPerCm = BASE_PX_PER_CM;
  private offset: Vec = { x: 0, y: 0 };
  private cssWidth = 0;
  private cssHeight = 0;
  private inputsKey = '';
  private containerWidth = -1;

  private hovered = -1;
  private onDelete = false;
  private mouse: { offset: Vec; client: Vec } | null = null;
  private wheelDelta = 0;
  private drawQueued = false;
  private guideCm = DEFAULT_GUIDE_CM;   // not saved: for looking at the diagram only
  private guideHot = false;             // the mouse is on the guide line, or is dragging it
  private guideDrag = false;

  private resizeObserver?: ResizeObserver;
  private themeSubscription: Subscription;
  private removeListeners: (() => void)[] = [];

  constructor(private globalService: GlobalsService, private knivesService: KnivesService, private ngZone: NgZone) {
    this.setColors(this.globalService.currentTheme());
    this.translation.changed.pipe(takeUntilDestroyed()).subscribe(() => this.scheduleDraw());   // the texts on the canvas
    this.themeSubscription = this.globalService.themeChanged.subscribe({
      next: (theme: string) => this.setColors(theme)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preset_theme']) {
      this.setColors(this.globalService.currentTheme());
    }
    if (changes['knife_id']) {
      this.loadKnife();
    }
    // the hosts pass the babies through impure pipes, so new arrays arrive on every change detection
    const key = JSON.stringify([
      this.lefts, this.rights, this.top_length, this.crown, this.split_l1, this.top_tilt, this.top_opening, this.auto_fit, this.scale, this.show_texts,
      this.editable, this.min_width, this.max_width, this.min_height, this.max_height
    ]);
    if (key != this.inputsKey) {
      this.inputsKey = key;
      this.Rebuild();
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      const listen = (type: string, handler: (e: any) => void, options?: AddEventListenerOptions) => {
        canvas.addEventListener(type, handler, options);
        this.removeListeners.push(() => canvas.removeEventListener(type, handler, options));
      };
      listen('mousemove', (e: MouseEvent) => this.mouseMove(e));
      listen('pointerdown', (e: PointerEvent) => this.pointerDown(e));
      // a cancelled pointerdown (to keep the text from being selected) stops the mouse events until the button is released: drag with pointer events
      listen('pointermove', (e: PointerEvent) => this.pointerMove(e));
      listen('pointerup', () => this.guideDrag = false);
      listen('pointercancel', () => this.guideDrag = false);
      listen('mouseleave', () => this.mouseLeave());
      listen('click', () => this.click());
      listen('wheel', (e: WheelEvent) => this.wheel(e), { passive: false });

      this.resizeObserver = new ResizeObserver(() => {
        // the canvas' own size changes the container's height, only a new width needs a new layout
        const width = this.containerRef.nativeElement.clientWidth;
        if (width != this.containerWidth) {
          this.ngZone.run(() => this.layout());
        }
      });
      this.resizeObserver.observe(this.containerRef.nativeElement);
    });
    // after this change detection, as the layout updates the add buttons
    Promise.resolve().then(() => this.Rebuild());
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.removeListeners.forEach(remove => remove());
    this.themeSubscription.unsubscribe();
  }

  setColors(theme: string) {
    const theme_to_set = (this.preset_theme != "") ? this.preset_theme : theme;
    this.color = (theme_to_set == "dark") ? "#f8f9fa" : "#212529";
    this.backcolor = (theme_to_set == "dark") ? "#212529" : "#f8f9fa";
    this.scheduleDraw();
  }

  private loadKnife() {
    const request = ++this.knifeRequest;
    if (!this.knife_id) {
      this.setKnife(null);
      return;
    }
    this.knife = null;
    this.Rebuild();
    this.knivesService.getKnife(this.knife_id).subscribe({
      next: (knife: Knife) => {
        if (request == this.knifeRequest) {
          this.setKnife(knife?.data?.nodes?.length >= 3 ? knife : null);
        }
      },
      error: () => {
        if (request == this.knifeRequest) {
          this.setKnife(null);
        }
      }
    });
  }

  /** null: the default knife */
  private setKnife(knife: Knife | null) {
    this.knife = knife ? (knife.data as unknown as KnifeShape) : DEFAULT_KNIFE;
    this.knifeWidth = knife ? knife.width_cm : null;
    this.Rebuild();
  }

  /** Lays out the babies again and redraws. */
  public Rebuild() {
    this.babies = this.knife ? buildWingBabies(this.knife.nodes, this.knife.regions, 1, {
      lefts: this.lefts ?? [],
      rights: this.rights ?? [],
      top: this.top_length?.[0] || null,
      crown: this.crown ?? [],
      topTilt: this.top_tilt || 0,
      topOpening: this.top_opening || 0
    }) : [];
    this.layout();
  }

  // ---------- layout & drawing ----------

  private toScreen = (p: Vec): Vec => ({ x: this.offset.x + p.x * this.pxPerCm, y: this.offset.y + p.y * this.pxPerCm });

  /** The bounds of the knife and its babies, in cm (the knife must be loaded). */
  private boundsCm(forGuide = false) {
    const pts = [...outlineSamples(this.knife!.nodes), ...this.babies.flatMap(b => b.corners)];
    // on the screen there is room for the guide line, wherever it is dragged to
    if (forGuide) {
      pts.push({ x: knifeLeftEdge(this.knife!.nodes, p => p) - MAX_GUIDE_CM, y: pts[0].y });
    }
    const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
    const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
    const babyYs = this.babies.flatMap(b => b.corners.map(p => p.y));
    return {
      minX, maxX, minY, maxY,
      width: (maxX - minX) || 1,
      height: (maxY - minY) || 1,
      babiesMaxY: babyYs.length ? Math.max(...babyYs) : minY
    };
  }

  private layout() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return;
    }
    const container = this.containerRef.nativeElement;
    this.containerWidth = container.clientWidth;
    if (!this.knife) {
      this.addButtons = [];
      this.draw();
      return;
    }

    const { minX, minY, width, height } = this.boundsCm(this.show_texts);
    // room for the lengths and the add buttons, and under the knife for its width
    const margin = (this.show_texts ? 24 : 4) + (this.editable ? 28 : 0);
    const widthRoom = this.showsWidth() ? WIDTH_DIMENSION_ROOM : 0;

    let available = this.containerWidth;
    if (this.max_width !== null) available = Math.min(available, this.max_width);
    else available *= AUTO_FIT_RATIO;
    if (this.min_width !== null) available = Math.max(available, this.min_width);
    if (this.auto_fit && available > 0) {
      let fit = (available - 2 * margin) / width;
      if (this.max_height !== null) {
        fit = Math.min(fit, (this.max_height - 2 * margin - widthRoom) / height);
      }
      // no lower limit, so a small preview (max_width) still fits
      this.pxPerCm = Math.min(MAX_PX_PER_CM, Math.max(MIN_PX_PER_CM_FIT, fit));
    }
    else {
      this.pxPerCm = BASE_PX_PER_CM * this.scale;
    }

    this.cssWidth = Math.ceil(width * this.pxPerCm + 2 * margin);
    this.cssHeight = Math.ceil(Math.max(height * this.pxPerCm + 2 * margin + widthRoom, this.min_height ?? 0));
    this.offset = {
      x: margin - minX * this.pxPerCm,
      y: (this.cssHeight - widthRoom - height * this.pxPerCm) / 2 - minY * this.pxPerCm
    };
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = this.cssWidth + 'px';
    canvas.style.height = this.cssHeight + 'px';
    canvas.width = Math.round(this.cssWidth * dpr);
    canvas.height = Math.round(this.cssHeight * dpr);

    this.screenBabies = this.babies.map(b => b.corners.map(this.toScreen));
    this.addButtons = this.editable ? this.buildAddButtons() : [];

    // the babies moved under the cursor
    if (this.mouse) {
      this.updateHover();
    }
    this.draw();
  }

  /**
   * A + button for the Lefts, the Rights and the Crown: past the tip of the side's last baby,
   * or outside the middle of the region while it has none; and on the Top while there is no top baby.
   * Kept inside the canvas.
   */
  private buildAddButtons(): AddButton[] {
    const buttons: AddButton[] = [];
    const regions = this.knife!.regions;
    const sides: { side: AddSide; region: KnifeRegion | undefined; title: string }[] = [
      { side: 'L', region: regions.lefts, title: this.translation.t('wings:diagram.add_left', { n: (this.lefts?.length ?? 0) + 1 }) },
      { side: 'R', region: regions.rights, title: this.translation.t('wings:diagram.add_right', { n: (this.rights?.length ?? 0) + 1 }) },
      { side: 'C', region: regions.crown, title: this.translation.t('wings:diagram.add_crown') },
    ];
    if (!this.top_length?.[0]) {
      sides.push({ side: 'TOP', region: regions.top, title: this.translation.t('wings:diagram.add_top') });
    }
    const half = ADD_BUTTON_SIZE / 2 + 2;
    for (const { side, region, title } of sides) {
      const anchor = regionAnchor(this.knife!.nodes, region);
      if (!anchor) {
        continue;
      }
      // the babies are laid out in order, so the last one drawn on this side is the last baby
      const lastIndex = this.babies.map(b => b.position.startsWith(side)).lastIndexOf(true);
      let at: Vec;
      if (lastIndex >= 0) {
        const c = this.screenBabies[lastIndex];
        const baseMid = lerp(c[0], c[3], 0.5), outerMid = lerp(c[1], c[2], 0.5);
        at = add(outerMid, mul(norm(sub(outerMid, baseMid)), 30));   // beyond its length label
      }
      else {
        at = add(this.toScreen(anchor.p), mul(anchor.normal, 22));
      }
      buttons.push({
        side,
        x: Math.min(this.cssWidth - half, Math.max(half, at.x)),
        y: Math.min(this.cssHeight - half, Math.max(half, at.y)),
        title
      });
    }
    return buttons;
  }

  /** The knife's width is shown for a real knife, not the default one. */
  private showsWidth(): boolean {
    return this.show_texts && !!this.knifeWidth;
  }

  /** Resolves true when the knife is loaded (until then a diagram with a knife id draws nothing), false after the time is up. */
  async whenReady(timeoutMs = 10000): Promise<boolean> {
    const until = Date.now() + timeoutMs;
    while (this.knife === null && Date.now() < until) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return this.knife !== null;
  }

  /**
   * Draws the diagram for paper, black on white and in real size: 1 cm of the knife is 1 cm on the paper (a CSS px is 1/96 inch,
   * in print and in a PDF). It is turned 90 degrees clockwise and/or has its bottom cut off, as far as the babies allow, when that
   * lets it fit a page; when it does not fit one page, the plan (see planPages) says how many pages it takes.
   * The live diagram is not touched. Null while the knife is not loaded.
   */
  renderForPrint(page: { widthMm: number; heightMm: number }): PrintedDiagram | null {
    if (!this.knife) {
      return null;
    }
    const b = this.boundsCm();
    const margin = this.show_texts ? 24 : 4;
    const widthRoom = this.showsWidth() ? WIDTH_DIMENSION_ROOM : 0;
    const pxPerCm = PX_PER_CM_1TO1;
    const plan = planPages({
      widthMm: (b.width * pxPerCm + 2 * margin) * MM_PER_PX,
      heightMm: (b.height * pxPerCm + 2 * margin + widthRoom) * MM_PER_PX,
      babiesBottomMm: ((b.babiesMaxY - b.minY) * pxPerCm + 2 * margin) * MM_PER_PX
    }, page.widthMm, page.heightMm);

    const cssWidth = Math.ceil(b.width * pxPerCm + 2 * margin);
    const cssHeight = Math.ceil(b.height * pxPerCm + 2 * margin + widthRoom);
    const source = document.createElement('canvas');
    source.width = cssWidth * PRINT_RESOLUTION;
    source.height = cssHeight * PRINT_RESOLUTION;
    const ctx = source.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, source.width, source.height);
    ctx.setTransform(PRINT_RESOLUTION, 0, 0, PRINT_RESOLUTION, 0, 0);

    // the drawing code uses the diagram's own frame and colors: borrow them for the paper, then put the screen's back
    const saved = {
      color: this.color, backcolor: this.backcolor, pxPerCm: this.pxPerCm, offset: this.offset,
      cssWidth: this.cssWidth, cssHeight: this.cssHeight, screenBabies: this.screenBabies, hovered: this.hovered
    };
    try {
      this.color = '#000000';
      this.backcolor = '#ffffff';
      this.pxPerCm = pxPerCm;
      this.cssWidth = cssWidth;
      this.cssHeight = cssHeight;
      this.offset = { x: margin - b.minX * pxPerCm, y: (cssHeight - widthRoom - b.height * pxPerCm) / 2 - b.minY * pxPerCm };
      this.hovered = -1;
      this.screenBabies = this.babies.map(baby => baby.corners.map(this.toScreen));
      this.drawKnife(ctx);
      this.drawBabies(ctx);
    }
    finally {
      Object.assign(this, saved);
    }

    // the bottom that is cut off (the babies are never in it), and turning
    const visibleHeightPx = Math.round((cssHeight - plan.cropBottomMm / MM_PER_PX) * PRINT_RESOLUTION);
    let canvas = source;
    if (plan.rotated) {
      // 90 degrees clockwise: (x, y) -> (height - y, x); what is past the visible height (the bottom) falls outside the canvas
      canvas = document.createElement('canvas');
      canvas.width = visibleHeightPx;
      canvas.height = source.width;
      const turned = canvas.getContext('2d')!;
      turned.translate(visibleHeightPx, 0);
      turned.rotate(Math.PI / 2);
      turned.drawImage(source, 0, 0);
    }
    else if (plan.cropBottomMm > 0) {
      canvas = document.createElement('canvas');
      canvas.width = source.width;
      canvas.height = visibleHeightPx;
      canvas.getContext('2d')!.drawImage(source, 0, 0);
    }
    return {
      canvas,
      widthMm: canvas.width / PRINT_RESOLUTION * MM_PER_PX,
      heightMm: canvas.height / PRINT_RESOLUTION * MM_PER_PX,
      rotated: plan.rotated,
      croppedMm: plan.cropBottomMm,
      plan
    };
  }

  private scheduleDraw() {
    if (this.drawQueued) {
      return;
    }
    this.drawQueued = true;
    requestAnimationFrame(() => {
      this.drawQueued = false;
      this.draw();
    });
  }

  private draw() {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);
    if (!this.knife) {
      return;
    }
    this.drawKnife(ctx);
    this.drawBabies(ctx);
    if (this.show_texts) {
      this.drawGuide(ctx);
    }
  }

  /** The red guide line (null when it isn't shown): its screen x, the knife's left side x, and how far left it can go. */
  private guide(): { x: number; edgeX: number; maxCm: number } | null {
    if (!this.knife || !this.show_texts || !(this.pxPerCm > 0)) {
      return null;
    }
    const edgeX = this.toScreen({ x: knifeLeftEdge(this.knife.nodes, p => p), y: 0 }).x;
    const maxCm = Math.min(MAX_GUIDE_CM, Math.max(0, (edgeX - GUIDE_GRAB_PX) / this.pxPerCm));   // and stays inside the canvas
    this.guideCm = Math.min(Math.max(this.guideCm, 0), maxCm);   // (the canvas may be narrower than the range)
    return { x: edgeX - this.guideCm * this.pxPerCm, edgeX, maxCm };
  }

  /** A red dotted vertical line to the left of the knife's left side, over the whole height, to see which babies cross it. */
  private drawGuide(ctx: CanvasRenderingContext2D) {
    const guide = this.guide();
    if (!guide) {
      return;
    }
    const x = Math.round(guide.x) + 0.5;
    ctx.save();
    ctx.strokeStyle = GUIDE_COLOR;
    ctx.fillStyle = GUIDE_COLOR;
    ctx.lineWidth = this.guideHot ? 2 : 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.cssHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    const text = this.translation.t('common:units.cm', { value: this.guideCm });
    const half = ctx.measureText(text).width / 2;
    const center = Math.min(Math.max(x, half + 2), this.cssWidth - half - 2);
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = this.backcolor;
    ctx.fillRect(center - half - 2, 1, 2 * half + 4, 16);
    ctx.globalAlpha = 1;
    ctx.fillStyle = GUIDE_COLOR;
    ctx.fillText(text, center, 3);
    ctx.restore();
  }

  private drawKnife(ctx: CanvasRenderingContext2D) {
    const nodes = this.knife!.nodes;
    const path = new Path2D();
    const start = this.toScreen(nodes[0].p);
    path.moveTo(start.x, start.y);
    nodes.forEach((_, i) => {
      const b = segment(nodes, i).map(this.toScreen);
      if (isStraight(nodes, i)) {
        path.lineTo(b[3].x, b[3].y);
      }
      else {
        path.bezierCurveTo(b[1].x, b[1].y, b[2].x, b[2].y, b[3].x, b[3].y);
      }
    });
    path.closePath();
    ctx.fillStyle = 'rgba(13, 110, 253, 0.08)';
    ctx.fill(path);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.stroke(path);

    // the knife's width: a dimension line under the knife, from L1 to the Crown
    const span = measureSpan(nodes, this.knife!.regions, p => p);
    if (this.showsWidth() && span) {
      const bottom = Math.max(...outlineSamples(nodes).map(p => this.toScreen(p).y));
      const y = bottom + 14;
      const x1 = this.toScreen({ x: span.left, y: 0 }).x, x2 = this.toScreen({ x: span.right, y: 0 }).x;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      for (const x of [x1, x2]) {
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = this.color;
      ctx.fillText(this.translation.t('wings:diagram.knife_width', { value: this.translation.t('common:units.cm_fixed', { value: this.knifeWidth }) }), (x1 + x2) / 2, y + 6);
    }
  }

  private drawBabies(ctx: CanvasRenderingContext2D) {
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;

    this.babies.forEach((baby, i) => {
      const c = this.screenBabies[i];
      const hovered = (i == this.hovered);
      ctx.beginPath();
      ctx.moveTo(c[0].x, c[0].y);
      c.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      if (hovered) {
        ctx.fillStyle = HIGHLIGHT_COLOR;
        ctx.fill();
      }
      ctx.strokeStyle = this.color;
      ctx.stroke();

      // L1 split into strips
      if (baby.position == 'L1' && this.split_l1 > 1) {
        ctx.beginPath();
        for (let k = 1; k < this.split_l1; k++) {
          const a = lerp(c[0], c[3], k / this.split_l1), b = lerp(c[1], c[2], k / this.split_l1);
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }

      if (this.show_texts) {
        const baseMid = lerp(c[0], c[3], 0.5), outerMid = lerp(c[1], c[2], 0.5);
        // the crown strips are too thin for a label
        if (!baby.position.startsWith('C')) {
          const center = mul(c.reduce((a, b) => add(a, b), { x: 0, y: 0 }), 1 / 4);
          ctx.fillStyle = hovered ? HIGHLIGHT_TEXT_COLOR : this.color;
          ctx.fillText(baby.label, center.x, center.y);
        }
        if (!baby.position.startsWith('C') || !this.crownUniform()) {
          const lengthPos = add(outerMid, mul(norm(sub(outerMid, baseMid)), 10));
          ctx.fillStyle = this.color;
          ctx.fillText(String(baby.length), lengthPos.x, lengthPos.y);
        }
      }
    });

    // one length for a crown of equal strips
    const crownIdx = this.babies.map((b, i) => b.position.startsWith('C') ? i : -1).filter(i => i >= 0);
    if (this.show_texts && crownIdx.length && this.crownUniform()) {
      const first = this.screenBabies[crownIdx[0]], last = this.screenBabies[crownIdx[crownIdx.length - 1]];
      const outerMid = lerp(first[1], last[2], 0.5), baseMid = lerp(first[0], last[3], 0.5);
      const pos = add(outerMid, mul(norm(sub(outerMid, baseMid)), 10));
      ctx.fillStyle = this.color;
      ctx.textAlign = 'left';
      ctx.fillText((crownIdx.length > 1 ? crownIdx.length + ' × ' : '') + this.babies[crownIdx[0]].length, pos.x - 4, pos.y);
      ctx.textAlign = 'center';
    }

    // the remove button of the hovered baby
    if (this.hovered >= 0 && this.canDelete(this.hovered)) {
      const p = this.deletePosition(this.hovered);
      ctx.beginPath();
      ctx.arc(p.x, p.y, DELETE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = DELETE_COLOR;
      ctx.globalAlpha = this.onDelete ? 1 : 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;
      const d = DELETE_RADIUS * 0.4;
      ctx.beginPath();
      ctx.moveTo(p.x - d, p.y - d);
      ctx.lineTo(p.x + d, p.y + d);
      ctx.moveTo(p.x + d, p.y - d);
      ctx.lineTo(p.x - d, p.y + d);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  private crownUniform(): boolean {
    return (this.crown ?? []).every(length => length == this.crown[0]);
  }

  // ---------- editing ----------

  /** Lefts and rights can be removed, as long as one remains on that side. */
  private canDelete(i: number): boolean {
    const position = this.babies[i]?.position ?? '';
    if (!this.editable || !(position.startsWith('L') || position.startsWith('R'))) {
      return false;
    }
    return ((position.startsWith('L') ? this.lefts : this.rights) ?? []).length > 1;
  }

  /** Near the outer end of the baby. */
  private deletePosition(i: number): Vec {
    const c = this.screenBabies[i];
    return lerp(lerp(c[0], c[3], 0.5), lerp(c[1], c[2], 0.5), 0.8);
  }

  /** Adds a baby at the end of its side, as long as the last one there (or 10cm). */
  addBaby(side: AddSide) {
    if (side == 'TOP') {
      this.babyEdited.emit({ action: 'add', position: 'TOP', length: this.clampLength(10) });
      return;
    }
    const lengths = ((side == 'L') ? this.lefts : (side == 'R') ? this.rights : this.crown) ?? [];
    const length = this.clampLength(lengths.length ? lengths[lengths.length - 1] : 10);
    this.babyEdited.emit({ action: 'add', position: side + (lengths.length + 1), length });
  }

  private clampLength(length: number): number {
    const stepped = Math.round(length / this.baby_length_step) * this.baby_length_step;
    return Math.min(this.max_baby_length, Math.max(this.min_baby_length, stepped));
  }

  // ---------- mouse (outside the Angular zone) ----------

  private mouseMove(e: MouseEvent) {
    this.mouse = { offset: { x: e.offsetX, y: e.offsetY }, client: { x: e.clientX, y: e.clientY } };
    if (!this.guideDrag) {
      this.updateHover();
    }
  }

  private pointerMove(e: PointerEvent) {
    if (!this.guideDrag) {
      return;
    }
    const guide = this.guide();
    if (guide) {
      this.guideCm = snapGuideCm((guide.edgeX - e.offsetX) / this.pxPerCm, guide.maxCm);
      this.scheduleDraw();
    }
  }

  private pointerDown(e: PointerEvent) {
    if (e.button == 0 && this.guideHot) {
      this.guideDrag = true;
      try {
        this.canvasRef.nativeElement.setPointerCapture(e.pointerId);   // keeps following the mouse past the canvas' edge
      }
      catch { /* not needed to drag inside the canvas */ }
      e.preventDefault();
    }
  }

  private nearGuide(x: number): boolean {
    const guide = this.guide();
    return !!guide && Math.abs(x - guide.x) <= GUIDE_GRAB_PX;
  }

  private mouseLeave() {
    if (this.guideDrag) {
      return;   // still dragging the guide line past the edge
    }
    this.mouse = null;
    this.wheelDelta = 0;
    this.updateHover();
  }

  private updateHover() {
    const previous = [this.hovered, this.onDelete, this.guideHot];
    this.guideHot = !!this.mouse && this.nearGuide(this.mouse.offset.x);
    // the guide line is in front of the babies
    this.hovered = (this.mouse && this.highlight_mouseover_baby && !this.guideHot) ? this.babyAt(this.mouse.offset) : -1;
    this.onDelete = this.hovered >= 0 && this.canDelete(this.hovered) &&
      dist(this.deletePosition(this.hovered), this.mouse!.offset) <= DELETE_RADIUS;
    this.canvasRef.nativeElement.style.cursor = this.guideHot ? 'col-resize' : this.hovered >= 0 ? 'pointer' : '';
    this.updateTooltip();
    if (previous[0] != this.hovered || previous[1] != this.onDelete || previous[2] != this.guideHot) {
      this.scheduleDraw();
    }
  }

  private babyAt(p: Vec): number {
    for (let i = this.screenBabies.length - 1; i >= 0; i--) {
      if (pointInPolygon(p, this.screenBabies[i])) {
        return i;
      }
    }
    return -1;
  }

  private click() {
    if (this.hovered < 0) {
      return;
    }
    const position = this.babies[this.hovered].position;
    this.ngZone.run(() => {
      if (this.onDelete) {
        this.babyEdited.emit({ action: 'remove', position });
      }
      else {
        this.babyClicked.emit(position);
      }
    });
  }

  private wheel(e: WheelEvent) {
    if (!this.editable || this.hovered < 0) {
      return;
    }
    // resize the hovered baby instead of scrolling the page
    e.preventDefault();
    this.wheelDelta += (e.deltaMode == WheelEvent.DOM_DELTA_LINE) ? e.deltaY * 33 : e.deltaY;
    if (Math.abs(this.wheelDelta) < WHEEL_STEP_DELTA) {
      return;
    }
    const direction = this.wheelDelta < 0 ? 1 : -1;
    this.wheelDelta = 0;
    const baby = this.babies[this.hovered];
    const length = this.clampLength(baby.length + direction * this.baby_length_step);
    if (length != baby.length) {
      // the diagram changes size with the baby: keep the page where it is, so the baby stays under the mouse
      const { scrollX, scrollY } = window;
      const keepScroll = () => {
        if (Math.abs(window.scrollY - scrollY) > 1 || Math.abs(window.scrollX - scrollX) > 1) {
          window.scrollTo(scrollX, scrollY);
        }
      };
      this.ngZone.run(() => this.babyEdited.emit({ action: 'length', position: baby.position, length }));
      keepScroll();
      requestAnimationFrame(keepScroll);
    }
  }

  // ---------- tooltip (an element over the page, so it isn't clipped by the canvas) ----------

  private updateTooltip() {
    const tooltip = this.tooltipRef?.nativeElement;
    if (!tooltip) {
      return;
    }
    if (!this.show_tooltips || this.hovered < 0 || !this.mouse) {
      tooltip.style.display = 'none';
      return;
    }
    tooltip.innerHTML = this.tooltipHtml(this.babies[this.hovered]);
    tooltip.style.display = 'block';
    const gap = 14;
    const { x, y } = this.mouse.client;
    let left = x + gap, top = y + gap;
    if (left + tooltip.offsetWidth > window.innerWidth - 4) {
      left = x - gap - tooltip.offsetWidth;
    }
    if (top + tooltip.offsetHeight > window.innerHeight - 4) {
      top = y - gap - tooltip.offsetHeight;
    }
    tooltip.style.left = Math.max(4, left) + 'px';
    tooltip.style.top = Math.max(4, top) + 'px';
  }

  private tooltipHtml(baby: PreviewBaby): string {
    let title: string;
    if (baby.position == 'TOP') {
      title = "<span class='icon-top'></span> " + this.translation.t('wings:editor.top');
    }
    else if (baby.position.startsWith('C')) {
      title = "<span class='icon-crown'></span> " + this.translation.t('wings:diagram.tip_crown', { n: baby.label.substring(1) });
    }
    else if (baby.position.startsWith('L')) {
      title = `<span class='icon-feather-wing'></span> ${baby.position}`;
    }
    else {
      title = `<span class='icon-feather-wing-r'></span> ${baby.position}`;
    }
    const split = (baby.position == 'L1' && this.split_l1 > 1) ? ' x' + this.split_l1 : '';
    let html = `<strong>${title}</strong>${split}<br/>${this.translation.t('common:units.cm', { value: baby.length })}`;
    if (this.editable) {
      html += `<div style="font-size: 10px; opacity: 0.7;">${this.onDelete ? this.translation.t('wings:diagram.tip_remove') : this.translation.t('wings:diagram.tip_edit')}</div>`;
    }
    return html;
  }
}

function pointInPolygon(p: Vec, poly: Vec[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) != (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}
