import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UnsavedChangesDialogComponent } from "../../common/unsaved-changes-dialog/unsaved-changes-dialog.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ImageCropComponent } from "../../common/image-cropper/image-crop.component";
import { LoginsTableComponent } from "../../users/logins-table/logins-table.component";
import { CustomersTableComponent } from "../../customers/customers-table/customers-table.component";
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { environment } from '../../../../environments/environment';
import { faAddressCard, faSave, faArrowsRotate, faTriangleExclamation, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { nameIdPair, UserDetails } from '../../../../types';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { firstValueFrom, Observable } from 'rxjs';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { ActivePage, UserTabsComponent } from "../user-tabs/user-tabs.component";
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";
import { CustomerPickerComponent } from "../../customers/customer-picker/customer-picker.component";
import { PromptDialogComponent } from "../../common/prompt-dialog/prompt-dialog.component";
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-settings-user-details',
  standalone: true,
  imports: [UnsavedChangesDialogComponent, FaIconComponent, PageLoadingComponent, DateStrPipe, TitleCasePipe, FormsModule, NgFor, NgIf, ImageCropComponent, LoginsTableComponent, CustomersTableComponent, UserTabsComponent, ModalDialogComponent, NgSelectModule, CustomerPickerComponent, PromptDialogComponent, ConfirmationDialogComponent],
  templateUrl: './settings-user-details.component.html',
  styleUrl: './settings-user-details.component.scss'
})
export class SettingsUserDetailsComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit , HasUnsavedChanges  {

  @ViewChild('profile_form') profile_form!: NgForm;
  @ViewChild('profile_photo') profile_photo!: ImageCropComponent;
  @ViewChild('mail_verification_notice') mail_verification_notice!: ModalDialogComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog! :UnsavedChangesDialogComponent;
  @ViewChild('confirm_delete_dialog') confirm_delete_dialog!: ConfirmationDialogComponent;
  @ViewChild('role_select') role_select! :NgSelectComponent;

  environment = environment;
  ActivePage = ActivePage;
  original_email: string = "";
  pending_email: string = "";
  current_email: string = "";

  faAddressCard: IconDefinition = faAddressCard;
  faTrash: IconDefinition = faTrash;
  faSave: IconDefinition = faSave;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faArrowLeft: IconDefinition = faArrowLeft;

  saving: boolean = false;
  loading: boolean = false;
  sending_account_verification: boolean = false;
  isCustomer: boolean = false;
  isThisYou: boolean = false;
  roles:nameIdPair[] = [];
  selectedRoleId: number | null = null;
  unsaved_changes: boolean = false;

  user: UserDetails = {
    is_verified: false, is_disabled: false, pending_new_email: '',
    phone: '', registered_on: new Date(), id: 0, firstname: '', lastname: '',
    username: '', email: '', photo_url: '', roles: [], customers: [],
    area_permissions: []
  };

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    toastService: ToastService,
    stateService: StateService,
    router: Router,
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService){
    super(toastService, stateService, router);
  }

  async ngOnInit() {
    const roles = await firstValueFrom(this.usersService.getRoles());
    this.roles = roles;

    if(this.activatedRoute.snapshot.queryParamMap.has('id')) {
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.usersService.user$.subscribe({ next: (loggedInUser)=> { 
        if(loggedInUser && loggedInUser.id == id) { this.isThisYou = true; }
        this.loadUserDetails(id);
      } });
    }
  }

  ngAfterViewInit(): void {
   // throw new Error('Method not implemented.');
  }

  loadUserDetails(id: number){
    this.loading = true;
    this.usersService.getUser(id).subscribe({
      next: (user: UserDetails) => {
        console.dir(user);
        this.user = user;
        this.original_email = user.email;
        this.pending_email = user.pending_new_email;
        this.current_email = (this.pending_email)? this.pending_email : this.original_email;
        this.isCustomer = user.roles.find(r => r.name.toLowerCase()=="customer") != undefined;
        this.selectedRoleId = this.user.roles?.[0]?.id ?? null;
        this.loading = false;
        this.unsaved_changes = false;
      },
      error: (error: any) => {
        this.toastService.showError(error.error.message);
        this.loading = false;
      }
    });
  }
  
  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () =>
        { return (!this.profile_form.pristine || this.unsaved_changes); },

      saveFn: () => this.usersService.save(this.user, this.profile_photo.croppedImageBlob),

      confirmationDialog: this.unsaved_changes_dialog
    });
  }
  
  
    role_selected(role: nameIdPair){
      if(role) {
        this.user.roles = [ role ];
      }
      else {
        this.user.roles = [];
      }
      this.unsaved_changes = true;
    }

  email_changed(){
    if(this.current_email == this.original_email){
      this.pending_email = '';
    }
    else {
      this.unsaved_changes = true;
    }
  }

  revert_email(){
    this.current_email = this.original_email;
    this.pending_email = "";
    this.mail_verification_notice.onCancel();
    this.unsaved_changes = true;
  }

  open_mail_verification_dialog(){
    this.mail_verification_notice.open();
  }

  send_change_email_verificationl(){
    this.usersService.sendChangedEmailConfirmationCode(this.current_email).subscribe({
      next: (something) => {
        //console.dir(something);
        this.toastService.showSuccess("Verification email sent");
      },
      error: (error) => {
        //console.dir(error);
        this.toastService.showError("Error sending verification");
      }
    });
    this.mail_verification_notice.onCancel();
  }

  send_account_verification(){
    this.sending_account_verification = true;
    this.usersService.sendUserAccountVerificationCode(this.current_email).subscribe({
      next: (something) => {
        console.dir(something);
        this.toastService.showSuccess("Account verification email sent");
        this.sending_account_verification = false;
      },
      error: (error) => {
        console.dir(error);
        this.toastService.showError(error.error.message);
        this.sending_account_verification = false;
      }
    });    
  }

  photo_cleared() {
    this.user.photo_url='';
    this.unsaved_changes = true;
  }

  photo_loaded() {
    //clear the URL, so that the new file will replace it
    this.user.photo_url='';
    this.unsaved_changes = true;
  }

  changed_customers(){
    this.unsaved_changes = true;
  }

  send_password_reset(){
    this.usersService.userForgotPassword(this.user.email).subscribe({
      next: () => {
        this.toastService.showSuccess("Password reset link sent");
      },
      error: (error: any) => {
        this.toastService.showError("Failed to send: " + error.error.message);
      }
    }
    );
  }

  confirm_deletion(){
    this.confirm_delete_dialog.modalText = this.isThisYou? 
      'Are you sure you want to delete <span class="text-danger"><strong>YOUR OWN ACCOUNT</strong></span>?' : 
      'Are you sure you want to delete this user?';
    this.confirm_delete_dialog.btnYesText = this.isThisYou? 
      'Delete me!' : 
      'Delete user';
    this.confirm_delete_dialog.open();
  }

  delete_user(){
    this.usersService.delete(this.user.id).subscribe({
      next: (value: any) => {
        this.navigateWithToastMessage("settings/users", "User deleted", false);
      },
      error: (error: any) => {
        this.toastService.showError("Failed to delete: " + error.error.message);
      }
    });
    
  }

  save() {
    if(this.profile_form.form.valid) {
      this.profile_form.form.markAsPristine();
      console.dir(this.user);
      this.saving = true;
      this.user.email = this.current_email;
      this.usersService.save(this.user, this.profile_photo.croppedImageBlob).subscribe({
        next: (value: any) => {
          this.unsaved_changes = false;
          this.navigateWithToastMessage("settings/users", "Saved successfully", false);
          //this.toastService.showSuccess("succcc");
          this.saving = false;
        },
        error: (error: any) => {
          this.toastService.showError(error.error.message);
          this.saving = false;
        }
      });
    }
  }
}
