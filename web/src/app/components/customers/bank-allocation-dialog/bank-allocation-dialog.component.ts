import { AfterViewInit, Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { Bank_Allocation_Type, Customer_Bank_Baby_Allocation, ModalDialog } from '../../../../types';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { DialogClosingReason, ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { CapacityBarComponent } from '../../raw-material/capacity-bar/capacity-bar.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-bank-allocation-dialog',
  standalone: true,
  imports: [ ModalContentDirective, ModalDialogComponent, FormsModule, NgClass, NgIf, CapacityBarComponent, NgSelectModule  ],
  templateUrl: './bank-allocation-dialog.component.html',
  styleUrl: './bank-allocation-dialog.component.scss',
  providers: [{
    provide: MODAL_OBJECT_EDITOR,
    useExisting: BankAllocationDialogComponent
  }]
})
export class BankAllocationDialogComponent implements ModalContentDirective, ModalDialog {
  @ViewChild("allocation_dialog") dialogWrapper!: ModalDialogComponent;
  @ViewChild("quantityForm") quantityForm!: NgForm;
  @ViewChild("meter") meter!: CapacityBarComponent;
  @Input() isNew: boolean = false;
  @Input() RemainingInBank: number = 0;
  @Input() QuantityInBank: number = 0;
  @Input() CurrentQuantity: number = 0;
  @Input() MaxQuantity: number = 0;
  @Input() QuantityUnits: string = "";
  @Input() AllocationType: Bank_Allocation_Type = Bank_Allocation_Type.babies;
  @Input() LockAllocationType: boolean = false;
  attemptedClose = false;

  allocation_type_cations: { [key: string]: string } = {
    babies: 'Babies',
    tails: 'H Material tails'
  };
  allocation_types = Object.keys(Bank_Allocation_Type)
    .map((item, index) => ({ 
      name: item, 
      caption: Object.values(Bank_Allocation_Type)[index] 
    }
  ));
  allocation_type: Bank_Allocation_Type = Bank_Allocation_Type.babies;
  Bank_Allocation_Type = Bank_Allocation_Type;
  Object = Object;

  constructor() {
  }
  
  editedObject: Customer_Bank_Baby_Allocation = {
    id: 0,
    pre_save_id: 0,
    customer_bank_id: 0,
    quantity: 0,
    remaining_quantity: 0,
    allocation_type: Bank_Allocation_Type.babies,
    tails_quantity: 0,
    tails_in_orders: 0
  };
  
  open(){
    //console.log("opening with AllocationType:"); console.dir(this.AllocationType);
    this.dialogWrapper.open();
  }

  onOpen(): void {
    /*
    console.log(
      "  RemainingInBank: " + this.RemainingInBank +
      ", QuantityInBank: " + this.QuantityInBank +
      ", CurrentQuantity: " + this.CurrentQuantity +
      ", MaxQuantity: " + this.MaxQuantity +
      ", QuantityUnits: " + this.QuantityUnits
    );
    */
    /*
       RemainingInBank: 2, QuantityInBank: 10, CurrentQuantity: 5, MaxQuantity: 7, QuantityUnits: units


     capacity bar for allocation
     in use: all in use quantity in bank - quantity of this allocation
        QuantityInBank - CurrentQuantity

     allocation qiantity: in use for this allocation
        CurrentQuantity

     total: all the rest
      QuantityInBank
    */
    this.attemptedClose = false;
    this.meter.bankQuantity = this.CurrentQuantity + this.QuantityInBank - (this.CurrentQuantity + this.RemainingInBank);
    //console.log("this.meter.bankQuantity " + this.meter.bankQuantity);
    this.meter.materialInUse = this.QuantityInBank - (this.CurrentQuantity + this.RemainingInBank);
    //console.log("this.meter.materialInUse " + this.meter.materialInUse);
    this.meter.totalCapacity = this.QuantityInBank;
    //console.log("this.meter.totalCapacity " + this.meter.totalCapacity);
    this.meter.recalculate();
  }

  beforeClose(reason: DialogClosingReason): Boolean {
    if(reason == DialogClosingReason.cancel) {
      return true;
    }
    //console.dir(this.editedObject);
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

  capacityBarChanged(quantity:number){
    this.CurrentQuantity = Math.round(this.meter.notInUseCapacity);
  }

  quantityChanged() {
    //console.log("this.CurrentQuantity " + this.CurrentQuantity + ", this.MaxQuantity " + this.MaxQuantity);
    if(this.CurrentQuantity >= 0 && this.CurrentQuantity <= this.MaxQuantity){
      this.meter.bankQuantity = this.CurrentQuantity + (this.QuantityInBank - this.RemainingInBank);
      this.meter.recalculate();  
    }
  }
}
