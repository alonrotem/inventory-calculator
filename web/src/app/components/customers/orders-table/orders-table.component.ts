import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { faArrowLeft, faArrowsRotate, faBasketShopping, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { OrdersService } from '../../../services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { StateService } from '../../../services/state.service';
import { SettingsService } from '../../../services/settings.service';
import { WingsPerHatShorthandPipe } from "../../../utils/pipes/wings-per-hat-shorthand-pipe";

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [NgFor, PaginatorComponent, PaginatorComponent, ModalDialogComponent, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, DateStrPipe, ToastComponent, DecimalPipe, SingleHatCalculatorComponent, WingsPerHatShorthandPipe],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent extends NavigatedMessageComponent implements OnInit {
  current_page = 1;
  rowsPerPage:number = 5;
  orders: OrderListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faBasketShopping: IconDefinition = faBasketShopping;
  faArrowLeft: IconDefinition = faArrowLeft;
  loading: boolean = true;
  totalRecords: number = 0;
  customer_id:number = 0;
  customer_name: string = '';
  back_button_link: string = '/inventory/customer/hat-calculator';
  back_button_text: string = 'Back to calculator';

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
      console.log("NEW LOAD! " + params['customer_id']);
      this.geOrders(1);
    });
  }

  geOrders(page: number){
      this.ordersService.getOrders({ page: page, perPage:this.rowsPerPage }, this.customer_id).subscribe(
      {
        next: (orders: OrdersList) => {
          this.loading = false;
          this.current_page = page;
          this.orders = orders.data;
          this.paginator.pages = orders.meta.total_pages;
          this.paginator.current_page = orders.meta.page;
          this.totalRecords = orders.meta.total_records;
          console.dir(this.orders);
        },
        error: (error) => {
          console.log(error);
        }
      })
    }

    pageChange (page: number) {
      this.geOrders(page);
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
