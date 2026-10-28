import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalsService } from '../../../services/globals.service';
import { KnivesService } from '../../../services/knives.service';
import { Knife } from '../../../../types';
import { KnifeRegion, KnifeShape, Vec, add, dist, isStraight, lerp, measureSpan, mul, norm, outlineSamples, segment, sub } from '../knife-editor/knife-shape';
import { PreviewBaby, buildWingBabies, regionAnchor } from '../knife-editor/baby-preview';
import { DEFAULT_KNIFE } from './default-knife';
import { WingBabyEdit } from './wing-baby-edit';

type AddSide = 'L' | 'R' | 'TOP' | 'C';
interface AddButton { side: AddSide; x: number; y: number; title: string; }

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

/**
 * Draws a wing: its knife, with the babies laid out around it.
 * The knife is loaded by id; without one, the default (original) wing shape is drawn.
 * Hovering a baby highlights it and shows a tooltip; clicking it emits babyClicked.
 * When editable, babies can also be added (+ buttons), removed (x) and resized (mouse wheel);
 * those edits are emitted through babyEdited and are shown once the host updates the inputs (see applyBabyEdit).
 */
@Component({
  selector: 'app-wing-diagram',
  standalone: true,
  imports: [],
  templateUrl: './wing-diagram.component.html',
  styleUrl: './wing-diagram.component.scss'
})
export class WingDiagramComponent implements AfterViewInit, OnChanges, OnDestroy {

  //inputs
  @Input() lefts: number[] = [];          // lengths in cm, L1 -> Ln
  @Input() rights: number[] = [];         // lengths in cm, R1 -> Rn
  @Input() top_length: number[] = [];     // [length], or empty when there is no top baby
  @Input() crown: number[] = [];          // lengths in cm, C1 -> Cn (the split crown)
  @Input() split_l1 = 1;
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

  private resizeObserver?: ResizeObserver;
  private themeSubscription: Subscription;
  private removeListeners: (() => void)[] = [];

  constructor(private globalService: GlobalsService, private knivesService: KnivesService, private ngZone: NgZone) {
    this.setColors(this.globalService.currentTheme());
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
      this.lefts, this.rights, this.top_length, this.crown, this.split_l1, this.auto_fit, this.scale, this.show_texts,
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
      crown: this.crown ?? []
    }) : [];
    this.layout();
  }

  // ---------- layout & drawing ----------

  private toScreen = (p: Vec): Vec => ({ x: this.offset.x + p.x * this.pxPerCm, y: this.offset.y + p.y * this.pxPerCm });

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

    // bounds of the drawing, in cm
    const pts = [...outlineSamples(this.knife.nodes), ...this.babies.flatMap(b => b.corners)];
    const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
    const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
    const width = (maxX - minX) || 1, height = (maxY - minY) || 1;
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
      { side: 'L', region: regions.lefts, title: `Add L${(this.lefts?.length ?? 0) + 1}` },
      { side: 'R', region: regions.rights, title: `Add R${(this.rights?.length ?? 0) + 1}` },
      { side: 'C', region: regions.crown, title: 'Add a crown baby' },
    ];
    if (!this.top_length?.[0]) {
      sides.push({ side: 'TOP', region: regions.top, title: 'Add a top' });
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
      ctx.fillText('Knife width: ' + this.knifeWidth!.toFixed(2) + ' cm', (x1 + x2) / 2, y + 6);
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
    this.updateHover();
  }

  private mouseLeave() {
    this.mouse = null;
    this.wheelDelta = 0;
    this.updateHover();
  }

  private updateHover() {
    const previous = [this.hovered, this.onDelete];
    this.hovered = (this.mouse && this.highlight_mouseover_baby) ? this.babyAt(this.mouse.offset) : -1;
    this.onDelete = this.hovered >= 0 && this.canDelete(this.hovered) &&
      dist(this.deletePosition(this.hovered), this.mouse!.offset) <= DELETE_RADIUS;
    this.canvasRef.nativeElement.style.cursor = this.hovered >= 0 ? 'pointer' : '';
    this.updateTooltip();
    if (previous[0] != this.hovered || previous[1] != this.onDelete) {
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
      this.ngZone.run(() => this.babyEdited.emit({ action: 'length', position: baby.position, length }));
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
      title = "<span class='icon-top'></span> Top";
    }
    else if (baby.position.startsWith('C')) {
      title = `<span class='icon-crown'></span> Crown (${baby.label.substring(1)})`;
    }
    else if (baby.position.startsWith('L')) {
      title = `<span class='icon-feather-wing'></span> ${baby.position}`;
    }
    else {
      title = `<span class='icon-feather-wing-r'></span> ${baby.position}`;
    }
    const split = (baby.position == 'L1' && this.split_l1 > 1) ? ' x' + this.split_l1 : '';
    let html = `<strong>${title}</strong>${split}<br/>${baby.length} cm`;
    if (this.editable) {
      html += `<div style="font-size: 10px; opacity: 0.7;">${this.onDelete ? 'Click to remove' : 'Scroll to resize, click to edit'}</div>`;
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
