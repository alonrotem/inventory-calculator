import { Component, Input, ViewChild } from '@angular/core';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { SingleHatCalculatorComponent } from '../single-hat-calculator/single-hat-calculator.component';
import { Customer_Baby, Customer_Bank, Customer_Bank_Baby_Allocation } from '../../../../types';

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
  @Input() babies: Customer_Baby[] = [];  
  
  open() {
    this.calculator.banks = this.banks;
    this.calculator.banks_baby_allocations = this.banks_baby_allocations;
    this.calculator.babies = this.babies;
    this.dialog.open();
  }
}
