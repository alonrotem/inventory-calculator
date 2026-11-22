import { Component, OnInit, ViewChild } from '@angular/core';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { AccountRequestListItem, AccountsRequestList, ListParams } from '../../../../types';
import { DecimalPipe, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from '../../../services/settings.service';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { StateService } from '../../../services/state.service';
import { ActivePage, UserTabsComponent } from "../../settings/user-tabs/user-tabs.component";
import { TranslatePipe, TranslateEnumPipe } from '../../../i18n/translate.pipe';
import { loadListSort, saveListSort } from '../../../utils/list-sort-storage';

@Component({
  selector: 'app-account-requests-list',
  standalone: true,
  imports: [TranslatePipe, TranslateEnumPipe, PageLoadingComponent, DecimalPipe, NgFor, RouterModule, DateStrPipe, PaginatorComponent, FaIconComponent, UserTabsComponent],
  templateUrl: './account-requests-list.component.html',
  styleUrl: './account-requests-list.component.scss'
})
export class AccountRequestsListComponent extends NavigatedMessageComponent implements OnInit {
  ActivePage = ActivePage;
  loading:boolean = true;   // until the first page is there
  account_requests : AccountRequestListItem[] = [];
  totalRecords: number = 0;
  faUserPlus :IconDefinition = faUserPlus;
  rowsPerPage: number = 10;
  current_page: number = 1;
  @ViewChild("paginator") paginator!: PaginatorComponent;

  constructor(
    private settingsService:SettingsService, 
    private usersService: UsersService, 
    toastService: ToastService, 
    stateService: StateService, 
    router: Router,
    activatedRoute: ActivatedRoute){

    super(toastService, stateService, router, activatedRoute);
  }

  async ngOnInit() {
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.getRequests(1);
  }

  pageChange (page: number) {
    this.getRequests(page);
  }

  // sorting and filtering (by the server, before paging)
  // the sort the list was left with is kept, so that it opens the same way next time
  private static readonly SORT_KEY = 'account_requests';
  private static readonly SORT_COLUMNS = ['name', 'email', 'request_date', 'request_status'];
  sortColumn?: string = loadListSort(AccountRequestsListComponent.SORT_KEY, AccountRequestsListComponent.SORT_COLUMNS)?.column;
  sortDirection: 'asc' | 'desc' = loadListSort(AccountRequestsListComponent.SORT_KEY, AccountRequestsListComponent.SORT_COLUMNS)?.direction ?? 'asc';
  filterColumn: string = '';        // '' : all columns
  filterText: string = '';
  private filterTimer: ReturnType<typeof setTimeout> | undefined;

  get filterActive(): boolean {
    return this.filterText.trim() !== '';
  }

  /** The list's sorting and filtering, for the server. */
  private listParams(page: number, perPage: number): ListParams {
    const list: ListParams = { page: page, perPage: perPage };
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
    return list;
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
    saveListSort(AccountRequestsListComponent.SORT_KEY, { column: this.sortColumn, direction: this.sortDirection });
    this.getRequests(1);
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
    this.filterTimer = setTimeout(() => this.getRequests(1), 300);
  }

  filterColumnChanged(column: string) {
    this.filterColumn = column;
    if (this.filterActive) {
      this.getRequests(1);
    }
  }

  clearFilter() {
    clearTimeout(this.filterTimer);
    this.filterText = '';
    this.getRequests(1);
  }

  getRequests(page: number){
    this.usersService.getAccountRequests(this.listParams(page, this.rowsPerPage)).subscribe({
      next: (requests: AccountsRequestList) => {
        this.current_page = page;
        this.account_requests = requests.data;
        this.paginator.pages = requests.meta.total_pages;
        this.paginator.current_page = requests.meta.page;
        this.totalRecords = requests.meta.total_records;
        this.loading = false;
      },
      error: (error) => { this.toastService.showError(error.error.message); this.loading = false; }
    });
  }
}
