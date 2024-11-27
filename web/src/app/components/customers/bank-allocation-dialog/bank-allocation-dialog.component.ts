import { AfterViewInit, Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { Customer_Bank_Baby_Allocation, ModalDialog } from '../../../../types';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-bank-allocation-dialog',
  standalone: true,
  imports: [ ModalContentDirective, ModalDialogComponent, FormsModule, NgClass, NgIf ],
  templateUrl: './bank-allocation-dialog.component.html',
  styleUrl: './bank-allocation-dialog.component.scss',
  providers: [{
    provide: MODAL_OBJECT_EDITOR,
    useExisting: BankAllocationDialogComponent
  }]
})
export class BankAllocationDialogComponent implements ModalContentDirective, ModalDialog {
  @ViewChild("allocation_dialog") dialogWrapper! :ModalDialogComponent;
  @ViewChild("quantityForm") quantityForm! :NgForm;
  @Input() isNew: boolean = false;
  @Input() RemainingInBank: number = 0;
  @Input() CurrentQuantity: number = 0;
  @Input() MaxQuantity: number = 0;
  @Input() QuantityUnits: string = "";
  attemptedClose = false;
  

  editedObject: Customer_Bank_Baby_Allocation = {
    id: 0,
    customer_bank_id: 0,
    quantity: 0,
    remaining_quantity: 0
  };
  
  open(){
    this.dialogWrapper.open();
  }

  onOpen(): void {
    this.attemptedClose = false;
  }
  beforeClose(): Boolean {
    this.attemptedClose = true;
    this.quantityForm.form.markAllAsTouched();
    let okToClose = (this.CurrentQuantity > 0) && (this.CurrentQuantity <= this.MaxQuantity);
    if(this.quantityForm.valid && okToClose){
      return true;
    }
    setTimeout(() => {
      this.quantityForm.form.markAsUntouched();
      this.quantityForm.form.controls["allocationQuantity"].markAsUntouched();
    }, 3000); 
    return false;    
    //return ((this.quantityForm && this.quantityForm.valid != null)? this.quantityForm.valid : true);
  }
  close: EventEmitter<Customer_Bank_Baby_Allocation> = new EventEmitter<Customer_Bank_Baby_Allocation>();

}
