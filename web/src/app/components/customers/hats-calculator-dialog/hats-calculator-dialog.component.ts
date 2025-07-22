import { Component, Input, ViewChild } from '@angular/core';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { SingleHatCalculatorComponent } from '../single-hat-calculator/single-hat-calculator.component';
import { Customer, Allocation_Baby, Customer_Bank, Customer_Bank_Baby_Allocation } from '../../../../types';

@Component({
  selector: 'app-hats-calculator-dialog',
  standalone: true,
  imports: [ ModalDialogComponent, SingleHatCalculatorComponent ],
  templateUrl: './hats-calculator-dialog.component.html',
  styleUrl: './hats-calculator-dialog.component.scss'
})
export class HatsCalculatorDialogComponent {

  @ViewChild('dialog') dialog!: ModalDialogComponent;
  @ViewChild('calculator') calculator!: SingleHatCalculatorComponent;
  @Input() banks: Customer_Bank[] = [];
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Allocation_Baby[] = [];  
  @Input() customer: Customer = {
    id: 0, name: '', business_name: '', email: '', phone: '', tax_id: '',
    created_at: new Date(), updated_at: new Date(), created_by: 0, updated_by: 0,
    banks: [], banks_baby_allocations: [], babies: [],
    customer_code: '', order_seq_number: 0
  };
  
  open() {
    /*
    this.calculator.customer = this.customer;
    this.calculator.banks = this.banks;
    this.calculator.banks_baby_allocations = this.banks_baby_allocations;
    this.calculator.babies = this.babies;
    this.dialog.open();
    */
  }
}
