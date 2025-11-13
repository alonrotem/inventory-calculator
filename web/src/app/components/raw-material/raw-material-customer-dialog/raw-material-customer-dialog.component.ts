import { Component, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { CustomerListItem, Customers, ModalDialog, RawMaterialCustomerBank } from '../../../../types';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CustomersService } from '../../../services/customers.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf, DecimalPipe } from '@angular/common';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { DialogClosingReason, ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { CapacityBarComponent } from '../capacity-bar/capacity-bar.component';
import { NumericInputDirective } from '../../../utils/directives/auto-numeric.directive';

@Component({
  selector: 'app-raw-material-customer-dialog',
  standalone: true,
  imports: [ 
    AutocompleteLibModule, FormsModule, NgIf, NgClass, ModalDialogComponent, ModalContentDirective, 
    ModalContentDirective, CapacityBarComponent, DecimalPipe, NumericInputDirective
  ],
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
    quantity_units: 'units',
    quantity_in_kg: 0,
    transaction_record: null
  };
  @Input() banks: RawMaterialCustomerBank[] = [];
  @Input() rawMaterialQuantityUnits: string = 'units';
  @Input() rawMaterialUnitsPerKg: number = 0;
  //using a copy, not to update the customer until the dialog is confirmed to close.
  editedObjectCopy: RawMaterialCustomerBank = { ...this.editedObject };
  customers: CustomerListItem[] = [];
  customer_names: string[] = [];
  attemptedClose: boolean = false;
  Math: any = Math;
  min_quantity = 0;
  max_quantity = 0;
  //units_per_kg_translation = 0;
  initial_bank_quantity = 0;
  //curr_kg_quantity: number = 0;
  console=console;

  @ViewChild("customerDialog") dialogWrapper!: ModalDialogComponent;
  @ViewChild("bankForm") bankForm!: NgForm;
  @ViewChild("meter") meter!: CapacityBarComponent;
  @ViewChild('fine_tune_button') fine_tune_button!: ElementRef;
  @ViewChild('collapse_fine_tune') collapse_fine_tune!: ElementRef;
  
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
    //this.units_per_kg_translation = this.rawMaterialUnitsPerKg;
    this.console.dir(this.editedObject);
    this.loadCustomerBank(this.editedObject);
    this.collapse_fine_tune_accordion();
  }

  collapse_fine_tune_accordion() {
    if(this.fine_tune_button && this.collapse_fine_tune) {
    this.fine_tune_button.nativeElement.setAttribute("aria-expanded", false);
    this.fine_tune_button.nativeElement.classList.add("collapsed"); 
    this.collapse_fine_tune.nativeElement.classList.remove("show");
    }
  }
  
  loadCustomerBank(bank: RawMaterialCustomerBank){
    this.editedObjectCopy = { ...bank };

    //can't go below the quantity in use
    this.min_quantity = this.editedObjectCopy.quantity - this.editedObjectCopy.remaining_quantity;

    if(this.rawMaterialQuantityUnits == "kg"){
      this.max_quantity = this.editedObjectCopy.quantity + (this.currentRawMaterialRemainingQuantity * this.rawMaterialUnitsPerKg);
    }
    else {
      this.max_quantity = this.editedObjectCopy.quantity + this.currentRawMaterialRemainingQuantity;
    }
    
    this.meter.bankQuantity = this.editedObjectCopy.quantity;
    this.initial_bank_quantity = this.editedObjectCopy.quantity;
    this.meter.materialInUse = this.min_quantity;
    this.meter.totalCapacity = this.max_quantity;
    this.quantityChanged(false);
    //this.meter.recalculate();
  }


  beforeClose(reason: DialogClosingReason): Boolean {
    if(reason == DialogClosingReason.cancel)
      return true;
    
    this.attemptedClose = true;
    this.bankForm.form.markAllAsTouched();

    if(this.bankForm.valid){
      this.editedObject.id = this.editedObjectCopy.id;
      this.editedObject.business_name = this.editedObjectCopy.business_name;
      this.editedObject.customer_id = this.editedObjectCopy.customer_id;
      this.editedObject.name = this.editedObjectCopy.name;
      this.editedObject.quantity = this.editedObjectCopy.quantity;
      this.editedObject.quantity_units = this.editedObjectCopy.quantity_units;
      this.editedObject.raw_material_id = this.editedObjectCopy.raw_material_id;
      this.editedObject.remaining_quantity = ((this.editedObjectCopy.id <= 0) ? this.editedObjectCopy.quantity : this.editedObjectCopy.quantity - this.min_quantity );
      this.editedObject.quantity_in_kg = (this.rawMaterialQuantityUnits == "kg")? this.editedObjectCopy.quantity_in_kg : 0;
      this.editedObjectCopy.quantity = 0; // reset the quantity before closing, so that on the next load there is no boundaries issue
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
    if(customer_in_existing_list){
      customer_id = customer_in_existing_list.id;
      customer_name = customer_in_existing_list.business_name;
    }

    let already_created_bank_for_this_customer = this.banks.find(b => b.name.toUpperCase() == e.toUpperCase());
    if(already_created_bank_for_this_customer) {
      this.loadCustomerBank(already_created_bank_for_this_customer);
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
        quantity_units: 'units',
        quantity_in_kg: 0,
        transaction_record: null
      });
    }
  }
  
  capacityBarChanged(quantity:number){
    this.editedObjectCopy.quantity = quantity;
    this.quantityChanged(true);
  }

  quantityChanged(update_kgs: boolean = false) {
    if(update_kgs) {
      this.editedObjectCopy.quantity_in_kg = Number(this.editedObjectCopy.quantity) / this.rawMaterialUnitsPerKg;
    }

    if(this.editedObjectCopy.quantity <= this.min_quantity)
    {
      this.meter.bankQuantity = this.min_quantity;
    }
    else if (this.editedObjectCopy.quantity >= this.max_quantity) {
      this.meter.bankQuantity = this.max_quantity;
    }
    else {
      this.meter.bankQuantity = this.editedObjectCopy.quantity;
    }
    this.meter.recalculate();
  }
}
