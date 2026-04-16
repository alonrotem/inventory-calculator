import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountInviteDetails, AccountInviteStatus, nameIdPair } from '../../../../types';
import { NgIf } from '@angular/common';
import { NgSelectModule } from "@ng-select/ng-select";
import { UsersService } from '../../../services/users.service';
import { faArrowsRotate, faEnvelopeCircleCheck, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CustomerPickerComponent } from "../../customers/customer-picker/customer-picker.component";
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-settings-user-invite-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgSelectModule, FaIconComponent, CustomerPickerComponent, ModalDialogComponent],
  templateUrl: './settings-user-invite-form.component.html',
  styleUrl: './settings-user-invite-form.component.scss'
})
export class SettingsUserInviteFormComponent {

  invitation: AccountInviteDetails = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    created_account_user_id: 0,
    role: null,
    invite_status: AccountInviteStatus.sent,
    is_demo_customer: false,
    customers: [],
    create_new_customer: false,
    sent_date: new Date(),
    last_update: new Date(),
    approver_firstname: '',
    approver_lastnme: '',
    approver_user_id: 0,
    approver_photo_url: '',
    user_firstname: '',
    user_lastname: '',
    approved_account_user_id: 0,
    user_photo_url: ''
  };
  @ViewChild('invite_user_form_dialog') invite_user_form_dialog!: ModalDialogComponent;
  @ViewChild('account_invite_form') account_invite_form!: NgForm;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faEnvelopeCircleCheck: IconDefinition = faEnvelopeCircleCheck;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  roles: nameIdPair[] = [];
  sending: boolean = false;
  error_message: string = "";

  constructor(private usersService: UsersService, private toastService: ToastService) {
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

  open(){
    this.invite_user_form_dialog.open();
  }

  send_invite(){
    this.sending = true;
    this.error_message = "";
    this.usersService.sendInvitationForNewAccount(this.invitation).subscribe({
      next: (response: any) => {
        //this.invite_user_form_dialog.close();
        this.reset();
        this.invite_user_form_dialog.onCancel();
        this.toastService.showSuccess("Invitation sent successfully!");
        this.sending = false;
      }, 
      error: (error: any) => {
        this.error_message = error.error?.message || "Failed to send invitation. Please try again.";
        console.log("Error sending invitation: " + error.error?.message);
        this.toastService.showError("Failed to send invitation. Please try again.");
        this.sending = false;
      }
    });
  }

  canCloseAccountInvite = (): boolean => {
    if(this.isValid()){
      this.send_invite();
    }
    return false;
    //return this.isValid();
  };

  reset(){
    this.invitation = {
      id: 0,
      firstname: '',
      lastname: '',
      email: '',
      created_account_user_id: 0,
      role: null,
      invite_status: AccountInviteStatus.sent,
      is_demo_customer: false,
      customers: [],
      create_new_customer: false,
      sent_date: new Date(),
      last_update: new Date(),
      approver_firstname: '',
      approver_lastnme: '',
      approver_user_id: 0,
      approver_photo_url: '',
      user_firstname: '',
      user_lastname: '',
      approved_account_user_id: 0,
      user_photo_url: ''
    };
    this.account_invite_form.form.markAsUntouched();
    this.account_invite_form.form.markAsPristine();
    this.error_message = "";
  }

  isValid(){
    this.account_invite_form.form.markAllAsTouched();
    return this.account_invite_form.form.valid;
  }

  get_data(){
    if(this.isValid()) {
      return this.invitation;
    }
    throw new Error("Invalid details!");
  }

  role_selected(role: nameIdPair){
    if (role) {
      this.invitation.role = role;
    } else {
      this.invitation.role = null;
    }
    this.set_instructions_and_approval_btn_status();
  }
  
  set_instructions_and_approval_btn_status(){}
}
