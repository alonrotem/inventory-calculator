import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Buffer } from "buffer";
import { UsersService } from '../../../services/users.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowsRotate, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { PromptDialogComponent } from "../../common/prompt-dialog/prompt-dialog.component";
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [FaIconComponent, FormsModule, NgIf, NgClass, CommonModule, PromptDialogComponent],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss'
})
export class VerifyComponent implements AfterViewInit {
  user_email: string = "";
  email_sent: boolean = false;
  user_verification_code: string = "";
  verifying: boolean = false;
  sending_code: boolean = false;
  faUserLock: IconDefinition = faUserLock;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faEnvelope: IconDefinition = faEnvelope;
  error: string = "";
  success: boolean = false;
  @ViewChild("email_prompt") email_prompt!: PromptDialogComponent;

  constructor(private route: ActivatedRoute, private router: Router, private usersService: UsersService, private toastService: ToastService) {

    this.route.queryParams.subscribe(params => {
      console.dir(params);
        if(params["u"]) {
          this.user_email = Buffer.from(params['u'], 'base64').toString('ascii');
        }
        if(params["code"]) {
          this.user_verification_code = params['code'];
        }
    });
    let nav = router.getCurrentNavigation()
    if (nav && nav.extras.state && nav.extras.state['info']) {
      if(nav.extras.state['info']['email']){
        this.user_email = nav.extras.state['info']['email'];
      }
      if(nav.extras.state['info']['email_sent']){
        this.email_sent = nav.extras.state['info']['email_sent'];
      }
    }
  }

  ngAfterViewInit(): void {
    this.email_prompt.modalValue = "";

    this.email_prompt.confirm.subscribe((email: string) => { 
      this.user_email = email;
      this.resend_code(email)
    });
  }

  code_keyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.verify_code();
    }
  }

  verify_code(){
    this.success = false;
    this.error = "";
    this.verifying = true;
    if(!this.user_verification_code) {
      this.error = "Please enter a valid code!";
      this.verifying = false;
      return;
    }
    this.usersService.verifyUserSignUpCode(this.user_verification_code).subscribe(
      {
        next:(data) => { 
          //this.raw_material_form.form.markAsPristine();
          //this.customer_table.unsaved_changes = false;
          //this.btn_save.nativeElement.classList.remove("disabled"); 
          //this.gotoMaterialsList(data['message'], false); 
          //alert("Success: " + data);
          this.success = true;
          this.verifying = false;
        },
        error:(response) => { 
          //this.btn_save.nativeElement.classList.remove("disabled"); 
          //this.gotoMaterialsList(error, true); 
          //this.toastService.showError(error.error["message"]);
          console.dir(response.error.message);
          this.error = response.error.message;
          this.verifying = false;
        }
      }
    );
  }

  check_email_to_resend_code(){
    if(!this.user_email) {
      this.email_prompt.open();
    }
    else {
      this.resend_code(this.user_email);
    }
  }

  resend_code(email_address: string){
    this.sending_code = true;
    this.usersService.sendUserAccountVerificationCode(email_address).subscribe(
      {
        next:(data) => { 
          this.toastService.showSuccess("Verification code sent");
          this.sending_code = false;
        },
        error:(response) => { 
          this.toastService.showError(response.error.message);
          this.sending_code = false;
        }
      }
    );
  }

  goto_signin(){
    this.router.navigate(['/users/signin'], {});    
  }
}
