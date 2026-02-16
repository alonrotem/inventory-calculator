import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowsRotate, faSave, faUserLock, faWarning, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../../../types';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ FaIconComponent, NgIf, FormsModule ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  faUserLock: IconDefinition = faUserLock;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faSave: IconDefinition = faSave;
  faWarning: IconDefinition = faWarning;
  saving: boolean = false;
  saved: boolean = false;
  code: string = "";
  @ViewChild('password_reset_form') password_reset_form!: NgForm;

  constructor(private usersService: UsersService, private route: ActivatedRoute, private toastService: ToastService){
    this.route.queryParams.subscribe(params => {
      console.dir(params);
        if(params["code"]) {
          this.code = params['code'];
        }
    });
  }

  password_change = {
    new_password: '',
    repeat_new_password: ''
  };

  password_change_errors = {
    new_password: '',
    repeat_new_password: ''
  }

  checkPasswords(){
    this.password_change_errors.new_password = '';
    this.password_change_errors.repeat_new_password = '';
    let error = false;
    //the user filled a new password...
    if(this.password_change.new_password){
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

  save(){
      //this.error = "";
      this.password_reset_form.form.markAllAsTouched();
      if(this.password_reset_form.form.valid && this.checkPasswords()) {
        this.saving = true;
        
        this.usersService.changePassword(this.code, this.password_change.new_password).subscribe({
          next: ()=>{
            this.saving = false;
            this.saved = true;
          },
          error: (error)=>{
            this.toastService.showError(error.error.message);
            this.saving = false;
          }
        });
      }
    }
}
