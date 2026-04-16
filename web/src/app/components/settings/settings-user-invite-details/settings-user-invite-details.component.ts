import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBasketShopping, faCheck, faEnvelopeCircleCheck, faTrash, faTriangleExclamation, faUserPlus, faX } from '@fortawesome/free-solid-svg-icons';
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

@Component({
  selector: 'app-settings-user-invite-details',
  standalone: true,
  imports: [FaIconComponent, DateStrPipe, NgSelectModule, CustomerPickerComponent, NgIf, FormsModule, UserTagComponent, RouterModule, NgFor],
  templateUrl: './settings-user-invite-details.component.html',
  styleUrl: './settings-user-invite-details.component.scss'
})
export class SettingsUserInviteDetailsComponent extends NavigatedMessageComponent implements OnInit {
  faUserPlus: IconDefinition = faUserPlus;
  faCheck: IconDefinition = faCheck;
  faX: IconDefinition = faX;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faBasketShopping: IconDefinition = faBasketShopping;
  faEnvelopeCircleCheck: IconDefinition = faEnvelopeCircleCheck;
  roles: nameIdPair[] = [];
  faTrash: IconDefinition = faTrash;
  approval_instructions: string = "";
  approve_btn_disabled = true;
  invitation: AccountInviteDetails = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    created_account_user_id: 0,
    role: null,
    invite_status: AccountInviteStatus.sent,
    is_demo_customer: false,
    create_new_customer: false,
    customers: [],
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
      //this.getAccountRequestDetails(id);
    }
  }

  getInvitaionDetails(id: number) {
      this.usersService.getInvitationDetails(id).subscribe({
        next: (details: AccountInviteDetails) => {
          this.invitation = details;
          this.set_instructions_and_approval_btn_status();
        },
        error: (error:any) => { console.log("Error fetching account request details: " + error) }
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
}
