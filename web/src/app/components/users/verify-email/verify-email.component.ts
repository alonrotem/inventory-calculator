import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { PromptDialogComponent } from '../../common/prompt-dialog/prompt-dialog.component';
import { faUserLock, faArrowsRotate, faEnvelope, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ FaIconComponent, FormsModule, NgIf, NgClass, CommonModule, PromptDialogComponent ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  user_email: string = "";
  email_sent: boolean = false;
  user_verification_code: string = "";
  cancel_new_address: boolean = false;
  verifying: boolean = false;
  sending_code: boolean = false;
  faUserLock: IconDefinition = faUserLock;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faEnvelope: IconDefinition = faEnvelope;
  faCheck: IconDefinition = faCheck;
  faX: IconDefinition = faX;
  error: string = "";
  verified: boolean = false;
  verified_successfully: boolean = false;
  verified_error: boolean = false;
  cancelled_address: boolean = false;
  @ViewChild("email_prompt") email_prompt!: PromptDialogComponent;

  constructor(private route: ActivatedRoute, private usersService: UsersService, private toastService: ToastService) {
    this.route.queryParams.subscribe(params => {
        if(params["code"]) {
          this.user_verification_code = params['code'];
        }
        if(params["cancel"] && params["cancel"] ==1) {
          this.cancel_new_address = true;
        }
        if(this.user_verification_code) {
          this.verify_code();
        }
    });
  }

  verify_code() {
    this.verifying = true;
    this.verified = false;
    this.verified_successfully = false;
    this.verified_error = false;
    this.cancelled_address = false;
    this.usersService.verifyNewEmailCode(this.user_verification_code, this.cancel_new_address).subscribe({
      next: (result: any) => {
        this.toastService.showSuccess(result);
        this.verifying = false;
        this.verified = true;
        if(this.cancel_new_address){
          this.cancelled_address = true;
        }
        else {
          this.verified_successfully = true;
        }
      },
      error: (error: any) => {
        this.toastService.showError(error.error.message);
        this.verifying = false;
        this.verified = true;
        this.verified_error = true;
      }
    });
  }

  code_keyup(event: any){}
}
