import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { ToastComponent } from '../../common/toast/toast.component';
import { SingleHatCalculatorComponent } from '../single-hat-calculator/single-hat-calculator.component';
import { OrderListItem, OrdersList } from '../../../../types';
import { faArrowLeft, faArrowsRotate, faBasketShopping, faPen, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { OrdersService } from '../../../services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { StateService } from '../../../services/state.service';
import { SettingsService } from '../../../services/settings.service';
import { WingsPerHatShorthandPipe } from "../../../utils/pipes/wings-per-hat-shorthand-pipe";
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [NgFor, PaginatorComponent, PaginatorComponent, ModalDialogComponent, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, DateStrPipe, ToastComponent, DecimalPipe, SingleHatCalculatorComponent, WingsPerHatShorthandPipe, PageLoadingComponent],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent extends NavigatedMessageComponent implements OnInit {
  current_page = 1;
  rowsPerPage:number = 5;
  orders: OrderListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  @ViewChild("notes_editor") notes_editor!: ModalDialogComponent;
  @ViewChild("txtNotes") txtNotes!: ElementRef;
  notes_editor_placeholder: string = "";
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faBasketShopping: IconDefinition = faBasketShopping;
  faArrowLeft: IconDefinition = faArrowLeft;
  faPen: IconDefinition = faPen;
  loading: boolean = true;
  totalRecords: number = 0;
  customer_id:number = 0;
  customer_name: string = '';
  back_button_link: string = '/inventory/customer/hat-calculator';
  back_button_text: string = 'Back to calculator';
  updating_urgent_status: boolean[] = [];
  updating_white_hair_status: boolean[] = [];
  updating_white_hair_notes_status: boolean[] = [];
  updating_order_notes_status: boolean[] = [];

  constructor(
    private ordersService: OrdersService, 
    private modalService: NgbModal, 
    private settingsService: SettingsService,
    router: Router, 
    stateService: StateService,
    toastService: ToastService,
    private activatedRoute: ActivatedRoute) {
      let nav = router.getCurrentNavigation();
      super(toastService, stateService, router);
      this.showNavigationToastIfMessagePending();

      if (nav && nav.extras.state && nav.extras.state['info']) {
        if(nav.extras.state['info']['customer_name']){
          this.customer_name = nav.extras.state['info']['customer_name'];
        }
        if(nav.extras.state['info']['back_to_link']){
          this.back_button_link = nav.extras.state['info']['back_to_link'];
        }
        if(nav.extras.state['info']['back_to_text']){
          this.back_button_text = nav.extras.state['info']['back_to_text'];
        }
      }
    }

  async ngOnInit() {
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['customer_id'] && params['customer_id'] != 0) {
        this.customer_id = params['customer_id'];
      }
      else {
        this.customer_id = 0;
        this.customer_name = "";
      }
      //console.log("NEW LOAD! " + params['customer_id']);
      this.geOrders(1);
    });
  }

  geOrders(page: number){
    this.ordersService.getOrders({ page: page, perPage:this.rowsPerPage }, this.customer_id).subscribe(
    {
      next: (orders: OrdersList) => {
        console.dir(orders);
        this.loading = false;
        this.current_page = page;
        this.orders = orders.data;
        this.paginator.pages = orders.meta.total_pages;
        this.paginator.current_page = orders.meta.page;
        this.totalRecords = orders.meta.total_records;
        this.updating_urgent_status = Array(this.orders.length).fill(false);
        this.updating_white_hair_status = Array(this.orders.length).fill(false);
        this.updating_white_hair_notes_status = Array(this.orders.length).fill(false);
        this.updating_order_notes_status = Array(this.orders.length).fill(false);
        //console.dir(this.orders);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  pageChange (page: number) {
    this.geOrders(page);
  }

  update_boolean_status(busy_status_array: boolean[], i: number, property_name: string){
    busy_status_array[i] = true;
    
    let order = this.orders[i];
    type ObjectKey = keyof typeof order;
    const prop_ref = property_name as ObjectKey;
    
    let curValue = this.orders[i][prop_ref];

    this.ordersService.updateOrderProperty(this.orders[i].order_id, property_name, (!curValue).toString()).subscribe({
      next: (newValue: any) => {
        //console.log(this.orders[i].order_id + " "+ property_name +" -> " + newValue["value"]);
        this.toastService.showSuccess(property_name + " status updated: " + this.orders[i].hat_id_with_customer);
        (this.orders[i][prop_ref] as boolean) = !this.orders[i][prop_ref];
        busy_status_array[i] = false;
      },
      error: (error) => {
        this.toastService.showError("Failed to update " + property_name + " status " + this.orders[i].hat_id_with_customer);
        console.log(error);
        busy_status_array[i] = false;
      }
    });
  }

  pending_update_notes_index: number = -1;
  pending_update_notes_property: string = "";
  pending_update_status_array: boolean[] = [];

  update_text_nots_status(busy_status_array: boolean[], i: number, property_name: string, property_value: string){
    busy_status_array[i] = true;
    
    let order = this.orders[i];
    type ObjectKey = keyof typeof order;
    const prop_ref = property_name as ObjectKey;
    
    //let curValue = this.orders[i][prop_ref];
    const trimmed_value = property_value.trim().replace(/[\r\n]+/gm, " ").replace(/\s+/gm, " ");

    this.ordersService.updateOrderProperty(this.orders[i].order_id, property_name, trimmed_value).subscribe({
      next: (newValue: any) => {
        //console.log(this.orders[i].order_id + " "+ property_name +" -> " + newValue["value"]);
        this.toastService.showSuccess(property_name + " status updated: " + this.orders[i].hat_id_with_customer);
        (this.orders[i][prop_ref] as string) = trimmed_value;
        busy_status_array[i] = false;
        this.pending_update_notes_index = -1;
        this.pending_update_notes_property = "";
      },
      error: (error) => {
        this.toastService.showError("Failed to update " + property_name + " status " + this.orders[i].hat_id_with_customer);
        console.log(error);
        busy_status_array[i] = false;
        this.pending_update_notes_index = -1;
        this.pending_update_notes_property = "";
      }
    });
  }

  edit_white_hair_notes(index: number){
    this.pending_update_notes_index = index;
    this.pending_update_notes_property = "white_hair_notes";
    this.notes_editor_placeholder = this.orders[index].white_hair_notes;
    this.pending_update_status_array = this.updating_white_hair_notes_status;
    this.notes_editor.open();
  }

  edit_order_notes(index: number){
    this.pending_update_notes_index = index;
    this.pending_update_notes_property = "order_notes";
    this.notes_editor_placeholder = this.orders[index].order_notes;
    this.pending_update_status_array = this.updating_order_notes_status;
    this.notes_editor.open();
  }

  
  notes_editor_opened(){
    this.txtNotes.nativeElement.focus();
    this.txtNotes.nativeElement.selectionStart = this.txtNotes.nativeElement.textContent.length;
    this.txtNotes.nativeElement.selectionEnd = this.txtNotes.nativeElement.textContent.length;
  }

  notes_editor_enter_pressed(){
    this.notes_editor.onConfirm();
  }

  note_editor_confirmed() {
    if(this.pending_update_notes_index >= 0){
      this.update_text_nots_status(
        this.pending_update_status_array, 
        this.pending_update_notes_index, 
        this.pending_update_notes_property, 
        this.notes_editor_placeholder);
    }
  }

  notes_editor_cancelled(){
      this.pending_update_notes_index = -1;
      this.pending_update_notes_property = "";
  }

  go_to_odrer(order_id: number, customer_id: number){
    this.router.navigate(['/inventory/customer/order/editor'], {
      queryParams: {
        id: order_id,
        customer_id: customer_id
      },
      state: {
        info: {
          orders_list_back_to_link: this.back_button_link,
          orders_list_back_to_text: this.back_button_text
        }
      },
    });      
  }
}
