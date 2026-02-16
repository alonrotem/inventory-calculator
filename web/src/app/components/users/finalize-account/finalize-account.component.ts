import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { UsersService } from '../../../services/users.service';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { UnsavedChangesDialogComponent } from "../../common/unsaved-changes-dialog/unsaved-changes-dialog.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { JsonPipe, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { ImageCropComponent } from "../../common/image-cropper/image-crop.component";
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faAddressCard, faArrowsRotate, faSave } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import { UpdateProfile, UserProfile } from '../../../../types';
import { MapPipe } from '../../../utils/pipes/map-pipe';
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";

@Component({
  selector: 'app-finalize-account',
  standalone: true,
  imports: [PageLoadingComponent, UnsavedChangesDialogComponent, FaIconComponent, NgIf, FormsModule, DateStrPipe, ImageCropComponent, MapPipe, ModalDialogComponent],
  templateUrl: './finalize-account.component.html',
  styleUrl: './finalize-account.component.scss'
})
export class FinalizeAccountComponent {

  user_verification_code: string = "";
  loading: boolean = true;
  saving: boolean = false;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faSave: IconDefinition = faSave;
  faAddressCard: IconDefinition = faAddressCard;
  environment = environment;
  user: UserProfile = {
    pending_new_email: '',
    phone: '',
    registered_on: new Date(),
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    photo_url: '',
    roles: [],
    customers: [],
    area_permissions: []
  };

  password_change = {
    new_password: '',
    repeat_new_password: ''
  };

  password_change_errors = {
    new_password: '',
    repeat_new_password: ''
  }
  @ViewChild('profile_form') profile_form!: NgForm;
  @ViewChild('profile_photo') profile_photo!: ImageCropComponent;
  @ViewChild('invalid_code_dialog') invalid_code_dialog!: ModalDialogComponent;


  constructor(private route: ActivatedRoute, private router: Router, private usersService: UsersService, private toastService: ToastService) {
    this.route.queryParams.subscribe(params => {
        if(params["code"]) {
          this.user_verification_code = params['code'];
        }
        if(this.user_verification_code) {
          this.get_details();
        }
    });
  }

  photo_cleared() {
    this.user.photo_url='';
  }

  photo_loaded() {
    //clear the URL, so that the new file will replace it
    this.user.photo_url='';
  }

  get_details(){
    this.loading = true;
    this.usersService.getProfile_by_code(this.user_verification_code).subscribe({
      next: (user: UserProfile) => {
        this.user = user;
        this.user.username = "";
        this.loading = false;
      },
      error: (error: any) => {
        this.toastService.showError(error.error.message);
        if(error.error.message.toLowerCase().indexOf("invalid user code") >= 0){
          this.invalid_code_dialog.open();
        }
        this.loading = false;
      }
    });
  }

  save(){
    //this.error = "";
    this.profile_form.form.markAllAsTouched();
    console.dir("Valid: " + this.profile_form.form.valid);
    const password_valid = this.checkPasswords();
    console.dir("password_valid: " + password_valid);
    if(this.profile_form.form.valid && password_valid) {
      this.saving = true;
      let updatedInfo: UpdateProfile = {
        id: this.user.id,
        username: this.user.username,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        phone: this.user.phone,
        password: this.password_change.new_password,
        new_password: this.password_change.new_password,
        photo_url: this.user.photo_url,
      };
      this.usersService.saveProfile_by_code(updatedInfo, this.profile_photo.croppedImageBlob, this.user_verification_code).subscribe({
        next: (profileInfo: UserProfile)=>{
          this.toastService.showSuccess("Profile saved successfully!");
          this.saving = false;

          //update the user data across the app (user menu)
          let currentUserData = this.usersService.currentUserValue;
          if(currentUserData){
            currentUserData.firstname = profileInfo.firstname;
            currentUserData.lastname = profileInfo.lastname;
            currentUserData.photo_url = profileInfo.photo_url;
            currentUserData.email = profileInfo.email;
          }
          this.usersService.setUser(currentUserData);
        },
        error: (error)=>{
          this.toastService.showError(error.error.message);
          this.saving = false;
        }
      });
    }
    else {
      alert("invalid");
    }
  }

  gotoHome(){
    this.router.navigateByUrl("/");
  }

  checkPasswords(){
    this.password_change_errors.new_password = '';
    this.password_change_errors.repeat_new_password = '';
    let error = false;

    if(!this.password_change.new_password) {
      this.password_change_errors.new_password = 'Password is required';
      error = true;
    }

    if(!this.password_change.repeat_new_password) {
      this.password_change_errors.repeat_new_password = 'Password confirmation required';
      error = true;
    }

    //...but filled the new password confirmation wrong
    if(
      this.password_change.new_password && 
      this.password_change.repeat_new_password && 
      this.password_change.new_password != this.password_change.repeat_new_password) {
      this.password_change_errors.repeat_new_password = 'Passwords do not match';
      error = true;
    }
    return !error;    
  }
}
