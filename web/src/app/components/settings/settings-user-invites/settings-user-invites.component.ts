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
import { AccountInviteList, AccountInviteListItem } from '../../../../types';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-settings-user-invites',
  standalone: true,
  imports: [UserTabsComponent, PageLoadingComponent, FaIconComponent, DateStrPipe, PaginatorComponent, NgIf, NgFor, RouterLink, DecimalPipe, SettingsUserInviteFormComponent],
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

  getInvitations(page: number){
    //console.log("this.rowsPerPage: " + this.rowsPerPage);
    this.usersService.getInvitations({ page: page, perPage:this.rowsPerPage }).subscribe(
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
