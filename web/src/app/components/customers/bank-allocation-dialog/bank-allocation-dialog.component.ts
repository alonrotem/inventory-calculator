import { Component, EventEmitter, ViewChild } from '@angular/core';
import { Customer_Bank_Baby_Allocation, ModalDialog } from '../../../../types';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';

@Component({
  selector: 'app-bank-allocation-dialog',
  standalone: true,
  imports: [ ModalContentDirective, ModalDialogComponent ],
  templateUrl: './bank-allocation-dialog.component.html',
  styleUrl: './bank-allocation-dialog.component.scss',
  providers: [{
    provide: MODAL_OBJECT_EDITOR,
    useExisting: BankAllocationDialogComponent
  }]
})
export class BankAllocationDialogComponent implements ModalContentDirective, ModalDialog {
  @ViewChild("allocation_dialog") dialogWrapper! :ModalDialogComponent;
  //dialogWrapper: ModalDialogComponent | null = null;
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
    
  }
  beforeClose(): Boolean {
    return true;
  }
  close: EventEmitter<Customer_Bank_Baby_Allocation> = new EventEmitter<Customer_Bank_Baby_Allocation>();

}
