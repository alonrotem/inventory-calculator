import { Component, OnInit, ViewChild } from '@angular/core';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { AccountRequestListItem, AccountsRequestList } from '../../../../types';
import { DecimalPipe, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-account-requests-list',
  standalone: true,
  imports: [PageLoadingComponent, DecimalPipe, NgFor, RouterModule, DateStrPipe, PaginatorComponent, FaIconComponent],
  templateUrl: './account-requests-list.component.html',
  styleUrl: './account-requests-list.component.scss'
})
export class AccountRequestsListComponent extends NavigatedMessageComponent implements OnInit {

  loading:boolean = false;
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
    router: Router){
    super(toastService, stateService, router);
    this.showNavigationToastIfMessagePending();
  }

  async ngOnInit() {
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.getRequests(1);
  }

  pageChange (page: number) {
    this.getRequests(page);
  }

  getRequests(page: number){
    this.loading = true;
    this.usersService.getAccountRequests({ page: page, perPage: this.rowsPerPage}).subscribe({
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
