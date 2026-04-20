import { Component, OnInit, ViewChild } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowLeft, faArrowsRotate, faBasketShopping, faCheck, faEnvelopeCircleCheck, faFlask, faTrash, faTriangleExclamation, faUserPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { AccountInviteDetails, AccountInviteStatus, nameIdPair } from '../../../../types';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { NgSelectModule } from "@ng-select/ng-select";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { ToastService } from '../../../services/toast.service';
import { UsersService } from '../../../services/users.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { CustomerPickerComponent } from "../../customers/customer-picker/customer-picker.component";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserTagComponent } from "../../users/user-tag/user-tag.component";
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";

@Component({
  selector: 'app-settings-user-invite-details',
  standalone: true,
  imports: [FaIconComponent, DateStrPipe, NgSelectModule, CustomerPickerComponent, NgIf, FormsModule, UserTagComponent, RouterModule, NgFor, ConfirmationDialogComponent, PageLoadingComponent],
  templateUrl: './settings-user-invite-details.component.html',
  styleUrl: './settings-user-invite-details.component.scss'
})
export class SettingsUserInviteDetailsComponent extends NavigatedMessageComponent implements OnInit {
  @ViewChild('confirm_delete_dialog') confirm_delete_dialog!: ConfirmationDialogComponent;
  @ViewChild('confirm_cancel_dialog') confirm_cancel_dialog!: ConfirmationDialogComponent;
  faUserPlus: IconDefinition = faUserPlus;
  faCheck: IconDefinition = faCheck;
  faX: IconDefinition = faX;
  faFlask: IconDefinition = faFlask;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faBasketShopping: IconDefinition = faBasketShopping;
  faEnvelopeCircleCheck: IconDefinition = faEnvelopeCircleCheck;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faArrowLeft: IconDefinition = faArrowLeft;
  roles: nameIdPair[] = [];
  faTrash: IconDefinition = faTrash;
  approval_instructions: string = "";
  approve_btn_disabled = true;
  loading: boolean = false;
  sending: boolean = false;
  saving: boolean = false;
  original_email: string = "";
  invitation: AccountInviteDetails = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    role: null,
    invite_status: AccountInviteStatus.sent,
    is_demo_customer: false,
    create_new_customer: false,
    customers: [],
    sent_date: new Date(),
    last_update: new Date(),
    inviter_firstname: '',
    inviter_lastnme: '',
    inviter_user_id: 0,
    inviter_photo_url: '',
    user_firstname: '',
    user_lastname: '',
    created_account_user_id: 0,
    user_photo_url: ''
  }

  constructor(
    private usersService: UsersService, 
    toastService: ToastService, 
    activatedRoute: ActivatedRoute,
    router: Router,
    stateService: StateService) {
    
    super(toastService, stateService, router, activatedRoute);
    this.usersService.getRoles().subscribe({
      next: (r: nameIdPair[]) => { 
        this.roles = r
          //capitlalize
          .map(r => {return { id: r.id, name:  r.name ? r.name.charAt(0).toUpperCase() + r.name.substr(1).toLowerCase() : ''  }})
          //sort
          .sort((r1:nameIdPair, r2:nameIdPair)=>{ return r1.name.localeCompare(r2.name) }) ; 
      },
      error: (error:any) => { console.log("Error fetching roles: " + error) }
    });
  }

  ngOnInit() {
    if(this.activatedRoute.snapshot.queryParamMap.has('id')) {
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getInvitaionDetails(id);
    }
  }

  getInvitaionDetails(id: number) {
    this.loading = true;
    this.usersService.getInvitationDetails(id).subscribe({
      next: (details: AccountInviteDetails) => {
        console.dir(details);
        this.invitation = details;
        this.original_email = details.email;
        this.set_instructions_and_approval_btn_status();
        this.loading = false;
      },
      error: (error:any) => { 
        console.log("Error fetching account request details: " + error);
        this.loading = false;
      }
    });
  }

  role_selected(role: nameIdPair){
    if(role) {
      this.invitation.role = role;
    }
    else {
      this.invitation.role = { id:0, name: '' };
    }
    this.set_instructions_and_approval_btn_status();
  }

  set_instructions_and_approval_btn_status(){
    /*
    console.log("selected role: "); console.dir(this.invitation.role);
    this.approval_instructions = "";
    this.approve_btn_disabled = false;
    if(!this.invitation || !this.invitation.role || this.invitation.role.id <= 0){
      this.approval_instructions = "To approve this request, please select the role of this user.";
      this.approve_btn_disabled = true;
    }
    else {
      if(this.invitation.role.name.toLowerCase() == 'customer' && this.invitation.customers && this.invitation.customers.length == 0 && this.chkCreateNewCustoemr && this.chkCreateNewCustoemr.nativeElement && !this.chkCreateNewCustoemr.nativeElement.checked) {
        this.approval_instructions = "To approve this request as a customer, please select which customers to connect this user to, or check the option to create a new customer for them.";
        this.approve_btn_disabled = true;
      }
    }
  */
  }

  get customerNames(): string {
    return this.invitation.customers.map(c => c.name).join(', ');
  }

  resend_invite(){
    this.sending = true;
    this.usersService.resendInvitation(this.invitation.id).subscribe({
      next: (response: any) => {
        this.toastService.showSuccess("Invitation resent successfully!");
        this.sending = false;
      }, 
      error: (error: any) => {
        console.log("Error resending invitation: " + error.error?.message);
        this.toastService.showError("Failed to resend invitation. Please try again.");
        this.sending = false;
      }
    });
  }

  delete_invitation(){
    this.confirm_delete_dialog.open();
  }

  delete_invitation_confirmed(){
    this.usersService.deleteInvitation(this.invitation.id).subscribe({
      next: (response: any) => {
        this.navigateWithToastMessage('/settings/user_invites', "Invitation deleted successfully!");
        //this.router.navigate(['/settings/user_invites']);
      },
      error: (error: any) => {
        console.log("Error deleting invitation: " + error.error?.message);
        this.toastService.showError("Failed to delete invitation. Please try again.");
      }
    });
  }

  cancel_invitation(){
    this.confirm_cancel_dialog.open();
  }

  cancel_invitation_confirmed(){
    this.usersService.cancelInvitation(this.invitation.id).subscribe({
      next: (response: any) => {
        //this.navigateWithToastMessage('/settings/user_invites', "Invitation cancelled successfully!");
        this.reloadTheSamePageWithToastMessage("Invitation cancelled successfully!");
        this.getInvitaionDetails(this.invitation.id);
      },
      error: (error: any) => {
        console.log("Error cancelling invitation: " + error.error?.message);
        this.toastService.showError("Failed to cancel invitation. Please try again.");
      }
    });
  }

  save_changes(){
    this.saving = true;
    this.usersService.updateInvitation(this.invitation).subscribe({
      next: (response: any) => {
        //this.toastService.showSuccess("Invitation updated successfully!");
        this.navigateWithToastMessage('/settings/user_invites', "Invitation updated successfully!");
        this.saving = false;
      },
      error: (error: any) => {
        console.log("Error updating invitation: " + error.error?.message);
        this.toastService.showError("Failed to update invitation. Please try again.");
        this.saving = false;
      }
    });

  }
}
