import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowsRotate, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ FormsModule, NgIf, FaIconComponent ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  @ViewChild('signup_form') signup_form!: NgForm;

  signupData: { firstname: string, lastname: string, username: string, password: string, password_confirm: string, email: string } = {
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    password_confirm: "",
    email: ""
  };
  error = "";
  faArrowsRotate:IconDefinition = faArrowsRotate;
  signing_up: boolean = false;

  constructor(private usersService:UsersService, protected router: Router){
  }

  send_signup() {
    this.error = "";
    this.signup_form.form.markAllAsTouched();
    if(this.signup_form.form.valid && this.signupData.password == this.signupData.password_confirm) {
      this.signing_up = true;

      this.usersService.signupNewUser({
        firstname: this.signupData.firstname,
        lastname: this.signupData.lastname,
        username: this.signupData.username,
        password: this.signupData.password,
        email: this.signupData.email,
        role: "administrator"
      }).subscribe(
        {
          next:(data) => { 
            this.signing_up = false;
            //this.raw_material_form.form.markAsPristine();
            //this.customer_table.unsaved_changes = false;
            //this.btn_save.nativeElement.classList.remove("disabled"); 
            //this.gotoMaterialsList(data['message'], false); 
            //alert("Success: " + data);
            this.go_to_verify();
          },
          error:(response) => { 
            //this.btn_save.nativeElement.classList.remove("disabled"); 
            //this.gotoMaterialsList(error, true); 
            //this.toastService.showError(error.error["message"]);
            console.dir(response.error.message);
            this.error =  response.error.message;
            this.signing_up = false;
          }
        }
      ); 
    }
  }

  go_to_verify(){
    this.router.navigate(['/users/verify'], {
      state: {
        info: {
          email: this.signupData.email,
          email_sent: true
        }
      },
    });    
  }
}
