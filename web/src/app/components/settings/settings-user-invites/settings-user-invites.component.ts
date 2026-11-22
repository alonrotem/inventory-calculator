import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivePage, UserTabsComponent } from "../user-tabs/user-tabs.component";
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEnvelope, faFlask } from '@fortawesome/free-solid-svg-icons';
import { SettingsUserInviteFormComponent } from '../settings-user-invite-form/settings-user-invite-form.component';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { StateService } from '../../../services/state.service';
import { ToastService } from '../../../services/toast.service';
import { UsersService } from '../../../services/users.service';
import { AccountInviteList, AccountInviteListItem, ListParams } from '../../../../types';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { TranslatePipe, TranslateEnumPipe } from '../../../i18n/translate.pipe';
import { loadListSort, saveListSort } from '../../../utils/list-sort-storage';

@Component({
  selector: 'app-settings-user-invites',
  standalone: true,
  imports: [TranslatePipe, TranslateEnumPipe, UserTabsComponent, PageLoadingComponent, FaIconComponent, DateStrPipe, PaginatorComponent, NgIf, NgFor, RouterLink, DecimalPipe, SettingsUserInviteFormComponent],
  templateUrl: './settings-user-invites.component.html',
  styleUrl: './settings-user-invites.component.scss'
})
export class SettingsUserInvitesComponent extends NavigatedMessageComponent implements OnInit {
  @ViewChild("paginator") paginator!: PaginatorComponent;
  @ViewChild("invite_user_form_dialog") invite_user_form_dialog!: SettingsUserInviteFormComponent;
  invitations: AccountInviteListItem[] = [];
  ActivePage = ActivePage;
  current_page = 1;
  rowsPerPage:number = 5;
  totalRecords: number = 0;
  loading: boolean = false;
  faEnvelope: IconDefinition = faEnvelope;
  faFlask: IconDefinition = faFlask;

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

    this.getInvitations(1);
    history.replaceState({}, location.href);    
  }

  pageChange (page: number) {
    this.getInvitations(page);
  }

  // sorting and filtering (by the server, before paging)
  // the sort the list was left with is kept, so that it opens the same way next time
  private static readonly SORT_KEY = 'user_invites';
  private static readonly SORT_COLUMNS = ['name', 'email', 'role', 'invite_status', 'sent_date', 'last_update'];
  sortColumn?: string = loadListSort(SettingsUserInvitesComponent.SORT_KEY, SettingsUserInvitesComponent.SORT_COLUMNS)?.column;
  sortDirection: 'asc' | 'desc' = loadListSort(SettingsUserInvitesComponent.SORT_KEY, SettingsUserInvitesComponent.SORT_COLUMNS)?.direction ?? 'asc';
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
    saveListSort(SettingsUserInvitesComponent.SORT_KEY, { column: this.sortColumn, direction: this.sortDirection });
    this.getInvitations(1);
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
    this.filterTimer = setTimeout(() => this.getInvitations(1), 300);
  }

  filterColumnChanged(column: string) {
    this.filterColumn = column;
    if (this.filterActive) {
      this.getInvitations(1);
    }
  }

  clearFilter() {
    clearTimeout(this.filterTimer);
    this.filterText = '';
    this.getInvitations(1);
  }

  getInvitations(page: number){
    //console.log("this.rowsPerPage: " + this.rowsPerPage);
    this.usersService.getInvitations(this.listParams(page, this.rowsPerPage)).subscribe(
    {
      next: (invitations: AccountInviteList) => {
        console.dir(invitations);
        this.loading = false;
        this.current_page = page;
        this.invitations = invitations.data;
        this.paginator.pages = invitations.meta.total_pages;
        this.paginator.current_page = invitations.meta.page;
        this.totalRecords = invitations.meta.total_records;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  open_invite_form(){
    this.invite_user_form_dialog.open();
  }  
}
