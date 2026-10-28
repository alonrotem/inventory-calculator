import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { faArrowLeft, faEraser, faFolderOpen, faRotateLeft, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { UnsavedChangesDialogComponent } from '../../common/unsaved-changes-dialog/unsaved-changes-dialog.component';
import { SaveChangesButtonComponent } from '../../common/save-changes-button/save-changes-button.component';
import { GlobalsService } from '../../../services/globals.service';
import { KnivesService } from '../../../services/knives.service';
import { ToastService } from '../../../services/toast.service';
import { Knife, nameIdPair } from '../../../../types';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import {
  KnifeNode, KnifeRegion, KnifeRegions, REGION_INFO, REGION_KEYS, RegionKey, Vec,
  add, bakeShape, bezierPoint, dist, indexOfId, isStraight, len, lerp, measureSpan, mul, norm,
  outlineSamples, regionLength, regionSegments, sampleRegion, segment, shortestRegion, splitSegment, sub
} from './knife-shape';
import { traceOutline } from './outline-tracer';
import { fitOutline } from './bezier-fit';
import { loadImageFile, loadPdfPage } from './image-source';
import { PreviewBaby, buildBabyPreview } from './baby-preview';

type Tool = 'edit' | 'mark' | 'straighten';
type Drag = { kind: 'node' | 'hIn' | 'hOut'; id: number; undoSaved: boolean } | { kind: 'pan'; last: Vec };

const MAX_TRACE_DIM = 2400;   // larger scans are traced on a downscaled copy
const HIT_RADIUS = 8;         // screen px
const MAX_UNDO = 100;
const IMPORT_UNITS_PER_CM = 100;

@Component({
  selector: 'app-knife-editor',
  standalone: true,
  imports: [FormsModule, ConfirmationDialogComponent, FaIconComponent, UnsavedChangesDialogComponent, SaveChangesButtonComponent],
  templateUrl: './knife-editor.component.html',
  styleUrl: './knife-editor.component.scss'
})
export class KnifeEditorComponent implements OnInit, AfterViewInit, OnDestroy, HasUnsavedChanges {

  @ViewChild('editor_canvas') editorCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('confirm_action') confirm_action!: ConfirmationDialogComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;

  readonly faEraser = faEraser;
  readonly faArrowLeft = faArrowLeft;
  readonly faSave = faSave;
  readonly faRotateLeft = faRotateLeft;
  readonly faFolderOpen = faFolderOpen;
  readonly faTrashAlt = faTrashAlt;
  readonly regionKeys = REGION_KEYS;
  readonly regionInfo = REGION_INFO;

  name = '';
  knifeId: number | null = null;   // database record being edited; null for a new knife
  private openedWithKnifeId: number | null = null;   // opened from a knife's details page (?id=)

  // database
  showDbList = false;
  loadingList = false;
  savedKnives: nameIdPair[] = [];
  dbSelection: number | null = null;

  // source scan (model units are its pixels)
  source: HTMLCanvasElement | null = null;
  sourceName = '';
  fileDpi: number | null = null;
  pdfPage = 1;
  pdfPageCount = 0;
  private pdfData: ArrayBuffer | null = null;
  private loadedPdfPage = 1;
  showImage = true;
  imageOpacity = 0.5;

  // tracing
  autoThreshold = true;
  threshold = 128;
  usedAlpha = false;
  tolerance = 2;
  cornerAngle = 35;
  private contour: Vec[] | null = null;

  // shape
  nodes: KnifeNode[] = [];
  regions: KnifeRegions = {};
  selectedId: number | null = null;
  showPoints = true;
  private nextId = 1;

  // orientation: mirror (optional), then rotate around the pivot
  rotation = 0;
  flipped = false;
  private pivot: Vec = { x: 0, y: 0 };

  widthCm: number | null = null;

  // babies preview
  showBabies = false;
  previewLefts = 8;
  previewRights = 8;
  previewCrownSplit = 4;

  // tools
  tool: Tool = 'edit';
  markKey: RegionKey | null = null;
  private markFirstId: number | null = null;
  private straightenFirst: Vec | null = null;

  // view
  private zoom = 1;
  private pan: Vec = { x: 0, y: 0 };
  private cursor: Vec | null = null;
  private drag: Drag | null = null;
  private dpr = 1;
  private ctx!: CanvasRenderingContext2D;
  private resizeObserver!: ResizeObserver;
  private redrawPending = false;
  private viewFitted = false;
  private undoStack: string[] = [];
  private themeSubscription: Subscription;

  color = '';
  backcolor = '';
  status = 'Open, drop or paste a scan of the knife to start.';
  busy = false;
  dragOver = false;
  private dirty = false;   // changed since it was loaded, traced or exported
  private initialState: string | null = null;   // the knife as it was imported, for "Revert changes"

  constructor(private globalService: GlobalsService, private ngZone: NgZone,
              private knivesService: KnivesService, private toastService: ToastService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService) {
    this.setColors(this.globalService.currentTheme());
    this.themeSubscription = this.globalService.themeChanged.subscribe({
      next: (theme: string) => {
        this.setColors(theme);
        this.requestDraw();
      }
    });
  }

  /** Leaving with unsaved changes asks to save or discard them. */
  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () => this.dirty,
      saveFn: () => {
        const knife = this.getKnife();
        // incomplete (the reason is in the status line): stay on the page
        return knife ? this.knivesService.save(knife) : throwError(() => new Error(this.status));
      },
      confirmationDialog: this.unsaved_changes_dialog
    });
  }

  get hasChanges(): boolean {
    return this.dirty;
  }

  /** Back to the knife's details page when the editor was opened from it, otherwise to the knives list. */
  goBack(textInfo: string = '', isError: boolean = false) {
    const state = { info: { textInfo, isError } };
    if (this.openedWithKnifeId && this.knifeId) {
      this.router.navigate(['templates/knives/details'], { queryParams: { id: this.knifeId }, state });
    }
    else {
      this.router.navigate(['templates/knives/list'], { state });
    }
  }

  /** ?id=N opens that knife from the database (Advanced edit on the knife's page). */
  async ngOnInit() {
    const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
    if (!id) {
      return;
    }
    this.openedWithKnifeId = id;
    this.busy = true;
    this.status = 'Loading the knife...';
    try {
      const knife = await firstValueFrom(this.knivesService.getKnife(id));
      if (!knife?.id) {
        throw new Error('the knife was not found');
      }
      this.loadKnife(knife, true);
      this.status = 'Opened ' + knife.name;
    }
    catch (e) {
      this.status = 'Could not open the knife: ' + this.errorMessage(e);
    }
    finally {
      this.busy = false;
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.editorCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(canvas.parentElement!);
    });
    this.resizeCanvas();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.themeSubscription.unsubscribe();
  }

  setColors(theme: string) {
    this.color = (theme == 'dark') ? '#f8f9fa' : '#212529';
    this.backcolor = (theme == 'dark') ? '#212529' : '#f8f9fa';
  }

  /** Clears everything and starts over. */
  async reset() {
    if (this.nodes.length || this.source) {
      const confirmed = await this.confirm_action.open_with_message({
        modalText: "Are you sure you want to clear the knife? The scan, outline, regions and size will be removed.",
        modalTitle: "Reset knife?",
        btnYesClass: "btn-danger",
        btnYesText: "Start fresh!",
        btnYesIcon: faEraser
      });
      if (!confirmed) {
        return;
      }
    }
    this.clearAll();
  }

  private clearAll() {
    this.name = '';
    this.source = null;
    this.sourceName = '';
    this.fileDpi = null;
    this.pdfData = null;
    this.pdfPage = 1;
    this.pdfPageCount = 0;
    this.autoThreshold = true;
    this.usedAlpha = false;
    this.contour = null;
    this.nodes = [];
    this.regions = {};
    this.selectedId = null;
    this.rotation = 0;
    this.flipped = false;
    this.widthCm = null;
    this.showBabies = false;
    this.undoStack = [];
    this.cancelTool();
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.viewFitted = false;
    this.dirty = false;
    this.initialState = null;
    this.knifeId = null;
    this.status = 'Open, drop or paste a scan of the knife to start.';
    this.requestDraw();
  }

  markDirty() {
    this.dirty = true;
  }

  get canRevert(): boolean {
    return this.dirty && !!this.initialState;
  }

  private snapshotState(): string {
    return JSON.stringify({
      nodes: this.nodes, regions: this.regions, rotation: this.rotation, flipped: this.flipped, widthCm: this.widthCm, name: this.name
    });
  }

  /** A knife was just imported: remember it as the state to revert to. */
  private markImported() {
    this.dirty = false;
    this.initialState = this.snapshotState();
  }

  /** Goes back to the knife as it was imported. */
  async revertChanges() {
    if (!this.canRevert) {
      return;
    }
    const confirmed = await this.confirm_action.open_with_message({
      modalText: "Are you sure you want to undo all changes since the knife was imported?",
      modalTitle: "Revert changes?",
      btnYesClass: "btn-danger",
      btnYesText: "Revert",
      btnYesIcon: faRotateLeft
    });
    if (!confirmed) {
      return;
    }
    const state = JSON.parse(this.initialState!);
    this.nodes = state.nodes;
    this.regions = state.regions;
    this.rotation = state.rotation;
    this.flipped = state.flipped;
    this.widthCm = state.widthCm;
    this.name = state.name;
    this.selectedId = null;
    this.undoStack = [];
    this.cancelTool();
    this.dirty = false;
    this.status = 'Changes reverted.';
    this.fitView();
  }

  /** Before replacing the current knife: true when there is nothing to lose or the user agrees to lose it. */
  private async confirmDiscard(): Promise<boolean> {
    if (!this.dirty) {
      return true;
    }
    return this.confirm_action.open_with_message({
      modalText: "The current knife has changes that were not saved. Opening another one will discard them.",
      modalTitle: "Discard changes?",
      btnYesClass: "btn-danger",
      btnYesText: "Discard changes",
      btnYesIcon: faEraser
    });
  }

  // ---------------------------------------------------------------- source & tracing

  async onSourceSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) {
      await this.loadSourceFile(file);
    }
  }

  onDragOver(e: DragEvent) {
    if (!e.dataTransfer?.types.includes('Files')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.dragOver = true;
  }

  onDragLeave(e: DragEvent) {
    // ignore leaving into a child element
    const related = e.relatedTarget as Node | null;
    if (!related || !(e.currentTarget as HTMLElement).contains(related)) {
      this.dragOver = false;
    }
  }

  async onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) {
      await this.openFile(file);
    }
  }

  /** Ctrl+V of an image (screenshot, copied picture) or a copied file. Pasting into text fields is left alone. */
  @HostListener('window:paste', ['$event'])
  async onPaste(e: ClipboardEvent) {
    const target = e.target as HTMLElement;
    if (['INPUT', 'TEXTAREA'].includes(target?.tagName) || target?.isContentEditable) {
      return;
    }
    let file = e.clipboardData?.files[0];
    if (!file) {
      return;
    }
    e.preventDefault();
    // clipboard images come with a generic name such as "image.png"
    if (/^image\.(png|jpe?g)$/i.test(file.name)) {
      file = new File([file], 'Pasted image.' + file.name.split('.').pop(), { type: file.type });
    }
    await this.openFile(file);
  }

  private async openFile(file: File) {
    if (this.busy) return;
    if (/\.json$/i.test(file.name) || file.type === 'application/json') {
      await this.loadShapeFile(file);
    }
    else if (/\.(png|jpe?g|pdf)$/i.test(file.name) || /^image\/(png|jpeg)$|^application\/pdf$/.test(file.type)) {
      await this.loadSourceFile(file);
    }
    else {
      this.status = 'Unsupported file: ' + file.name + ' (' + (file.type || 'unknown type') + '). Use PNG, JPG, PDF or a knife JSON file.';
    }
  }

  private async loadSourceFile(file: File) {
    if (!(await this.confirmDiscard())) {
      return;
    }
    const replacing = this.nodes.length > 0 || !!this.source;
    this.busy = true;
    this.status = 'Loading ' + file.name + '...';
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        this.pdfData = await file.arrayBuffer();
        this.pdfPage = 1;
        await this.loadPdf();
      }
      else {
        this.pdfData = null;
        this.pdfPageCount = 0;
        const loaded = await loadImageFile(file);
        this.setSource(loaded.canvas, loaded.dpi);
      }
      this.sourceName = file.name;
      // a name typed before the first scan is kept; a replaced knife's name is not
      if (replacing || !this.name.trim()) {
        this.name = file.name.replace(/\.[^.]+$/, '');
      }
      this.traceFromSource();
      this.markImported();
    }
    catch (e) {
      this.status = 'Could not load ' + file.name + ': ' + (e instanceof Error ? e.message : e);
    }
    finally {
      this.busy = false;
    }
  }

  async onPdfPageChanged() {
    if (!this.pdfData) {
      return;
    }
    if (!(await this.confirmDiscard())) {
      this.pdfPage = this.loadedPdfPage;
      return;
    }
    this.busy = true;
    try {
      await this.loadPdf();
      this.traceFromSource();
      this.markImported();
    }
    finally {
      this.busy = false;
    }
  }

  private async loadPdf() {
    const loaded = await loadPdfPage(this.pdfData!, this.pdfPage);
    this.pdfPageCount = loaded.pageCount;
    this.loadedPdfPage = this.pdfPage;
    this.setSource(loaded.canvas, loaded.dpi);
  }

  private setSource(canvas: HTMLCanvasElement, dpi: number | null) {
    this.source = canvas;
    this.fileDpi = dpi;
    this.pivot = { x: canvas.width / 2, y: canvas.height / 2 };
    this.rotation = 0;
    this.flipped = false;
    this.autoThreshold = true;
    // about 1 px on a 1000 px image: keeps the knife's small steps while ignoring scan noise
    this.tolerance = Math.max(1, Math.round(Math.hypot(canvas.width, canvas.height) / 800 * 2) / 2);
  }

  traceFromSource() {
    if (!this.source) {
      return;
    }
    const scale = Math.min(1, MAX_TRACE_DIM / Math.max(this.source.width, this.source.height));
    const work = document.createElement('canvas');
    work.width = Math.round(this.source.width * scale);
    work.height = Math.round(this.source.height * scale);
    const workCtx = work.getContext('2d', { willReadFrequently: true })!;
    workCtx.drawImage(this.source, 0, 0, work.width, work.height);

    const result = traceOutline(workCtx.getImageData(0, 0, work.width, work.height), this.autoThreshold ? undefined : this.threshold);
    if (!result) {
      this.status = 'No shape was found in the image. Try another threshold.';
      return;
    }
    this.usedAlpha = result.usedAlpha;
    this.threshold = result.threshold;
    this.contour = result.contour.map(p => ({ x: p.x / scale, y: p.y / scale }));
    this.refit();
  }

  /** Rebuilds the nodes from the traced contour (regions are reset). */
  refit() {
    if (!this.contour) {
      return;
    }
    this.saveUndo();
    const cornerWindow = Math.max(3, Math.round(5 * this.contour.length / 3000));
    this.nodes = fitOutline(this.contour, { tolerance: this.tolerance, cornerAngle: this.cornerAngle, cornerWindow })
      .map(n => ({ id: this.nextId++, ...n }));
    this.regions = {};
    this.selectedId = null;
    this.cancelTool();
    this.status = `Outline traced: ${this.nodes.length} points. Straighten it, then mark the regions.`;
    this.fitView();
  }

  // ---------------------------------------------------------------- orientation

  /** Model point -> oriented frame (flip, then rotate around the pivot). */
  readonly toOriented = (p: Vec): Vec => {
    let x = p.x - this.pivot.x;
    const y = p.y - this.pivot.y;
    if (this.flipped) x = -x;
    const a = this.rotation * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    return { x: x * c - y * s, y: x * s + y * c };
  };

  private fromOriented(o: Vec): Vec {
    const a = -this.rotation * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    let x = o.x * c - o.y * s;
    const y = o.x * s + o.y * c;
    if (this.flipped) x = -x;
    return { x: x + this.pivot.x, y: y + this.pivot.y };
  }

  private toScreen(p: Vec): Vec {
    const o = this.toOriented(p);
    return { x: this.pan.x + o.x * this.zoom, y: this.pan.y + o.y * this.zoom };
  }

  private fromScreen(s: Vec): Vec {
    return this.fromOriented({ x: (s.x - this.pan.x) / this.zoom, y: (s.y - this.pan.y) / this.zoom });
  }

  setRotation(deg: number) {
    this.dirty = true;
    let r = ((Number(deg) || 0) % 360 + 360) % 360;
    if (r > 180) r -= 360;
    this.rotation = Math.round(r * 100) / 100;
    this.requestDraw();
  }

  rotateBy(deg: number) {
    this.setRotation(this.rotation + deg);
    this.fitView();
  }

  flip() {
    // mirror the current view horizontally: F·R(a) = R(-a)·F
    this.flipped = !this.flipped;
    this.setRotation(-this.rotation);
    this.fitView();
  }

  startStraighten() {
    this.cancelTool();
    this.tool = 'straighten';
    this.status = 'Straighten: click two points on the base line (e.g. both ends of the bottom edge).';
    this.requestDraw();
  }

  private applyStraighten(a: Vec, b: Vec) {
    const v = sub(b, a);
    if (this.flipped) v.x = -v.x;
    const angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
    // pick the solution closest to the current rotation, so clicking right-to-left doesn't turn it upside down
    const candidates = [-angle, 180 - angle];
    const diff = (r: number) => Math.abs(((r - this.rotation) % 360 + 540) % 360 - 180);
    this.setRotation(diff(candidates[0]) <= diff(candidates[1]) ? candidates[0] : candidates[1]);
    this.status = `Straightened: rotation is ${this.rotation}°.`;
    this.fitView();
  }

  // ---------------------------------------------------------------- regions

  startMark(key: RegionKey) {
    if (this.nodes.length < 3) {
      return;
    }
    this.cancelTool();
    this.tool = 'mark';
    this.markKey = key;
    this.status = `${REGION_INFO[key].label}: click where it starts on the outline.`;
    this.requestDraw();
  }

  clearRegion(key: RegionKey) {
    this.saveUndo();
    delete this.regions[key];
    this.requestDraw();
  }

  private completeMark(firstId: number, secondId: number) {
    const key = this.markKey!;
    this.regions[key] = shortestRegion(this.nodes, firstId, secondId);
    this.deriveRegions();
    this.status = `${REGION_INFO[key].label} marked.`;
    this.cancelTool();
  }

  /** Lefts and Rights default to the outline between their neighbours. */
  private deriveRegions() {
    const between = (a: KnifeRegion, b: KnifeRegion): KnifeRegion => {
      const r1 = { from: a.to, to: b.from }, r2 = { from: b.to, to: a.from };
      return regionLength(this.nodes, r1) <= regionLength(this.nodes, r2) ? r1 : r2;
    };
    const { l1, top, crown } = this.regions;
    if (l1 && top && !this.regions.lefts) this.regions.lefts = between(l1, top);
    if (top && crown && !this.regions.rights) this.regions.rights = between(top, crown);
  }

  // ---------------------------------------------------------------- node editing

  togglePoints() {
    // hidden points can't be dragged, so nothing stays selected
    if (!this.showPoints) {
      this.selectedId = null;
    }
    this.requestDraw();
  }

  get selectedNode(): KnifeNode | null {
    return this.nodes.find(n => n.id === this.selectedId) ?? null;
  }

  setSmooth() {
    const node = this.selectedNode;
    if (!node) return;
    this.saveUndo();
    node.smooth = true;
    if (node.hIn && node.hOut) {
      const dir = norm(sub(node.hOut, node.hIn));
      node.hOut = add(node.p, mul(dir, len(sub(node.hOut, node.p))));
      node.hIn = sub(node.p, mul(dir, len(sub(node.hIn, node.p))));
    }
    this.requestDraw();
  }

  setCorner() {
    const node = this.selectedNode;
    if (!node) return;
    this.saveUndo();
    node.smooth = false;
    this.requestDraw();
  }

  /** Both edges touching the selected point become straight lines. */
  makeStraight() {
    const i = indexOfId(this.nodes, this.selectedId ?? -1);
    if (i < 0) return;
    this.saveUndo();
    const n = this.nodes.length;
    const node = this.nodes[i];
    node.hIn = node.hOut = null;
    node.smooth = false;
    this.nodes[(i - 1 + n) % n].hOut = null;
    this.nodes[(i + 1) % n].hIn = null;
    this.requestDraw();
  }

  /** Both edges touching the selected point become curves, with handles to drag. */
  makeCurved() {
    const i = indexOfId(this.nodes, this.selectedId ?? -1);
    if (i < 0) return;
    this.saveUndo();
    const n = this.nodes.length;
    const node = this.nodes[i], prev = this.nodes[(i - 1 + n) % n], next = this.nodes[(i + 1) % n];
    node.hIn ??= lerp(node.p, prev.p, 1 / 3);
    node.hOut ??= lerp(node.p, next.p, 1 / 3);
    prev.hOut ??= lerp(prev.p, node.p, 1 / 3);
    next.hIn ??= lerp(next.p, node.p, 1 / 3);
    this.requestDraw();
  }

  deleteSelected() {
    const i = indexOfId(this.nodes, this.selectedId ?? -1);
    if (i < 0) return;
    if (this.nodes.length <= 3) {
      this.status = 'The outline needs at least 3 points.';
      return;
    }
    this.saveUndo();
    const id = this.nodes[i].id;
    const removed = REGION_KEYS.filter(k => this.regions[k]?.from === id || this.regions[k]?.to === id);
    removed.forEach(k => delete this.regions[k]);
    this.nodes.splice(i, 1);
    this.selectedId = null;
    this.status = removed.length ? 'Point deleted. Cleared regions that used it: ' + removed.map(k => REGION_INFO[k].label).join(', ') : 'Point deleted.';
    this.requestDraw();
  }

  undo() {
    const snapshot = this.undoStack.pop();
    if (!snapshot) return;
    const state = JSON.parse(snapshot);
    this.nodes = state.nodes;
    this.regions = state.regions;
    this.selectedId = null;
    this.cancelTool();
    this.requestDraw();
  }

  private saveUndo() {
    // every edit of the outline or regions goes through here
    this.dirty = true;
    this.undoStack.push(JSON.stringify({ nodes: this.nodes, regions: this.regions }));
    if (this.undoStack.length > MAX_UNDO) {
      this.undoStack.shift();
    }
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  cancelTool() {
    this.tool = 'edit';
    this.markKey = null;
    this.markFirstId = null;
    this.straightenFirst = null;
    this.requestDraw();
  }

  // ---------------------------------------------------------------- size & export

  /** L1 -> Crown width in model units, in the current orientation. */
  measuredWidth(): number | null {
    const span = measureSpan(this.nodes, this.regions, this.toOriented);
    return span ? span.right - span.left : null;
  }

  /** Model units per cm: from the entered width when possible, otherwise from the scan resolution. */
  unitsPerCm(): number | null {
    const measured = this.measuredWidth();
    if (measured && this.widthCm && this.widthCm > 0) {
      return measured / this.widthCm;
    }
    return this.fileDpi ? this.fileDpi / 2.54 : null;
  }

  /** The width according to the scan resolution, as a hint for the user. */
  widthFromDpi(): number | null {
    const measured = this.measuredWidth();
    if (measured === null || !this.fileDpi) {
      return null;
    }
    return Math.round(measured / (this.fileDpi / 2.54) * 10) / 10;
  }

  get missingRegions(): string[] {
    return REGION_KEYS.filter(k => !this.regions[k]).map(k => REGION_INFO[k].label);
  }

  /** The knife as stored ({ id, name, data } with data in cm); null (with a status message) while incomplete. */
  getKnife(): Knife | null {
    if (!this.name.trim()) {
      this.status = 'Give the knife a name.';
      return null;
    }
    if (this.nodes.length < 3) {
      this.status = 'There is no outline yet.';
      return null;
    }
    if (this.missingRegions.length) {
      this.status = 'Mark all regions first. Missing: ' + this.missingRegions.join(', ');
      return null;
    }
    const measured = this.measuredWidth();
    if (!measured || !this.widthCm || this.widthCm <= 0) {
      this.status = 'Enter the knife width (L1 to Crown) in cm.';
      return null;
    }
    const data = bakeShape(this.nodes, this.regions, this.toOriented, this.flipped, measured / this.widthCm);
    // all regions were checked above
    return { id: this.knifeId ?? 0, name: this.name.trim(), width_cm: this.widthCm, data: data as Knife['data'] };
  }

  exportShape() {
    const knife = this.getKnife();
    if (!knife) return;
    const name = knife.name.replace(/[\\/:*?"<>|]+/g, '_') + '.json';
    saveAs(new Blob([JSON.stringify(knife, null, 2)], { type: 'application/json' }), name);
    this.status = 'Exported ' + name;
    this.dirty = false;
  }

  // ---------------------------------------------------------------- database

  async saveToDatabase() {
    const knife = this.getKnife();
    if (!knife) return;
    this.busy = true;
    try {
      const response = await firstValueFrom(this.knivesService.save(knife));
      this.knifeId = response.knife.id;
      this.dirty = false;
      this.status = response.message;
      this.toastService.showSuccess(response.message);
      if (this.showDbList) {
        await this.loadKnivesList();
      }
    }
    catch (e) {
      const message = this.errorMessage(e);
      this.status = 'Could not save the knife: ' + message;
      this.toastService.showError(message);
    }
    finally {
      this.busy = false;
    }
  }

  async toggleDbList() {
    this.showDbList = !this.showDbList;
    if (this.showDbList) {
      await this.loadKnivesList();
    }
  }

  private async loadKnivesList() {
    this.loadingList = true;
    try {
      // perPage 0: all of them
      const list = await firstValueFrom(this.knivesService.getKnives({ page: 1, perPage: 0 }));
      this.savedKnives = list.data;
      if (!this.savedKnives.some(k => k.id === this.dbSelection)) {
        this.dbSelection = this.savedKnives[0]?.id ?? null;
      }
    }
    catch (e) {
      this.status = 'Could not load the saved knives: ' + this.errorMessage(e);
    }
    finally {
      this.loadingList = false;
    }
  }

  async openFromDatabase() {
    const id = this.dbSelection;
    if (!id || !(await this.confirmDiscard())) {
      return;
    }
    this.busy = true;
    try {
      const knife = await firstValueFrom(this.knivesService.getKnife(id));
      if (!knife?.id) {
        throw new Error('the knife was not found');
      }
      this.loadKnife(knife, true);
      this.sourceName = '';
      this.showDbList = false;
      this.status = 'Opened ' + knife.name;
    }
    catch (e) {
      this.status = 'Could not open the knife: ' + this.errorMessage(e);
    }
    finally {
      this.busy = false;
    }
  }

  /** Deletes the open knife from the database, then clears the editor. */
  async deleteFromDatabase() {
    const id = this.knifeId;
    if (!id) {
      return;
    }
    const confirmed = await this.confirm_action.open_with_message({
      modalTitle: "Delete confirmation",
      modalText: "Are you sure you want to delete the knife " + this.name + "?",
      btnYesIcon: faTrashAlt,
      btnYesText: "Delete",
      btnYesClass: "btn-danger",
      reverseButtons: true
    });
    if (!confirmed) {
      return;
    }
    this.busy = true;
    try {
      const response = await firstValueFrom(this.knivesService.deleteKnife(id));
      this.clearAll();
      // the knife is gone: back to the list
      this.openedWithKnifeId = null;
      this.goBack(response.message, false);
    }
    catch (e) {
      const message = this.errorMessage(e);
      this.status = 'Could not delete the knife: ' + message;
      this.toastService.showError(message);
    }
    finally {
      this.busy = false;
    }
  }

  private errorMessage(e: any): string {
    return e?.error?.message ?? e?.error?.error ?? e?.message ?? String(e);
  }

  async onShapeFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) {
      await this.loadShapeFile(file);
    }
  }

  private async loadShapeFile(file: File) {
    if (!(await this.confirmDiscard())) {
      return;
    }
    try {
      const json = JSON.parse(await file.text());
      // { id, name, data }, or the older format with the drawing (and name) at the top level
      const knife: Knife = json?.data ? json : { id: 0, name: json?.name ?? '', width_cm: json?.width_cm, data: json };
      // a file isn't linked to a database record: saving it creates a new knife
      this.loadKnife(knife, false);
      this.sourceName = file.name;
      this.status = 'Loaded ' + file.name;
    }
    catch (e) {
      this.status = 'Could not read ' + file.name + ': ' + (e instanceof Error ? e.message : e);
    }
  }

  /** Loads a stored knife for editing; `fromDatabase` links the editor to its database record. */
  loadKnife(knife: Knife, fromDatabase: boolean) {
    const shape = knife?.data;
    if (!Array.isArray(shape?.nodes) || shape.nodes.length < 3) {
      throw new Error('not a knife file');
    }
    this.saveUndo();
    this.knifeId = fromDatabase ? knife.id : null;
    const toUnits = (p: Vec): Vec => mul(p, IMPORT_UNITS_PER_CM);
    this.nodes = shape.nodes.map(n => ({
      id: n.id, p: toUnits(n.p), hIn: n.hIn && toUnits(n.hIn), hOut: n.hOut && toUnits(n.hOut), smooth: !!n.smooth
    }));
    this.nextId = Math.max(...this.nodes.map(n => n.id)) + 1;
    this.regions = JSON.parse(JSON.stringify(shape.regions ?? {}));
    // older files kept the width inside the drawing
    this.widthCm = knife.width_cm ?? (shape as any).width_cm ?? null;
    this.name = knife.name ?? '';
    this.source = null;
    this.pdfData = null;
    this.pdfPageCount = 0;
    this.contour = null;
    this.fileDpi = IMPORT_UNITS_PER_CM * 2.54;
    this.pivot = { x: (shape.size_cm?.width ?? 0) * IMPORT_UNITS_PER_CM / 2, y: (shape.size_cm?.height ?? 0) * IMPORT_UNITS_PER_CM / 2 };
    this.rotation = 0;
    this.flipped = false;
    this.selectedId = null;
    this.cancelTool();
    this.fitView();
    this.markImported();
  }

  // ---------------------------------------------------------------- babies preview

  toggleBabies() {
    if (!this.showBabies) {
      if (this.missingRegions.length) {
        this.status = 'Mark all regions to preview babies. Missing: ' + this.missingRegions.join(', ');
        return;
      }
      if (!this.unitsPerCm()) {
        this.status = 'Enter the knife width to preview babies.';
        return;
      }
    }
    this.showBabies = !this.showBabies;
    this.fitView();
  }

  /** Why the babies preview can't be shown yet; null when it can. */
  get babiesBlockedReason(): string | null {
    if (this.nodes.length < 3) {
      return 'Load a knife first.';
    }
    if (this.missingRegions.length) {
      return 'Mark all regions first. Missing: ' + this.missingRegions.join(', ') + '.';
    }
    if (!this.unitsPerCm()) {
      return 'Enter the knife width first.';
    }
    return null;
  }

  private previewBabies(): PreviewBaby[] {
    const unitsPerCm = this.unitsPerCm();
    if (!this.showBabies || !unitsPerCm) {
      return [];
    }
    return buildBabyPreview(this.nodes, this.regions, unitsPerCm, {
      lefts: this.previewLefts || 1, rights: this.previewRights || 1, crownSplit: this.previewCrownSplit || 1
    });
  }

  // ---------------------------------------------------------------- mouse & keyboard

  onPointerDown(e: PointerEvent) {
    const s = this.eventPoint(e);
    this.editorCanvas.nativeElement.setPointerCapture(e.pointerId);

    if (e.button === 1 || e.button === 2) {
      this.drag = { kind: 'pan', last: s };
      return;
    }
    if (this.tool === 'straighten') {
      const m = this.fromScreen(s);
      if (!this.straightenFirst) {
        this.straightenFirst = m;
        this.status = 'Straighten: click the second point.';
      }
      else {
        const first = this.straightenFirst;
        this.cancelTool();
        this.applyStraighten(first, m);
      }
      this.requestDraw();
      return;
    }
    if (this.tool === 'mark') {
      const id = this.pickOrInsertNode(s);
      if (id === null) {
        this.drag = { kind: 'pan', last: s };
        return;
      }
      if (this.markFirstId === null) {
        this.saveUndo();
        this.markFirstId = id;
        this.status = `${REGION_INFO[this.markKey!].label}: now click where it ends.`;
      }
      else if (id !== this.markFirstId) {
        this.completeMark(this.markFirstId, id);
      }
      this.requestDraw();
      return;
    }

    if (!this.showPoints) {
      this.drag = { kind: 'pan', last: s };
      return;
    }
    const handle = this.hitHandle(s);
    if (handle) {
      this.drag = { kind: handle, id: this.selectedId!, undoSaved: false };
      return;
    }
    const node = this.hitNode(s);
    if (node) {
      this.selectedId = node.id;
      this.drag = { kind: 'node', id: node.id, undoSaved: false };
    }
    else {
      this.selectedId = null;
      this.drag = { kind: 'pan', last: s };
    }
    this.requestDraw();
  }

  onPointerMove(e: PointerEvent) {
    const s = this.eventPoint(e);
    this.cursor = s;
    const drag = this.drag;
    if (drag?.kind === 'pan') {
      this.pan = add(this.pan, sub(s, drag.last));
      drag.last = s;
    }
    else if (drag) {
      const node = this.nodes.find(n => n.id === drag.id);
      if (node) {
        if (!drag.undoSaved) {
          this.saveUndo();
          drag.undoSaved = true;
        }
        this.dragNode(node, drag.kind, this.fromScreen(s));
      }
    }
    if (drag || this.tool !== 'edit') {
      this.requestDraw();
    }
  }

  onPointerUp() {
    this.drag = null;
  }

  onPointerLeave() {
    this.cursor = null;
    this.requestDraw();
  }

  onDoubleClick(e: MouseEvent) {
    if (this.tool !== 'edit' || !this.showPoints) return;
    const s = this.eventPoint(e);
    if (this.hitNode(s)) return;
    const id = this.pickOrInsertNode(s);
    if (id !== null) {
      this.selectedId = id;
      this.status = 'Point added.';
      this.requestDraw();
    }
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    this.zoomAround(this.eventPoint(e), Math.exp(-e.deltaY * 0.0015));
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)) {
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      this.undo();
    }
    else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedId !== null) {
        e.preventDefault();
        this.deleteSelected();
      }
    }
    else if (e.key === 'Escape') {
      this.cancelTool();
      this.selectedId = null;
      this.status = '';
    }
  }

  private dragNode(node: KnifeNode, kind: 'node' | 'hIn' | 'hOut', m: Vec) {
    if (kind === 'node') {
      const delta = sub(m, node.p);
      node.p = m;
      if (node.hIn) node.hIn = add(node.hIn, delta);
      if (node.hOut) node.hOut = add(node.hOut, delta);
      return;
    }
    node[kind] = m;
    const other = kind === 'hIn' ? 'hOut' : 'hIn';
    const otherHandle = node[other];
    if (node.smooth && otherHandle) {
      // keep the opposite handle aligned, at its own length
      const dir = norm(sub(node.p, m));
      node[other] = add(node.p, mul(dir, len(sub(otherHandle, node.p))));
    }
  }

  private eventPoint(e: MouseEvent): Vec {
    const rect = this.editorCanvas.nativeElement.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private hitNode(s: Vec): KnifeNode | null {
    let best: KnifeNode | null = null, bestDist = HIT_RADIUS;
    for (const n of this.nodes) {
      const d = dist(this.toScreen(n.p), s);
      if (d <= bestDist) {
        best = n;
        bestDist = d;
      }
    }
    return best;
  }

  private hitHandle(s: Vec): 'hIn' | 'hOut' | null {
    const node = this.selectedNode;
    if (!node) return null;
    if (node.hIn && dist(this.toScreen(node.hIn), s) <= HIT_RADIUS) return 'hIn';
    if (node.hOut && dist(this.toScreen(node.hOut), s) <= HIT_RADIUS) return 'hOut';
    return null;
  }

  /** The closest point on the outline (segment index and parameter), if within reach. */
  private hitSegment(s: Vec): { index: number; t: number; point: Vec } | null {
    let best: { index: number; t: number; point: Vec } | null = null;
    let bestDist = HIT_RADIUS;
    for (let i = 0; i < this.nodes.length; i++) {
      const b = segment(this.nodes, i);
      if (isStraight(this.nodes, i)) {
        const a = this.toScreen(b[0]), c = this.toScreen(b[3]);
        const ac = sub(c, a);
        const l2 = ac.x * ac.x + ac.y * ac.y;
        const t = l2 ? Math.max(0, Math.min(1, ((s.x - a.x) * ac.x + (s.y - a.y) * ac.y) / l2)) : 0;
        const d = dist(lerp(a, c, t), s);
        if (d <= bestDist) {
          bestDist = d;
          best = { index: i, t, point: lerp(b[0], b[3], t) };
        }
        continue;
      }
      const STEPS = 100;
      for (let k = 0; k <= STEPS; k++) {
        const p = bezierPoint(b, k / STEPS);
        const d = dist(this.toScreen(p), s);
        if (d <= bestDist) {
          bestDist = d;
          best = { index: i, t: k / STEPS, point: p };
        }
      }
    }
    return best;
  }

  /** Id of the node under the cursor, or of a new node inserted on the outline there. */
  private pickOrInsertNode(s: Vec): number | null {
    const node = this.hitNode(s);
    if (node) return node.id;
    const hit = this.hitSegment(s);
    if (!hit || hit.t <= 0 || hit.t >= 1) return null;
    this.saveUndo();
    return splitSegment(this.nodes, hit.index, hit.t, this.nextId++).id;
  }

  // ---------------------------------------------------------------- drawing

  fitView() {
    const canvas = this.editorCanvas?.nativeElement;
    if (!canvas || !canvas.clientWidth) return;
    let pts = [...outlineSamples(this.nodes), ...this.previewBabies().flatMap(b => b.corners)];
    if (!pts.length && this.source) {
      pts = [{ x: 0, y: 0 }, { x: this.source.width, y: 0 }, { x: 0, y: this.source.height }, { x: this.source.width, y: this.source.height }];
    }
    if (!pts.length) return;
    const o = pts.map(this.toOriented);
    const minX = Math.min(...o.map(p => p.x)), maxX = Math.max(...o.map(p => p.x));
    const minY = Math.min(...o.map(p => p.y)), maxY = Math.max(...o.map(p => p.y));
    const margin = 50;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    this.zoom = Math.min((w - 2 * margin) / ((maxX - minX) || 1), (h - 2 * margin) / ((maxY - minY) || 1));
    this.pan = { x: w / 2 - this.zoom * (minX + maxX) / 2, y: h / 2 - this.zoom * (minY + maxY) / 2 };
    this.viewFitted = true;
    this.requestDraw();
  }

  zoomBy(factor: number) {
    const canvas = this.editorCanvas.nativeElement;
    this.zoomAround({ x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 }, factor);
  }

  private zoomAround(s: Vec, factor: number) {
    const zoom = Math.min(50, Math.max(0.01, this.zoom * factor));
    // keep the point at s in place
    this.pan = sub(s, mul(sub(s, this.pan), zoom / this.zoom));
    this.zoom = zoom;
    this.requestDraw();
  }

  private resizeCanvas() {
    const canvas = this.editorCanvas.nativeElement;
    this.dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvas.clientWidth * this.dpr);
    canvas.height = Math.round(canvas.clientHeight * this.dpr);
    if (!this.viewFitted) {
      this.fitView();
    }
    this.draw();
  }

  requestDraw() {
    if (this.redrawPending) return;
    this.redrawPending = true;
    this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => {
      this.redrawPending = false;
      this.draw();
    }));
  }

  private draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const canvas = this.editorCanvas.nativeElement;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.backcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (this.source && this.showImage) {
      ctx.save();
      ctx.globalAlpha = this.imageOpacity;
      ctx.translate(this.pan.x, this.pan.y);
      ctx.scale(this.zoom, this.zoom);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.scale(this.flipped ? -1 : 1, 1);
      ctx.translate(-this.pivot.x, -this.pivot.y);
      ctx.drawImage(this.source, 0, 0);
      ctx.restore();
    }

    if (this.nodes.length >= 2) {
      const outline = new Path2D();
      const start = this.toScreen(this.nodes[0].p);
      outline.moveTo(start.x, start.y);
      this.nodes.forEach((_, i) => this.addSegmentToPath(outline, i));
      outline.closePath();
      ctx.fillStyle = 'rgba(13, 110, 253, 0.08)';
      ctx.fill(outline);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;
      ctx.stroke(outline);

      const babies = this.previewBabies();
      this.drawBabies(babies);
      this.drawRegions(!babies.length);
      this.drawWidth();
      this.drawNodes();
    }
    this.drawToolOverlay();
  }

  private addSegmentToPath(path: Path2D, i: number) {
    const b = segment(this.nodes, i).map(p => this.toScreen(p));
    if (isStraight(this.nodes, i)) {
      path.lineTo(b[3].x, b[3].y);
    }
    else {
      path.bezierCurveTo(b[1].x, b[1].y, b[2].x, b[2].y, b[3].x, b[3].y);
    }
  }

  private drawBabies(babies: PreviewBaby[]) {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const baby of babies) {
      const c = baby.corners.map(p => this.toScreen(p));
      ctx.beginPath();
      ctx.moveTo(c[0].x, c[0].y);
      c.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 193, 7, 0.12)';
      ctx.fill();
      ctx.strokeStyle = this.color;
      ctx.stroke();

      const center = mul(c.reduce((a, b) => add(a, b), { x: 0, y: 0 }), 1 / 4);
      const outer = lerp(c[1], c[2], 0.5);
      const lengthPos = add(outer, mul(norm(sub(outer, lerp(c[0], c[3], 0.5))), 10));
      ctx.fillStyle = this.color;
      ctx.font = '11px Arial';
      ctx.fillText(baby.label, center.x, center.y);
      ctx.fillText(String(baby.length), lengthPos.x, lengthPos.y);
    }
    ctx.restore();
  }

  private drawRegions(showLabels: boolean) {
    const ctx = this.ctx;
    const anchors = this.nodes.map(n => this.toScreen(n.p));
    const centroid = mul(anchors.reduce((a, b) => add(a, b), { x: 0, y: 0 }), 1 / anchors.length);

    for (const key of REGION_KEYS) {
      const region = this.regions[key];
      if (!region) continue;
      const segs = regionSegments(this.nodes, region);
      if (!segs.length) continue;
      const path = new Path2D();
      const start = this.toScreen(this.nodes[segs[0]].p);
      path.moveTo(start.x, start.y);
      segs.forEach(i => this.addSegmentToPath(path, i));
      ctx.save();
      ctx.strokeStyle = REGION_INFO[key].color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.75;
      ctx.stroke(path);
      ctx.restore();

      if (!showLabels) continue;
      // label, pushed outward from the middle of the region
      const samples = sampleRegion(this.nodes, region).map(p => this.toScreen(p));
      const mid = samples[Math.floor(samples.length / 2)];
      const pos = add(mid, mul(norm(sub(mid, centroid)), 22));
      this.drawLabel(REGION_INFO[key].label, pos, REGION_INFO[key].color);
    }
  }

  private drawLabel(text: string, pos: Vec, color: string) {
    const ctx = this.ctx;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width + 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(pos.x - w / 2, pos.y - 9, w, 18, 9);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(text, pos.x, pos.y);
  }

  /** Dimension line under the shape, from L1 to the Crown. */
  private drawWidth() {
    const span = measureSpan(this.nodes, this.regions, this.toOriented);
    if (!span) return;
    const maxY = Math.max(...outlineSamples(this.nodes).map(p => this.toOriented(p).y));
    const y = this.pan.y + maxY * this.zoom + 24;
    const x1 = this.pan.x + span.left * this.zoom, x2 = this.pan.x + span.right * this.zoom;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y); ctx.lineTo(x2, y);
    ctx.moveTo(x1, y - 6); ctx.lineTo(x1, y + 6);
    ctx.moveTo(x2, y - 6); ctx.lineTo(x2, y + 6);
    ctx.stroke();
    ctx.setLineDash([3, 3]);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(x1, y); ctx.lineTo(x1, y - 30);
    ctx.moveTo(x2, y); ctx.lineTo(x2, y - 30);
    ctx.stroke();
    ctx.restore();
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = this.color;
    ctx.fillText(this.widthCm ? this.widthCm + ' cm' : 'width ?', (x1 + x2) / 2, y + 6);
  }

  private drawNodes() {
    const ctx = this.ctx;
    const selected = this.selectedNode;
    if (selected && this.tool === 'edit') {
      const p = this.toScreen(selected.p);
      for (const h of [selected.hIn, selected.hOut]) {
        if (!h) continue;
        const hs = this.toScreen(h);
        ctx.strokeStyle = '#0d6efd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(hs.x, hs.y);
        ctx.stroke();
        ctx.fillStyle = '#0d6efd';
        ctx.beginPath();
        ctx.arc(hs.x, hs.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    for (const n of this.nodes) {
      const isSelected = n.id === this.selectedId || n.id === this.markFirstId;
      // with points hidden, only the start of a region being marked is shown
      if (!this.showPoints && !isSelected) continue;
      const s = this.toScreen(n.p);
      ctx.fillStyle = isSelected ? '#0d6efd' : this.backcolor;
      ctx.strokeStyle = isSelected ? '#0d6efd' : this.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (n.smooth) {
        ctx.arc(s.x, s.y, 4, 0, 2 * Math.PI);
      }
      else {
        ctx.rect(s.x - 4, s.y - 4, 8, 8);
      }
      ctx.fill();
      ctx.stroke();
    }
  }

  private drawToolOverlay() {
    const ctx = this.ctx;
    if (this.tool === 'straighten' && this.straightenFirst) {
      const a = this.toScreen(this.straightenFirst);
      ctx.save();
      ctx.strokeStyle = '#dc3545';
      ctx.fillStyle = '#dc3545';
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      if (this.cursor) ctx.lineTo(this.cursor.x, this.cursor.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(a.x, a.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
    if (this.tool === 'mark' && this.markKey && this.cursor) {
      // preview where the click would land on the outline
      const node = this.hitNode(this.cursor);
      const point = node ? node.p : this.hitSegment(this.cursor)?.point;
      if (point) {
        const s = this.toScreen(point);
        ctx.strokeStyle = REGION_INFO[this.markKey].color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 7, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
}
