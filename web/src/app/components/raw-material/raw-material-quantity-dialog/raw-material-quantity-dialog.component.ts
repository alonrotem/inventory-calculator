import { Component, ContentChild, EventEmitter, Input, ViewChild } from '@angular/core';
import { ModalDialog, RawMaterial } from '../../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { DialogClosingReason, ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { NumericInputDirective } from '../../../utils/directives/auto-numeric.directive';

@Component({
  selector: 'app-raw-material-quantity-dialog',
  standalone: true,
  imports: [ FormsModule, NgIf, NgClass, ModalDialogComponent, ModalContentDirective, DecimalPipe, NumericInputDirective ],
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

  @Input() rawMaterialQuantityUnits: string = 'units';

  @ViewChild("quantityForm") quantityForm!: NgForm;
  @ViewChild("quantityDialog") dialogWrapper! :ModalDialogComponent;
  
  close: EventEmitter<number> = new EventEmitter<number>();
  @Input() editedObject = {
    top_up_quantity: 0,
    current_quantity: 0,
    current_quantity_kg: 0,
    remaining_quantity: 0,
    quantity_units: "units",
    max_topping: 0
  };
  @Input() rawMaterial_quantity_units: string = "units";
  @Input() rawMaterialUnitsPerKg: number = 0;
  @Input() text = "";
  @Input() show_units_to_kg_adjustment: boolean = false;

  constructor() {
    //this.quantityDialog.confirm.subscribe()
  }
  

  open(){
    if(this.editedObject.quantity_units == "units" && this.rawMaterial_quantity_units == "kg"){
      this.editedObject.max_topping *= this.rawMaterialUnitsPerKg;
    }
    this.dialogWrapper.open();
    this.onOpen();
  }

  onOpen() {
    this.top_up_quantity = 0;
    this.quantityChanged();
    this.quantityForm.form.markAsPristine();
    this.quantityForm.form.markAsUntouched();
    this.attemptedClose = false;
  }

  quantityChanged(){
    if(this.editedObject.quantity_units == "units" && this.rawMaterialQuantityUnits == "kg") {
      this.editedObject.current_quantity_kg = this.editedObject.top_up_quantity / this.rawMaterialUnitsPerKg;
    }
    else {
      this.editedObject.current_quantity_kg = this.editedObject.top_up_quantity;
    }
  }

  beforeClose(reason: DialogClosingReason): Boolean {
    if(reason == DialogClosingReason.cancel) {
      return true;
    }

    this.attemptedClose = true;
    this.quantityForm.form.markAllAsTouched();
    let okToClose = (this.editedObject.max_topping > 0)? this.quantityForm.form.controls["topUpQuantity"].value <= this.editedObject.max_topping : true;
    if(this.quantityForm.valid && okToClose){
      return true;
    }
    setTimeout(() => {
      this.quantityForm.form.markAsUntouched();
      this.quantityForm.form.controls["topUpQuantity"].markAsUntouched();
    }, 3000); 
    return false;
  }
}
