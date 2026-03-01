import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivePage, UserTabsComponent } from "../user-tabs/user-tabs.component";
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { UsersService } from '../../../services/users.service';
import { SettingsService } from '../../../services/settings.service';
import { Router, RouterLink } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { ToastService } from '../../../services/toast.service';
import { UserListItem, UsersList } from '../../../../types';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings-users',
  standalone: true,
  imports: [UserTabsComponent, PageLoadingComponent, DecimalPipe, NgFor, NgIf, RouterLink, PaginatorComponent, DateStrPipe, FaIconComponent],
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
  @ViewChild("paginator") paginator!: PaginatorComponent;

  constructor(
    private usersService: UsersService, 
    private settingsService: SettingsService, 
    router: Router, 
    stateService: StateService,
    toastService: ToastService
    ) {
      super(toastService, stateService, router);
      this.showNavigationToastIfMessagePending();
  }

  async ngOnInit() {
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.getUsers(1);
    history.replaceState({}, location.href);    
  }

  pageChange (page: number) {
    this.getUsers(page);
  }

  getUsers(page: number){
    //console.log("this.rowsPerPage: " + this.rowsPerPage);
    this.usersService.getUsers({ page: page, perPage:this.rowsPerPage }).subscribe(
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
}
