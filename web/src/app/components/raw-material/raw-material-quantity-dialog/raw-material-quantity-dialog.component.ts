import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { ModalObjectEditor, RawMaterial } from '../../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-raw-material-quantity-dialog',
  standalone: true,
  imports: [ FormsModule, NgIf, NgClass],
  templateUrl: './raw-material-quantity-dialog.component.html',
  styleUrl: './raw-material-quantity-dialog.component.scss'
})
export class RawMaterialQuantityDialogComponent implements ModalObjectEditor {
  top_up_quantity : number = 0;
  attemptedClose: boolean = false;
  @ViewChild("quantityForm") quantityForm!: NgForm;
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

  onOpen() {
    this.top_up_quantity = 0;
    this.quantityForm.form.markAsPristine();
    this.quantityForm.form.markAsUntouched();
    this.attemptedClose = false;    
  }

  beforeClose(): Boolean {
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
