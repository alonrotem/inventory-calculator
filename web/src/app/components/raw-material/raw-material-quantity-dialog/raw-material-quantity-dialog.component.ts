import { Component, ContentChild, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { take } from 'rxjs';
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
  @ViewChild("topUpInput") topUpInput!: ElementRef<HTMLInputElement>;
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
  

  // Opens the dialog and resolves with the quantity to top up by, or null if the user cancelled.
  // max_topping: the most the user may top up by (0 or omitted = no limit)
  open(options: { title?: string, quantity_units: string, current_quantity: number, remaining_quantity: number, max_topping?: number }): Promise<number | null> {
    this.dialogWrapper.modalTitle = options.title ?? "+ Top up quantity";
    this.rawMaterialQuantityUnits = options.quantity_units;
    this.rawMaterial_quantity_units = options.quantity_units;
    this.show_units_to_kg_adjustment = false;
    this.editedObject = {
      top_up_quantity: 0,
      current_quantity: options.current_quantity,
      current_quantity_kg: 0,
      remaining_quantity: options.remaining_quantity,
      quantity_units: options.quantity_units,
      max_topping: options.max_topping ?? 0
    };
    this.dialogWrapper.open();
    this.onOpen();

    // Once the modal is fully open, the user can type right away (replacing any existing text)
    this.dialogWrapper.modalReference.shown.pipe(take(1)).subscribe(() => {
      this.topUpInput?.nativeElement.focus();
      this.topUpInput?.nativeElement.select();
    });

    return new Promise<number | null>((resolve) => {
      const modal = this.dialogWrapper.modalReference;
      const confirmSub = this.dialogWrapper.confirm.subscribe(() => {
        finish(this.entered_quantity > 0 ? this.entered_quantity : null);
      });
      const cancelSub = this.dialogWrapper.cancel.subscribe(() => finish(null));
      // The modal can also be dismissed by itself (backdrop click), without a confirm/cancel event
      const hiddenSub = modal.hidden.subscribe(() => finish(null));
      const finish = (value: number | null) => {
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
        hiddenSub.unsubscribe();
        resolve(value);
      };
    });
  }

  onOpen() {
    this.top_up_quantity = 0;
    this.quantityChanged();
    this.quantityForm.form.markAsPristine();
    this.quantityForm.form.markAsUntouched();
    this.attemptedClose = false;
  }

  // The quantity as displayed in the textbox, which is what the user sees (0 if empty or invalid)
  get entered_quantity(): number {
    const text = this.topUpInput?.nativeElement.value ?? '';
    const quantity = Number(text.replace(/,/g, ''));
    return isNaN(quantity) ? 0 : quantity;
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
    const quantity = this.entered_quantity;
    const okToClose = quantity > 0 && (this.editedObject.max_topping <= 0 || quantity <= this.editedObject.max_topping);
    if(okToClose){
      return true;
    }
    setTimeout(() => {
      this.quantityForm.form.markAsUntouched();
      this.quantityForm.form.controls["topUpQuantity"].markAsUntouched();
    }, 3000); 
    return false;
  }
}
