import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faSave } from '@fortawesome/free-regular-svg-icons';
import { BasicUserInfoStatus, UpdateProfile, UserProfile } from '../../../../types';
import { ImageCropComponent } from '../../common/image-cropper/image-crop.component';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { PageLoadingComponent } from '../../common/page-loading/page-loading.component';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { faArrowsRotate, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";
import { UnsavedChangesDialogComponent } from "../../common/unsaved-changes-dialog/unsaved-changes-dialog.component";
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { Observable, of } from 'rxjs';
import { LoginsTableComponent } from "../logins-table/logins-table.component";
import { CustomersTableComponent } from "../../customers/customers-table/customers-table.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FaIconComponent, FormsModule, ImageCropComponent, DateStrPipe, FormsModule,
    PageLoadingComponent, NgIf, ModalDialogComponent, UnsavedChangesDialogComponent, LoginsTableComponent,
    NgFor, TitleCasePipe,
    CustomersTableComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  faAddressCard: IconDefinition = faAddressCard;
  faSave: IconDefinition = faSave;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  environment = environment;
  user: UserProfile = {
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    photo_url: '',
    pending_new_email: '',
    phone: '',
    registered_on: new Date(),
    roles: [],
    customers: [],
    area_permissions: []
  }
  isCustomer: boolean = false;
  password_change = {
    current_password: '',
    new_password: '',
    repeat_new_password: ''
  };

  password_change_errors = {
    current_password: '',
    new_password: '',
    repeat_new_password: ''
  }

  loading: boolean = true;
  saving: boolean = false;
  @ViewChild('profile_form') profile_form!: NgForm;
  @ViewChild('profile_photo') profile_photo!: ImageCropComponent;
  @ViewChild('mail_verification_notice') mail_verification_notice!: ModalDialogComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;
  original_email: string = "";
  pending_email: string = "";
  current_email: string = "";

  constructor(
    private usersService: UsersService, 
    private toastService: ToastService,
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService){
    this.loading = true;
  }

  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () =>
        (!this.profile_form.pristine),

      saveFn: () => of(this.save()),

      confirmationDialog: this.unsaved_changes_dialog
    });
  }

  ngOnInit(): void {
    this.isCustomer = false;
    this.loading = true;
    this.usersService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.user = profile;
        this.original_email = profile.email;
        this.pending_email = profile.pending_new_email;
        this.current_email = (this.pending_email)? this.pending_email : this.original_email;
        this.isCustomer = profile.roles.find(r => r.name.toLowerCase()=="customer") != undefined;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showError("Error loading profile data");
        console.log(err);
        this.loading = false;
      }
    });
  }

  checkPasswords(){
    this.password_change_errors.current_password = '';
    this.password_change_errors.new_password = '';
    this.password_change_errors.repeat_new_password = '';
    let error = false;
    //the user filled a new password...
    if(this.password_change.new_password){
      //...without filling the current password
      if(!this.password_change.current_password){
        this.password_change_errors.current_password = 'Current pass is required';
        error = true;
      }
      //...without filling the new password confirmation
      if(!this.password_change.repeat_new_password) {
        this.password_change_errors.repeat_new_password = 'Password confirmation required';
        error = true;
      }
      else {
        //...but filled the new password confirmation wrong
        if(this.password_change.new_password != this.password_change.repeat_new_password){
          this.password_change_errors.repeat_new_password = 'Passwords do not match';
          error = true;
        }
      }
    }
    //The user filled the password confirmation without filling the new password
    if(this.password_change.repeat_new_password && !this.password_change.new_password){
      this.password_change_errors.new_password = 'New password is required';
    }
    return !error;
  }

  photo_cleared() {
    this.user.photo_url='';
  }

  photo_loaded() {
    //clear the URL, so that the new file will replace it
    this.user.photo_url='';
  }

  /*

  */
  email_changed(){
    if(this.current_email == this.original_email){
      this.pending_email = '';
    }
  }

  revert_email(){
    this.current_email = this.original_email;
    this.pending_email = "";
    this.mail_verification_notice.onCancel();
  }  

  open_mail_verification_dialog(){
    this.mail_verification_notice.open();
  }

  send_verification_mail(){
    this.usersService.sendChangedEmailConfirmationCode(this.current_email).subscribe({
      next: (something) => {
        console.dir(something);
        this.toastService.showSuccess("Verification email sent");
      },
      error: (error) => {
        console.dir(error);
        this.toastService.showError("Error sending verification");
      }
    });
    this.mail_verification_notice.onCancel();
  }

  save(){
    //this.error = "";
    this.profile_form.form.markAllAsTouched();
    if(this.profile_form.form.valid && this.checkPasswords()) {
      this.saving = true;
      let updatedInfo: UpdateProfile = {
        id: this.user.id,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.current_email,
        phone: this.user.phone,
        password: this.password_change.current_password,
        new_password: this.password_change.new_password,
        photo_url: this.user.photo_url
      };
      this.usersService.saveProfile(updatedInfo, this.profile_photo.croppedImageBlob).subscribe({
        next: (profileInfo: UserProfile)=>{
          this.toastService.showSuccess("Profile saved successfully!");
          this.saving = false;
          console.log("email: " + profileInfo.email);
          console.log("pending: " + profileInfo.pending_new_email);
          this.original_email = profileInfo.email;
          this.pending_email = profileInfo.pending_new_email;
          this.current_email = (this.pending_email)? this.pending_email : this.original_email;

          //update the user data across the app (user menu)
          let currentUserData = this.usersService.currentUserValue;
          if(currentUserData){
            currentUserData.firstname = profileInfo.firstname;
            currentUserData.lastname = profileInfo.lastname;
            currentUserData.photo_url = profileInfo.photo_url;
            currentUserData.email = profileInfo.email;
          }
          this.password_change.current_password = "";
          this.password_change.new_password = "";
          this.password_change.repeat_new_password = "";
          this.usersService.setUser(currentUserData);
        },
        error: (error)=>{
          this.toastService.showError(error.error.message);
          this.saving = false;
        }
      });
    }
  }
}
