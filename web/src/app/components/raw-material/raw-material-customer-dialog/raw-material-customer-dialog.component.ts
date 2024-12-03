import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Customer, CustomerListItem, Customers, ModalDialog, RawMaterialCustomerBank } from '../../../../types';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CustomersService } from '../../../services/customers.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { CapacityBarComponent } from '../capacity-bar/capacity-bar.component';

@Component({
  selector: 'app-raw-material-customer-dialog',
  standalone: true,
  imports: [ AutocompleteLibModule, FormsModule, NgIf, NgClass, ModalDialogComponent, ModalContentDirective, ModalContentDirective, CapacityBarComponent ],
  templateUrl: './raw-material-customer-dialog.component.html',
  styleUrl: './raw-material-customer-dialog.component.scss',
  providers: [{
    provide: MODAL_OBJECT_EDITOR,
    useExisting: RawMaterialCustomerDialogComponent
  }]
})
export class RawMaterialCustomerDialogComponent implements ModalContentDirective, ModalDialog {
@Input() editMode: boolean = false;
@Input() currentRawMaterialRemainingQuantity: number = 0;
@Input() editedObject: RawMaterialCustomerBank = {
    id: 0,
    name: '',
    business_name: '',
    raw_material_id: 0,
    customer_id: 0,
    quantity: 0,
    remaining_quantity: 0,
    quantity_units: '',
    transaction_record: null
  };
  @Input() banks: RawMaterialCustomerBank[] = [];
  //using a copy, not to update the customer until the dialog is confirmed to close.
  editedObjectCopy: RawMaterialCustomerBank = { ...this.editedObject };
  customers: CustomerListItem[] = [];
  customer_names: string[] = [];
  attemptedClose: boolean = false;
  Math: any = Math;
  min_quantity = 0;
  max_quantity = 0;
  
/*
|------------------------------------------| 
Raw material customer dialog should know:
- How much remaining raw material can be used on top of the current bank
- Current bank quantity
- Current bak quantity in use.
e.g.
Raw material: 200 kg, 100 in use
Bank: 40 kg, 20 in use.
Range to select: 20 (Can't go below in use) -to- 140 (40 in the bank + 100 of the raw material)

Functions:
- Open an existing customer
- Create a new customer
- Select an existing customer and load their data

When closed, options:
- A customer added to a bank
- An existing customer is updated
-----------------------------
*/

  @ViewChild("customerDialog") dialogWrapper!: ModalDialogComponent;
  @ViewChild("bankForm") bankForm!: NgForm;
  @ViewChild("meter") meter!: CapacityBarComponent;
  
/*
  //initial state of the current edited/new bank
  @Input() initialBankQuantity: number = 0;
  @Input() initialBankRemainingQuantity: number = 0;
  @Input() initialBankInUseQuantity: number = 0;
  
  //?
  @Input() remainingMaterialQuantity: number = 0;
  //@Input() raw_material_remaining: number = 0;

  
  

  banks_loaded_quantities: any[] = [];
  loadedQuantity: number = 0;
  */
  constructor(private customersService: CustomersService) {
    this.customersService.getCustomers({ } as any).subscribe({
      next: (customers: Customers) => {
        this.customer_names = customers.data.map((c) => c.name);
        this.customers = customers.data;
      }
    });
  }

  close: EventEmitter<any> = new EventEmitter<RawMaterialCustomerBank>();
  
  onOpen() {
    this.bankForm.form.markAsPristine();
    this.bankForm.form.markAsUntouched();
    this.attemptedClose = false;

    this.loadCustomerBank(this.editedObject)
  }
  
  loadCustomerBank(bank: RawMaterialCustomerBank){
    this.editedObjectCopy = { ...bank };
    //can't go below the quantity in use
    this.min_quantity = this.editedObjectCopy.quantity - this.editedObjectCopy.remaining_quantity;
    this.max_quantity = this.editedObjectCopy.quantity + this.currentRawMaterialRemainingQuantity;
    console.log("min: " + this.min_quantity + ", max: " + this.max_quantity);

    this.meter.bankQuantity = this.editedObjectCopy.quantity;
    this.meter.materialInUse = this.min_quantity;
    this.meter.totalCapacity = this.max_quantity;
    this.meter.recalculate();
  }


  beforeClose(): Boolean {
    this.attemptedClose = true;
    this.bankForm.form.markAllAsTouched();
    /*
    //console.log("beforeClose from RawMaterialCustomerDialogComponent");
    //min="{{ initialBankInUseQuantity }}" max="{{ initialBankQuantity + remainingMaterialQuantity }}
    //console.log("beforeCose, min=initialBankInUseQuantity->" + this.initialBankInUseQuantity + ", max=initialBankQuantity("+this.initialBankQuantity+")+remainingMaterialQuantity("+this.remainingMaterialQuantity+")="+(this.initialBankQuantity + this.remainingMaterialQuantity));
    if(this.editedObjectCopy.quantity < this.loadedQuantity) {
      console.log("REDUCED!")
    }
    */
    if(this.bankForm.valid){
      this.editedObject.id = this.editedObjectCopy.id;
      this.editedObject.business_name = this.editedObjectCopy.business_name;
      this.editedObject.customer_id = this.editedObjectCopy.customer_id;
      this.editedObject.name = this.editedObjectCopy.name;
      this.editedObject.quantity = this.editedObjectCopy.quantity;
      this.editedObject.quantity_units = this.editedObjectCopy.quantity_units;
      this.editedObject.raw_material_id = this.editedObjectCopy.raw_material_id;
      this.editedObject.remaining_quantity = ((this.editedObjectCopy.id <= 0) ? this.editedObjectCopy.quantity : this.editedObjectCopy.quantity - this.min_quantity );
      console.log("closing with remaining: " + this.editedObject.remaining_quantity);
      //this.loadedQuantity = 0;
      return true;
    }
    setTimeout(() => {
      this.bankForm.form.markAsUntouched();
      this.bankForm.form.controls["customerName"].markAsUntouched();
      this.bankForm.form.controls["materialQuantity"].markAsUntouched();
    }, 1000); 

    return false;
  }
  

  customer_name_selected(e:string){
    
    let customer_id = 0, customer_name = e;
    let customer_in_existing_list = this.customers.find((c) => c.name.toUpperCase() == e.toUpperCase());
    //(customer_in_existing_list);
    if(customer_in_existing_list){
      customer_id = customer_in_existing_list.id;
      customer_name = customer_in_existing_list.business_name;
    }

    let already_created_bank_for_this_customer = this.banks.find(b => b.name.toUpperCase() == e.toUpperCase());
    if(already_created_bank_for_this_customer) {
      this.loadCustomerBank(already_created_bank_for_this_customer);
      //console.log("already_created_bank_for_this_customer:");
      //console.dir(already_created_bank_for_this_customer);
      /*
      this.editedObjectCopy = { ...already_created_bank_for_this_customer };
      //console.log("editedObjectCopy:");
      //console.dir(this.editedObjectCopy);
      //this.remainingMaterialQuantity = already_created_bank_for_this_customer.remaining_quantity;
      
      let initialBankInfo = this.banks_loaded_quantities.find(b => b.bank_id == already_created_bank_for_this_customer.id);
      if(initialBankInfo){
        this.initialBankQuantity = initialBankInfo.initial_bank_quantity;
        this.initialBankRemainingQuantity = initialBankInfo.initial_bank_remaining;
        this.initialBankInUseQuantity = initialBankInfo.bank_in_use;
      }
      else {
        this.initialBankQuantity = 0;
        this.initialBankRemainingQuantity = 0;
        this.initialBankInUseQuantity = 0;
      } */
    }
    else {
      this.loadCustomerBank({
        id: 0,
        name: customer_name,
        business_name: '',
        raw_material_id: 0,
        customer_id: customer_id,
        quantity: 0,
        remaining_quantity: 0,
        quantity_units: '',
        transaction_record: null
      });
    }
    //console.log("this.remainingMaterialQuantity " + this.remainingMaterialQuantity);
    /*
    console.dir(this.editedObjectCopy);
    this.meter.totalCapacity = this.remainingMaterialQuantity + this.editedObjectCopy.quantity;
    this.meter.materialInUse = this.editedObjectCopy.quantity - this.editedObjectCopy.remaining_quantity;
    this.meter.bankQuantity = this.editedObjectCopy.quantity;
    this.meter.recalculate();
    */
  }
  
  capacityBarChanged(quantity:number){
    this.editedObjectCopy.quantity = quantity;
  }

  quantityChanged() {
    this.meter.bankQuantity = this.editedObjectCopy.quantity;
    this.meter.recalculate();
  }
}
