import { Component, ViewChild } from '@angular/core';
import { AccountRequestInfo } from '../../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-request-account',
  standalone: true,
  imports: [ FormsModule, NgIf ],
  templateUrl: './request-account.component.html',
  styleUrl: './request-account.component.scss'
})
export class RequestAccountComponent {

  @ViewChild('account_request_form') account_request_form!: NgForm;

  request: AccountRequestInfo = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    details: ''
  };

  reset(){
    this.request = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      details: ''
      };
      this.account_request_form.form.markAsUntouched();
      this.account_request_form.form.markAsPristine();
  }

  isValid(){
    this.account_request_form.form.markAllAsTouched();
    return this.account_request_form.form.valid;
  }

  get_data(){
    if(this.isValid()) {
      return this.request;
    }
    throw new Error("Invalid details!");
  }
}
