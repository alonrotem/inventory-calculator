import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { LoginInfo } from '../../../../types';
import { NgFor, NgIf } from '@angular/common';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { SafePipe } from "../../../utils/pipes/safe.pipe";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowsRotate, faBan } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-logins-table',
  standalone: true,
  imports: [NgIf, NgFor, PageLoadingComponent, DateStrPipe, SafePipe, FaIconComponent, ConfirmationDialogComponent],
  templateUrl: './logins-table.component.html',
  styleUrl: './logins-table.component.scss'
})
export class LoginsTableComponent implements OnInit, AfterViewInit, OnChanges {
  user_logins: LoginInfo[] = [];
  fetching: boolean = true;
  clearning: boolean = false;
  faBan: IconDefinition = faBan;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  pending_clear_login_ids: number[] = [];
  number_of_external_logins = 0;
  logged_into_this_device: boolean = false;
  @Input() user_id: number = 0; //OPTIONAL
  @ViewChild("clear_logins_confirm") clear_logins_confirm!: ConfirmationDialogComponent;
  @ViewChild("clear_single_login_confirm") clear_single_login_confirm!: ConfirmationDialogComponent;

  constructor(private usersService: UsersService, private toastService: ToastService){
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getUserLogins();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user_id'] && changes['user_id'].currentValue != changes['user_id'].previousValue && changes['user_id'].currentValue > 0) {
      this.getUserLogins();
    }
  }  

  getUserLogins(){
    this.fetching = true;
    this.user_logins = [];
    this.usersService.get_logins(this.user_id).subscribe({
      next: (logins: LoginInfo[]) => {
        this.user_logins = logins;
        this.number_of_external_logins = logins.filter(l => !(l.is_current_login)).length;
        this.logged_into_this_device = logins.findIndex(l => l.is_current_login) >= 0;
        this.clear_logins_confirm.modalText = "<div class='text-warning'>This will log out from all devices" + (this.logged_into_this_device?", except this one":"") + ".</div>Are you sure?"
        this.fetching = false;
      },
      error: (error: any) => {
        this.toastService.showError(error.error.message);
        this.fetching = false;
      }
    });
  }

  clearAllLogins(){
    this.pending_clear_login_ids = this.user_logins.map(login => login.id);
    this.clear_logins_confirm.open();
  }

  clear_login(id:number) {
    this.pending_clear_login_ids = [id];
    this.clear_single_login_confirm.open();
  }

  clearLogins_confirmed(){
    this.clearning = true;
    this.user_logins = [];
    this.usersService.clear_logins( this.pending_clear_login_ids ).subscribe({
      next: (logins: LoginInfo[]) => {
        this.user_logins = logins;
        this.toastService.showSuccess("Logins cleared");
        this.pending_clear_login_ids = [];
        this.number_of_external_logins = logins.filter(l => !(l.is_current_login)).length;
        this.clearning = false;
      },
      error: (error: any) => {
        this.toastService.showError(error.error.message);
        this.pending_clear_login_ids = [];
        this.clearning = false;
      }
    });
  }
}
