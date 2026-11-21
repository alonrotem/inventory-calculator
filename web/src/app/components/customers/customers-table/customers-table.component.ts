import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BasicUserInfoStatus, Customer, CustomerListItem, Customers, ListParams } from '../../../../types';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faArrowsRotate, faBasketShopping, faFlask } from '@fortawesome/free-solid-svg-icons';
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
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { TranslationService } from '../../../i18n/translation.service';
import { loadListSort, saveListSort } from '../../../utils/list-sort-storage';

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [NgFor, PaginatorComponent, PaginatorComponent, HasPermissionPipe, AsyncPipe, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, DateStrPipe, ToastComponent, DecimalPipe, SingleHatCalculatorComponent, PageLoadingComponent, TranslatePipe],
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
    private usersService: UsersService,
    activatedRoute: ActivatedRoute) {
      super(toastService, stateService, router, activatedRoute);
  }

  private translation = inject(TranslationService);

  current_page = 1;
  rowsPerPage:number = 5;
  customers: CustomerListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faBasketShopping: IconDefinition = faBasketShopping;
  faFlask: IconDefinition = faFlask;
  loading: boolean = true;
  totalRecords: number = 0;
  @Input() showTitle : boolean = true;
  @Input() stretchWidth: boolean = false;
  @Input() paged: boolean = true;

  user$ = this.usersService.user$;

  // sorting and filtering (by the server, before paging)
  // the sort the list was left with is kept, so that it opens the same way next time
  private static readonly SORT_KEY = 'customers';
  private static readonly SORT_COLUMNS = ['name', 'business_name', 'bank_count', 'allocation_count'];
  sortColumn?: string = loadListSort(CustomersTableComponent.SORT_KEY, CustomersTableComponent.SORT_COLUMNS)?.column;
  sortDirection: 'asc' | 'desc' = loadListSort(CustomersTableComponent.SORT_KEY, CustomersTableComponent.SORT_COLUMNS)?.direction ?? 'asc';
  filterColumn: string = '';        // '' : all columns
  filterText: string = '';
  private filterTimer: ReturnType<typeof setTimeout> | undefined;

  get filterActive(): boolean {
    return this.filterText.trim() !== '';
  }

  getCustomers(page: number){
    const list: ListParams = {
      page: page,
      perPage: ((this.paged)? this.rowsPerPage : -1)
    };
    if (this.sortColumn) {
      list.sort_column = this.sortColumn;
      list.sort_direction = this.sortDirection;
    }
    if (this.filterActive) {
      list.filter_expression = this.filterText.trim();
      if (this.filterColumn) {
        list.filter_column = this.filterColumn;
      }
    }
    this.customersService.getCustomers(list).subscribe(
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

  /** A column header was clicked: sort by it, ascending; again: descending. */
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    saveListSort(CustomersTableComponent.SORT_KEY, { column: this.sortColumn, direction: this.sortDirection });
    this.getCustomers(1);
  }

  sortIndicator(column: string): string {
    return this.sortColumn === column ? (this.sortDirection === 'asc' ? '▲' : '▼') : '';
  }

  ariaSort(column: string): 'ascending' | 'descending' | 'none' {
    return this.sortColumn === column ? (this.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none';
  }

  /** The filter text was typed: the list is asked for after a short pause in typing. */
  filterTextChanged(text: string) {
    this.filterText = text;
    clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => this.getCustomers(1), 300);
  }

  filterColumnChanged(column: string) {
    this.filterColumn = column;
    if (this.filterActive) {
      this.getCustomers(1);
    }
  }

  clearFilter() {
    clearTimeout(this.filterTimer);
    this.filterText = '';
    this.getCustomers(1);
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
          back_to_text: this.translation.t('customers:list.back_to_list')
        }
      },
    });
  }
}
