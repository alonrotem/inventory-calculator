import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowsRotate, faEnvelopeCircleCheck, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BasicUserInfoStatus, SignInData } from '../../../../types';
import { PromptDialogComponent } from "../../common/prompt-dialog/prompt-dialog.component";
import { ToastService } from '../../../services/toast.service';
import { RequestAccountComponent } from "../request-account/request-account.component";
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, FaIconComponent, PromptDialogComponent, RequestAccountComponent, ModalDialogComponent, ModalContentDirective],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SignInComponent implements OnInit {

  signInData: SignInData = {
    username_or_email: "",
    password: "",
    remember: false,
    origin_geolocation: '',
    origin_city: '',
    origin_country: '',
    origin_os: '',
    origin_browser: ''
  };

  error: string = "";
  signing_in: boolean = false;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faRightToBracket: IconDefinition = faRightToBracket;
  faEnvelopeCircleCheck: IconDefinition = faEnvelopeCircleCheck;
  @ViewChild('signin_form') signin_form!: NgForm;
  @ViewChild('forgotPasswordPrompt') forgotPasswordPrompt!: PromptDialogComponent;
  @ViewChild('request_account_dialog') request_account_dialog!: ModalDialogComponent;
  @ViewChild('request_account_form') request_account_form!: RequestAccountComponent;
  @ViewChild('request_sent') request_sent!: ModalDialogComponent;
  goto_url: string = "";

  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute, private toastService: ToastService) {
    let nav = router.getCurrentNavigation();
    if (nav && nav.extras.state && nav.extras.state['info']) {
      if(nav.extras.state['info']['going_to']){
        this.goto_url = nav.extras.state['info']['going_to'];
      }
    }
    if(!this.goto_url) {
      this.goto_url = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    
    //alerady signed in -> no need to sign in
    this.usersService.checkSignInStatus().subscribe({next: (userInfo: BasicUserInfoStatus) => {
      if(userInfo.id > 0){
        console.log("caught status in signin");
        console.dir(userInfo);
        console.log("sign in auto navigate to " + this.goto_url);
        this.router.navigateByUrl(this.goto_url);
      }
    },
    error: (error: any)=> {
      console.log("Error checking sign in status from sign in page:");
      console.dir(error);
    }});
  }

  ngOnInit(): void {
  }

  request_account(){
    if(this.request_account_form.isValid()){
      this.usersService.sendRequestForNewAccount(this.request_account_form.request).subscribe({
        next: () => { 
          this.toastService.showSuccess("Sent"); 
          this.request_sent.open();
        },
        error: (error: any) => { this.toastService.showError(error.error.message); }
      });
    }
  }

  validateEmail(email: string) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    return emailRegex.test(email)
  }  

  open_forgot_password_prompt() {
    this.forgotPasswordPrompt.open();
  }

  open_request_account() {
    this.request_account_form.reset();
    this.request_account_dialog.open();
  }

  canCloseAccountRequest= (): boolean => {
    return this.request_account_form.isValid();
  };

  forgot_Password_confirmed(address: string){
    if((address) && (this.validateEmail(address))){
      this.usersService.userForgotPassword(address).subscribe({
        next: (result:string) => {
          this.toastService.showSuccess(result);
        },
        error: (err) => {
          this.toastService.showError(err.error.message);          
        },
      });
    }
    else {
      this.toastService.showError("Invalid address given");
    }
  }

signin() {
    this.error = "";
    this.signin_form.form.markAllAsTouched();
    if(this.signin_form.form.valid) {
      this.signing_in = true;
      
      this.usersService.signIn(this.signInData).subscribe(
      {
        next:(data) => { 
          console.dir(data);
          this.signing_in = false;
          console.log("going to " + this.goto_url)
          this.router.navigateByUrl(this.goto_url);
        },
        error:(response) => { 
          this.error = response.error.message;
          this.signing_in = false;
          console.log("error signing in: " + response.error.message);
        }
      }); 
    }
  }
}
