import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { OrdersService } from '../../../services/orders.service';
import { firstValueFrom } from 'rxjs';
import { OrderDetails, Status } from '../../../../types';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight, faArrowsRotate, faPencil, faSave, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { NgFor, NgIf } from '@angular/common';
import { SortBabiesPipe } from "../../../utils/pipes/sort-babies-pipe";
import { PrefixPipe } from "../../../utils/pipes/prefix-pipe";
import html2pdf from 'html2pdf.js';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { TranslatePipe, TranslateEnumPipe } from '../../../i18n/translate.pipe';
import { TranslationService } from '../../../i18n/translation.service';
import { WingDiagramComponent } from '../../wings/wing-diagram/wing-diagram.component';
import { DIAGRAM_PAGE, composeDiagramPages } from './order-diagram-page';

@Component({
  selector: 'app-order-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateEnumPipe, WingDiagramComponent, FaIconComponent, DateStrPipe, NgFor, SortBabiesPipe, PrefixPipe, NgIf, PageLoadingComponent],
  templateUrl: './order-editor.component.html',
  styleUrl: './order-editor.component.scss'
})
export class OrderEditorComponent implements OnInit {
  orderDetails: OrderDetails = {
    /*✓*/ id: 0,
    /*✓*/ hat_id_with_customer: '',
    /*✓*/ isurgent: false,
    /*-*/ customer_name: '',
    /*✓*/ wall_material: '',
    /*✓*/ wall_material_color: '',
    /*-*/ kippa_size: 0,
    /*-*/ diameter_inches: 0,
    /*-*/ wing_quantity: 0,
    /*-*/ crown_material: '',
    /*-*/ wall_allocation_id: 0,
    /*-*/ crown_allocation_id: 0,
    /*-*/ tails_allocation_id_l: 0,
    /*-*/ tails_allocation_id_r: 0,
    /*-*/ crown_visible: 0,
    /*-*/ crown_length: 0,
    /*-*/ knife: 0,
    /*-*/ knife_id: null,
    /*-*/ knife_name: null,
    /*-*/ knife_width_cm: null,
    /*-*/ split_l1: 1,
    /*-*/ top_tilt: 0,
    /*-*/ top_opening: 0,
    /*-*/ white_hair_notes: '',
    /*-*/ white_hair: false,
    /*-*/ h_material_l: '',
    /*-*/ h_material_color_l: '',
    /*-*/ h_materiall_r: '',
    /*-*/ h_material_color_r: '',
    /*-*/ shorten_top_by: 0,
    /*-*/ shorten_crown_by: 0,
    /*-*/ tails_overdraft_l: 0,
    /*-*/ tails_overdraft_r: 0,
    /*-*/ mayler_width: 0,
    /*-*/ hl_width: 0,
    /*-*/ hr_width: 0,
    /*-*/ order_notes: '',
    /*✓*/ babies: [],
    /*-*/ wing_name: '',
    /*✓*/ create_date: null,
    /*✓*/ last_update_date: null,
    /*✓*/ last_status: ''
  };
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faSave: IconDefinition = faSave;
  faArrowLeft: IconDefinition = faArrowLeft;
  faPencil: IconDefinition = faPencil;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  customer_id: number = 0;
  loading: boolean = false;
  unsaved_changes: boolean = false;
  orders_list_back_to_link: string = "";
  orders_list_back_to_text: string = "";

  @ViewChild('printSection') printSection!: ElementRef;
  @ViewChild('screenDiagram') screenDiagram?: WingDiagramComponent;

  /** The pages of the wing diagram in real size, as images for printing (none until they are drawn, see drawDiagramPages). */
  diagramPages: string[] = [];
  private diagramPageCanvases: HTMLCanvasElement[] = [];
  private diagramQueue: Promise<void> = Promise.resolve();
  /** Whether the printout and the PDF have the thick outline around the diagram (the user's choice, before printing). */
  thickOutline: boolean = true;

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private toastService: ToastService,
    private translation: TranslationService,
    private changeDetector: ChangeDetectorRef){
      // the texts of the diagram page are drawn on it
      this.translation.changed.pipe(takeUntilDestroyed()).subscribe(() => this.refreshDiagramPage());
      let nav = router.getCurrentNavigation();

      if (nav && nav.extras.state && nav.extras.state['info']) {
        if(nav.extras.state['info']['orders_list_back_to_link']){
          this.orders_list_back_to_link = nav.extras.state['info']['orders_list_back_to_link'];
        }
        if(nav.extras.state['info']['orders_list_back_to_text']){
          this.orders_list_back_to_text = nav.extras.state['info']['orders_list_back_to_text'];
        }
      }      
  }

  ngOnInit(): void {
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.customer_id = Number(this.activatedRoute.snapshot.queryParamMap.get('customer_id'));
      this.getOrder(id);
  }

  async getOrder(id: number){
    this.loading = true;
    this.orderDetails = await firstValueFrom(this.ordersService.getOrder(id));
    //console.dir(this.orderDetails);
    this.loading = false;
    this.refreshDiagramPage();   // in the background, so that printing is ready
  }

  goToCustomersList(){
    this.router.navigate(['inventory/customer/orders'], { 
      queryParams: {
        customer_id: this.customer_id
      },
      state: {
        info: {
          customer_name: this.orderDetails.customer_name,
          back_to_link: this.orders_list_back_to_link,
          back_to_text: this.orders_list_back_to_text
        }
      }
    });
  }

  openUpdateStatus(){}

  openHistoryDialog(){}

  /** The print styles apply to the sheet only while printing (also for Ctrl+P, not just the Print button). */
  @HostListener('window:beforeprint')
  beforePrint() {
    document.body.classList.add('printing-order');
  }

  @HostListener('window:afterprint')
  afterPrint() {
    document.body.classList.remove('printing-order');
  }

  /** Draws the diagram page again (one at a time). */
  refreshDiagramPage(): Promise<void> {
    this.diagramQueue = this.diagramQueue.then(() => this.drawDiagramPages()).catch(error => console.error(error));
    return this.diagramQueue;
  }

  /**
   * The pages of the wing diagram in real size (1 cm of the knife is 1 cm on paper): the diagram is drawn for paper by the wing
   * diagram component (turned and with its bottom cut off, as far as the babies allow, when that lets it fit one page, see
   * print-fit.ts) and cut into pages that overlap when it is bigger than one page, each with a small title
   * (order-diagram-page.ts). The images are shown by the print styles, and added to the PDF.
   */
  private async drawDiagramPages() {
    await new Promise(resolve => setTimeout(resolve));   // after the page has the order, so that the diagram has its knife and babies
    const diagram = this.screenDiagram;
    this.diagramPageCanvases = [];
    this.diagramPages = [];
    if (!diagram || this.orderDetails.id <= 0 || !(await diagram.whenReady())) {
      return;
    }
    const printed = diagram.renderForPrint({ widthMm: DIAGRAM_PAGE.widthMm, heightMm: DIAGRAM_PAGE.heightMm - DIAGRAM_PAGE.captionMm }, this.thickOutline);
    if (!printed) {
      return;
    }
    const t = this.translation;
    const pages = composeDiagramPages(printed, {
      title: `${t.t('customers:order_editor.job_order', { number: '#' + this.orderDetails.id })} - ${t.t('customers:order_editor.diagram_title')}: ${this.orderDetails.wing_name}`,
      rtl: t.dir === 'rtl'
    });
    this.diagramPageCanvases = pages;
    this.diagramPages = pages.map(page => page.toDataURL('image/png'));
  }

  async print() {
    await this.refreshDiagramPage();
    if (!this.diagramPages.length) {
      this.toastService.showError(this.translation.t('customers:order_editor.diagram_failed'));
    }
    this.changeDetector.detectChanges();   // the images of the diagram pages are in the sheet
    const images = Array.from(this.printSection.nativeElement.querySelectorAll('.diagram-sheet img')) as HTMLImageElement[];
    await Promise.all(images.map(image => image.decode().catch(() => { })));
    window.print();
  }

  async exportPdf(): Promise<void> {
    await this.refreshDiagramPage();
    const diagram_pages = this.diagramPageCanvases;
    if (!diagram_pages.length) {
      this.toastService.showError(this.translation.t('customers:order_editor.diagram_failed'));
    }
    const options = {
      margin:       10,
      filename:     `hat_order_${this.orderDetails.hat_id_with_customer}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // the sheet (without the diagram on the screen, which is data-html2canvas-ignore)...
    const worker = html2pdf().from(this.printSection.nativeElement).set(options);
    if (!diagram_pages.length) {
      worker.save();
      return;
    }
    // ...and the pages of the diagram after it, in the printable area (the same as when printing), so it is 1:1
    const pdf = await worker.toPdf().get('pdf');
    for (const page of diagram_pages) {
      pdf.addPage('a4', 'portrait');
      pdf.addImage(page.toDataURL('image/png'), 'PNG', options.margin, options.margin, DIAGRAM_PAGE.widthMm, DIAGRAM_PAGE.heightMm);
    }
    pdf.save(options.filename);
  }

}
