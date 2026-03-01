import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowLeft, faBasketShopping, faCheck, faTrash, faTriangleExclamation, faUser, faUserPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountRequestDetails, nameIdPair } from '../../../../types';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { NgIf, NgForOf } from '@angular/common';
import { CustomerPickerComponent } from "../../customers/customer-picker/customer-picker.component";
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { environment } from '../../../../environments/environment';
import { UserTagComponent } from "../user-tag/user-tag.component";
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { StateService } from '../../../services/state.service';
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";

@Component({
  selector: 'app-account-request-details',
  standalone: true,
  imports: [
    FaIconComponent, DateStrPipe, NgIf, CustomerPickerComponent, FormsModule, NgSelectModule, ConfirmationDialogComponent,
    NgForOf, UserTagComponent, RouterLink,
    ModalDialogComponent
],
  templateUrl: './account-request-details.component.html',
  styleUrl: './account-request-details.component.scss'
})
export class AccountRequestDetailsComponent extends NavigatedMessageComponent implements OnInit {
  faUserPlus: IconDefinition = faUserPlus;
  faX: IconDefinition = faX;
  faCheck: IconDefinition = faCheck;
  faTrash: IconDefinition = faTrash;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faUser: IconDefinition = faUser;
  faArrowLeft: IconDefinition = faArrowLeft;
  faBasketShopping: IconDefinition = faBasketShopping;
  loading: boolean = false;
  approval_instructions: string = "";
  approve_btn_disabled = true;
  @ViewChild("customer_picker") customer_picker!: CustomerPickerComponent;
  @ViewChild("chkCreateNewCustoemr") chkCreateNewCustoemr!: ElementRef;
  @ViewChild("confirm_approval_dialog") confirm_approval_dialog! :ConfirmationDialogComponent;
  @ViewChild("confirm_deletion_dialog") confirm_deletion_dialog! :ConfirmationDialogComponent;
  @ViewChild("error_dialog") error_dialog! :ConfirmationDialogComponent;

  //selectedCustomerIDs: number [] = [];
  request: AccountRequestDetails = {
    // details of this request
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    details: '',
    request_date: new Date(),
    request_status: '',

    //approval details
    last_update: new Date(),
    approver_user_id: 0,
    approver_firstname: '',
    approver_lastnme: '',
    approver_photo_url: '',

    //approved account details
    approved_account_user_id: 0,
    user_firstname: '',
    user_lastname: '',
    user_photo_url: '',
    role: { name: '', id: 0 },
    customers: [],
    create_new_customer: false
  };
  environment = environment;

  roles: nameIdPair[] = [];

  constructor(
    private usersService: UsersService, 
    toastService: ToastService, 
    private activatedRoute: ActivatedRoute,
    router: Router,
    stateService: StateService) {
    super(toastService, stateService, router)
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
      this.getAccountRequestDetails(id);
    }
  }

  getAccountRequestDetails(id: number) {
    this.loading = true;
    this.usersService.getAccountRequestDetails(id).subscribe({
      next: (req: AccountRequestDetails) => {
        this.request = req;
        console.dir(req);
        this.loading = false;
        this.set_instructions_and_approval_btn_status();
      },
      error: (error: any) => {
        this.toastService.showError(error.error.message);
        this.error_dialog.modalText = `An error has occurred fetching this request:<br/>${error.error.message}`;
        this.error_dialog.open();
        this.loading = false;
      }
    });
  }

  role_selected(role: nameIdPair){
    if(role) {
      this.request.role = role;
    }
    else {
      this.request.role = { id:0, name: '' };
    }
    this.set_instructions_and_approval_btn_status();
  }

  set_instructions_and_approval_btn_status(){
    console.log("selected role: "); console.dir(this.request.role);
    this.approval_instructions = "";
    this.approve_btn_disabled = false;
    if(!this.request || !this.request.role || this.request.role.id <= 0){
      this.approval_instructions = "To approve this request, please select the role of this user.";
      this.approve_btn_disabled = true;
    }
    else {
      if(this.request.role.name.toLowerCase() == 'customer' && this.request.customers && this.request.customers.length == 0 && this.chkCreateNewCustoemr && this.chkCreateNewCustoemr.nativeElement && !this.chkCreateNewCustoemr.nativeElement.checked) {
        this.approval_instructions = "To approve this request as a customer, please select which customers to connect this user to, or check the option to create a new customer for them.";
        this.approve_btn_disabled = true;
      }
    }
  }

  confirm_approval(){
    let role_name = (['a','e','i','o','u'].indexOf(this.request.role.name.toLowerCase()[0]) == 0)? "an" : "a";
    if(this.request.role.name.toLowerCase() == 'administrator'){
      role_name += `<span class='text-danger'> ${this.request.role.name.toLowerCase()}<span>`;
      this.confirm_approval_dialog.dialogIcon = faTriangleExclamation;
      this.confirm_approval_dialog.dialogIconClass = "text-warning";
    }
    else {
      role_name += ` ${this.request.role.name.toLowerCase()}`;
      this.confirm_approval_dialog.dialogIcon = faUser;
      this.confirm_approval_dialog.dialogIconClass = "";
    }
    this.confirm_approval_dialog.modalText = `Are you sure you want to confirm this request for this user as ${role_name}?`;
    this.confirm_approval_dialog.open();
  }

  confirm_approval_confirmed() {
    this.usersService.approveAccountRequest(this.request).subscribe({
      next: (result: any) => { this.toastService.showSuccess(result); console.dir(result); },
      error: (error: any) => { this.toastService.showError(error); console.dir(error); }
    });
  }

  go_to_orders(customer_id: number, customer_name: string){    
    this.router.navigate(['/inventory/customer/orders'], {
      queryParams: {
        customer_id: customer_id
      },
      state: {
        info: {
          customer_name: customer_name,
          back_to_link: '/inventory/customers',
          back_to_text: 'Back to customers list'
        }
      },
    });
  }

  deleteRequest(){
    this.confirm_approval_dialog.modalText = `Are you sure you want to delete this request?`;
    this.confirm_deletion_dialog.open();
  }

  delete_request_confirmed() {
    this.usersService.deleteAccountRequest(this.request.id).subscribe({
      next: (response: boolean) => {
        this.navigateWithToastMessage('users/account_requests', 'Request deleted successfully', false);
      },
      error: (err: any) => {
        this.toastService.showError(err.error["message"]);
      }
    });
  }

  go_to_account_requests(){
    this.router.navigate(['users/account_requests']);
  }
}
