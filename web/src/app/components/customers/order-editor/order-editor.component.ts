import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { OrdersService } from '../../../services/orders.service';
import { firstValueFrom } from 'rxjs';
import { OrderDetails, Status } from '../../../../types';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight, faArrowsRotate, faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { NgFor, NgIf } from '@angular/common';
import { SortBabiesPipe } from "../../../utils/pipes/sort-babies-pipe";
import { PrefixPipe } from "../../../utils/pipes/prefix-pipe";
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-order-editor',
  standalone: true,
  imports: [FaIconComponent, DateStrPipe, NgFor, SortBabiesPipe, PrefixPipe, NgIf],
  templateUrl: './order-editor.component.html',
  styleUrl: './order-editor.component.scss'
})
export class OrderEditorComponent implements OnInit {
  orderDetails: OrderDetails = {
    id: 0,
    hat_id_with_customer: '',
    order_status: Status.new,
    isurgent: false,
    customer_name: '',
    wing_name: '',
    wall_material: '',
    wall_material_color: '',
    diameter_inches: 12.5,
    kippa_size: 0,
    wing_quantity: 0,
    crown_material: '',
    crown_material_color: '',
    crown_visible: 0,
    crown_length: 0,
    knife: 0,
    white_hair_notes: '',
    white_hair: false,
    h_material: '',
    h_material_color: '',
    date: new Date(),
    shorten_top_by: 0,
    shorten_crown_by: 0,
    tails_overdraft: 0,
    mayler_width: 0,
    hr_hl_width: 0,
    order_notes: '',
    original_order_date: null,
    babies: []
  };
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faSave: IconDefinition = faSave;
  faArrowLeft: IconDefinition = faArrowLeft;
  customer_id: number = 0;
  loading: boolean = false;
  unsaved_changes: boolean = false;
  orders_list_back_to_link: string = "";
  orders_list_back_to_text: string = "";

  @ViewChild('printSection') printSection!: ElementRef;

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private toastService: ToastService){
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

  print() {
    window.print();
  }

  exportPdf(): void {
    const options = {
      margin:       10,
      filename:     `hat_order_${this.orderDetails.hat_id_with_customer}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(this.printSection.nativeElement).set(options).save();
  }

}
