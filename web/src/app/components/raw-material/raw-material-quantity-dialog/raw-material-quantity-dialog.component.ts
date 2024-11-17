import { Component, ContentChild, EventEmitter, Input, ViewChild } from '@angular/core';
import { ModalDialog, RawMaterial } from '../../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';

@Component({
  selector: 'app-raw-material-quantity-dialog',
  standalone: true,
  imports: [ FormsModule, NgIf, NgClass, ModalDialogComponent, ModalContentDirective ],
  templateUrl: './raw-material-quantity-dialog.component.html',
  styleUrl: './raw-material-quantity-dialog.component.scss',
  providers: [{
      provide: MODAL_OBJECT_EDITOR,
      useExisting: RawMaterialQuantityDialogComponent
    }]
})
export class RawMaterialQuantityDialogComponent implements ModalContentDirective, ModalDialog {
  top_up_quantity : number = 0;
  attemptedClose: boolean = false;
  @ViewChild("quantityForm") quantityForm!: NgForm;
  @ViewChild("quantityDialog") dialogWrapper! :ModalDialogComponent;
  
  close: EventEmitter<number> = new EventEmitter<number>();
  @Input() editedObject: RawMaterial = {
    id: 0,
    name: '',
    purchased_at: new Date(),
    purchase_quantity: 0,
    remaining_quantity: 0,
    quantity_units: '',
    units_per_kg: 0,
    vendor_name: '',
    origin_country: '',
    price: 0,
    currency: '',
    notes: '',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0,
    customer_banks: [],
    transaction_record: null
  };

  constructor() {
    //this.quantityDialog.confirm.subscribe()
  }
  

  open(){
    this.dialogWrapper.open();
    this.onOpen();
  }

  onOpen() {
    this.top_up_quantity = 0;
    this.quantityForm.form.markAsPristine();
    this.quantityForm.form.markAsUntouched();
    this.attemptedClose = false;    
  }

  beforeClose(): Boolean {
    console.log("before close FROM QUANTITY");
    this.attemptedClose = true;
    this.quantityForm.form.markAllAsTouched();
    if(this.quantityForm.valid){
      return true;
    }
    setTimeout(() => {
      this.quantityForm.form.markAsUntouched();
      this.quantityForm.form.controls["topUpQuantity"].markAsUntouched();
    }, 3000); 
    return false;
  }
}
