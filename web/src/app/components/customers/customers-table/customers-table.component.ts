import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BasicUserInfoStatus, Customer, CustomerListItem, Customers } from '../../../../types';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faArrowsRotate, faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { ToastComponent } from '../../common/toast/toast.component';
import { ToastService } from '../../../services/toast.service';
import { CustomersService } from '../../../services/customers.service';
import { SingleHatCalculatorComponent } from '../single-hat-calculator/single-hat-calculator.component';
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { firstValueFrom, tap } from 'rxjs';
import { SettingsService } from '../../../services/settings.service';
import { HasPermissionPipe } from '../../../utils/pipes/has-permission.pipe';
import { UsersService } from '../../../services/users.service';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [NgFor, PaginatorComponent, PaginatorComponent, HasPermissionPipe, AsyncPipe, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, DateStrPipe, ToastComponent, DecimalPipe, SingleHatCalculatorComponent, PageLoadingComponent],
  templateUrl: './customers-table.component.html',
  styleUrl: './customers-table.component.scss'
})
export class CustomersTableComponent extends NavigatedMessageComponent implements OnInit {
  
  constructor(
    private customersService: CustomersService, 
    private modalService: NgbModal,
    private settingsService: SettingsService,
    router: Router, 
    stateService: StateService,
    toastService: ToastService, 
    private usersService: UsersService) {
      super(toastService, stateService, router);
      this.showNavigationToastIfMessagePending();
  }

  current_page = 1;
  rowsPerPage:number = 5;
  customers: CustomerListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faBasketShopping: IconDefinition = faBasketShopping;
  loading: boolean = true;
  totalRecords: number = 0;
  @Input() showTitle : boolean = true;
  @Input() stretchWidth: boolean = false;
  @Input() paged: boolean = true;

  user$ = this.usersService.user$;

  getCustomers(page: number){
    this.customersService.getCustomers({ 
      page: page, 
      perPage: ((this.paged)? this.rowsPerPage : -1)
    }).subscribe(
    {
      next: (customers: Customers) => {
        this.loading = false;
        this.current_page = page;
        this.customers = customers.data;
        this.paginator.pages = customers.meta.total_pages;
        this.paginator.current_page = customers.meta.page;
        this.totalRecords = customers.meta.total_records;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  async ngOnInit(){
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.getCustomers(1);
    history.replaceState({}, location.href);
  }

  pageChange (page: number) {
    this.getCustomers(page);
  }

  open() {
    //this.dialog.open();
  }

  showSuccess(text: string) {
		this.toastService.showError (text);
	}

  go_to_orders(customer_id: number, customer_name: string){
    this.router.navigate(['/inventory/customer/orders'], {
      queryParams: {
        customer_id: customer_id
      },
      state: {
        info: {
          customer_name: customer_name,
          back_to_link: '/inventory/customers',
          back_to_text: 'Back to customers list'
        }
      },
    });
  }
}
