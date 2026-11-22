import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivePage, UserTabsComponent } from "../user-tabs/user-tabs.component";
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { UsersService } from '../../../services/users.service';
import { SettingsService } from '../../../services/settings.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { ToastService } from '../../../services/toast.service';
import { UserListItem, UsersList, ListParams } from '../../../../types';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFlask } from '@fortawesome/free-solid-svg-icons';
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";
import { SettingsUserInviteFormComponent } from "../settings-user-invite-form/settings-user-invite-form.component";
import { TranslatePipe, TranslateEnumPipe } from '../../../i18n/translate.pipe';
import { loadListSort, saveListSort } from '../../../utils/list-sort-storage';

@Component({
  selector: 'app-settings-users',
  standalone: true,
  imports: [TranslatePipe, TranslateEnumPipe, UserTabsComponent, PageLoadingComponent, DecimalPipe, NgFor, NgIf, RouterLink, PaginatorComponent, DateStrPipe, FaIconComponent, ModalDialogComponent, SettingsUserInviteFormComponent],
  templateUrl: './settings-users.component.html',
  styleUrl: './settings-users.component.scss'
})
export class SettingsUsersComponent extends NavigatedMessageComponent implements OnInit {
  
  environment = environment
  ActivePage = ActivePage;
  current_page = 1;
  rowsPerPage:number = 5;
  totalRecords: number = 0;
  loading: boolean = true;
  users: UserListItem[] = [];
  faEnvelope: IconDefinition = faEnvelope;
  faFlask: IconDefinition = faFlask;
  @ViewChild("paginator") paginator!: PaginatorComponent;
  @ViewChild("invite_user_form_dialog") invite_user_form_dialog!: SettingsUserInviteFormComponent;

  constructor(
    private usersService: UsersService, 
    private settingsService: SettingsService, 
    router: Router, 
    stateService: StateService,
    toastService: ToastService,
    activatedRoute: ActivatedRoute
    ) {
      super(toastService, stateService, router, activatedRoute);
  }

  async ngOnInit() {
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.getUsers(1);
    history.replaceState({}, location.href);    
  }

  pageChange (page: number) {
    this.getUsers(page);
  }

  // sorting and filtering (by the server, before paging)
  // the sort the list was left with is kept, so that it opens the same way next time
  private static readonly SORT_KEY = 'users';
  private static readonly SORT_COLUMNS = ['name', 'email', 'role', 'status', 'registered_at'];
  sortColumn?: string = loadListSort(SettingsUsersComponent.SORT_KEY, SettingsUsersComponent.SORT_COLUMNS)?.column;
  sortDirection: 'asc' | 'desc' = loadListSort(SettingsUsersComponent.SORT_KEY, SettingsUsersComponent.SORT_COLUMNS)?.direction ?? 'asc';
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
    saveListSort(SettingsUsersComponent.SORT_KEY, { column: this.sortColumn, direction: this.sortDirection });
    this.getUsers(1);
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
    this.filterTimer = setTimeout(() => this.getUsers(1), 300);
  }

  filterColumnChanged(column: string) {
    this.filterColumn = column;
    if (this.filterActive) {
      this.getUsers(1);
    }
  }

  clearFilter() {
    clearTimeout(this.filterTimer);
    this.filterText = '';
    this.getUsers(1);
  }

  getUsers(page: number){
    //console.log("this.rowsPerPage: " + this.rowsPerPage);
    this.usersService.getUsers(this.listParams(page, this.rowsPerPage)).subscribe(
    {
      next: (users: UsersList) => {
        this.loading = false;
        this.current_page = page;
        this.users = users.data;
        this.paginator.pages = users.meta.total_pages;
        this.paginator.current_page = users.meta.page;
        this.totalRecords = users.meta.total_records;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getInitials(user: UserListItem) {
    //this.userInfo = userInfo;
    let initials = "";
    if(user.firstname) {
      initials = user.firstname[0];
    }
    if(user.lastname) {
      initials += user.lastname[0];
    }
    else if (user.firstname.length > 1) {
      initials += user.firstname[1];
    }
    return initials;
  }

  open_invite_form(){
    this.invite_user_form_dialog.open();
  }
}
