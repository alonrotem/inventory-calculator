import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { SaveChangesButtonComponent } from "../../common/save-changes-button/save-changes-button.component";
import { TranslatePipe, TranslateEnumPipe } from '../../../i18n/translate.pipe';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-settings-user-invite-details',
  standalone: true,
  imports: [TranslatePipe, TranslateEnumPipe, FaIconComponent, DateStrPipe, NgSelectModule, CustomerPickerComponent, NgIf, FormsModule, UserTagComponent, RouterModule, NgFor, ConfirmationDialogComponent, PageLoadingComponent, SaveChangesButtonComponent],
  templateUrl: './settings-user-invite-details.component.html',
  styleUrl: './settings-user-invite-details.component.scss'
})
export class SettingsUserInviteDetailsComponent extends NavigatedMessageComponent implements OnInit {
  private translation = inject(TranslationService);

  @ViewChild('confirm_action') confirm_action_dialog!: ConfirmationDialogComponent;
  //@ViewChild('confirm_delete_dialog') confirm_delete_dialog!: ConfirmationDialogComponent;
  //@ViewChild('confirm_cancel_dialog') confirm_cancel_dialog!: ConfirmationDialogComponent;
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
  customers_changed: boolean = false;
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
        //this.set_instructions_and_approval_btn_status();
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
    this.customers_updated();
  }

  customers_updated(){
    this.customers_changed = true;
    /*
    console.log("selected role: "); console.dir(this.invitation.role);
    this.approval_instructions = "";
    this.approve_btn_disabled = false;
    if(!this.invitation || !this.invitation.role || this.invitation.role.id <= 0){
      this.approval_instructions = this.translation.t('users:invite.approval_role');
      this.approve_btn_disabled = true;
    }
    else {
      if(this.invitation.role.name.toLowerCase() == 'customer' && this.invitation.customers && this.invitation.customers.length == 0 && this.chkCreateNewCustoemr && this.chkCreateNewCustoemr.nativeElement && !this.chkCreateNewCustoemr.nativeElement.checked) {
        this.approval_instructions = this.translation.t('users:invite.approval_customer');
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
        this.toastService.showSuccess(this.translation.t('users:invite.resent'));
        this.sending = false;
      }, 
      error: (error: any) => {
        console.log("Error resending invitation: " + error.error?.message);
        this.toastService.showError(this.translation.t('users:invite.resend_failed'));
        this.sending = false;
      }
    });
  }

  async delete_invitation(){
    const confirmed = await this.confirm_action_dialog.open_with_message({
      modalTitle: this.translation.t('users:invite.delete_title'),
      modalText: this.translation.t('users:invite.delete_text'),
      btnYesClass: 'btn-danger',
      btnYesText: this.translation.t('users:invite.delete_yes'),
      btnYesIcon: this.faTrash,
      btnNoText: this.translation.t('common:actions.cancel')
    });
    if(confirmed){
      this.usersService.deleteInvitation(this.invitation.id).subscribe({
        next: (response: any) => {
          this.navigateWithToastMessage('/settings/user_invites', this.translation.t('users:invite.deleted'));
          //this.router.navigate(['/settings/user_invites']);
        },
        error: (error: any) => {
          console.log("Error deleting invitation: " + error.error?.message);
          this.toastService.showError(this.translation.t('users:invite.delete_failed'));
        }
      });
    }
  }

  async cancel_invitation(){
/*
<app-confirmation-dialog
  #confirm_cancel_dialog
  [modalTitle]="'Cancel invitation?'"
  [modalText]="'Are you sure you want to cancel this invitation?'"
  [btnYesClass]="'btn-warning'"
  [btnYesText]="'Cancel Invitation!'"
  [btnYesIcon]="faX"
  [btnNoText]="'Keep Invitation'"
  (confirm)="cancel_invitation_confirmed()" 
  />
*/    
    const confirmed = await this.confirm_action_dialog.open_with_message({
      modalTitle: this.translation.t('users:invite.cancel_title'),
      modalText: this.translation.t('users:invite.cancel_text'),
      btnYesClass: 'btn-warning',
      btnYesText: this.translation.t('users:invite.cancel_yes'),
      btnYesIcon: this.faX,
      btnNoText: this.translation.t('users:invite.cancel_no')
    });
    if(confirmed){
      this.usersService.cancelInvitation(this.invitation.id).subscribe({
        next: (response: any) => {
          //this.navigateWithToastMessage('/settings/user_invites', this.translation.t('users:invite.cancelled'));
          this.reloadTheSamePageWithToastMessage(this.translation.t('users:invite.cancelled'));
          this.getInvitaionDetails(this.invitation.id);
        },
        error: (error: any) => {
          console.log("Error cancelling invitation: " + error.error?.message);
          this.toastService.showError(this.translation.t('users:invite.cancel_failed'));
        }
      });
    }
  }

  save_changes(navigate_after_save: boolean = true){
    this.saving = true;
    this.usersService.updateInvitation(this.invitation).subscribe({
      next: (response: any) => {
        //this.toastService.showSuccess(this.translation.t('users:invite.updated'));
        if(navigate_after_save){
          this.navigateWithToastMessage('/settings/user_invites', this.translation.t('users:invite.updated'));
        }
        else {
          this.reloadTheSamePageWithToastMessage("Saved successfully", false);
        }        
        this.saving = false;
      },
      error: (error: any) => {
        console.log("Error updating invitation: " + error.error?.message);
        this.toastService.showError(this.translation.t('users:invite.update_failed'));
        this.saving = false;
      }
    });

  }
}
