import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Customer, CustomerListItem, Customers, ModalDialog, RawMaterialCustomerBank } from '../../../../types';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CustomersService } from '../../../services/customers.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-raw-material-customer-dialog',
  standalone: true,
  imports: [ AutocompleteLibModule, FormsModule, NgIf, NgClass, ModalDialogComponent, ModalContentDirective, ModalContentDirective ],
  templateUrl: './raw-material-customer-dialog.component.html',
  styleUrl: './raw-material-customer-dialog.component.scss',
  providers: [{
    provide: MODAL_OBJECT_EDITOR,
    useExisting: RawMaterialCustomerDialogComponent
  }]
})
export class RawMaterialCustomerDialogComponent implements ModalContentDirective, ModalDialog, AfterViewInit {
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
  editedObjectCopy: RawMaterialCustomerBank = { ...this.editedObject };
  customers: CustomerListItem[] = [];
  customer_names: string[] = [];
  attemptedClose: boolean = false;
  Math: any = Math;
  
  @ViewChild("customerDialog") dialogWrapper!: ModalDialogComponent;
  @ViewChild("bankForm") bankForm!: NgForm;
  @Input() initialBankQuantity: number = 0;
  @Input() initialBankRemainingQuantity: number = 0;
  @Input() initialBankInUseQuantity: number = 0;
  @Input() remainingMaterialQuantity: number = 0;
  @Input() raw_material_remaining: number = 0;
  @Input() banks: RawMaterialCustomerBank[] = [];
  banks_loaded_quantities: any[] = [];
  
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

    this.editedObjectCopy = { ...this.editedObject };
    console.log(this.editedObjectCopy);

  }
  
  beforeClose(): Boolean {
    //console.log("beforeClose from RawMaterialCustomerDialogComponent");
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
      this.editedObject.remaining_quantity = this.initialBankRemainingQuantity + (this.editedObjectCopy.quantity - this.initialBankQuantity);
      return true;
    }
    setTimeout(() => {
      this.bankForm.form.markAsUntouched();
      this.bankForm.form.controls["customerName"].markAsUntouched();
      this.bankForm.form.controls["materialQuantity"].markAsUntouched();
    }, 1000); 
    return false;
  }
  
  ngAfterViewInit(): void {
    
  }

  customer_name_selected(e:string){
    let customer_in_existing_list = this.customers.find((c) => c.name.toUpperCase() == e.toUpperCase());
    console.dir(customer_in_existing_list);
    if(customer_in_existing_list){
      this.editedObjectCopy.customer_id = customer_in_existing_list.id;
      this.editedObjectCopy.business_name = customer_in_existing_list.business_name;
    }
    else {
      this.editedObjectCopy.customer_id = 0;
    }
    let already_created_bank_for_this_customer = this.banks.find(b => b.name == e);
    if(already_created_bank_for_this_customer) {
      console.log("already_created_bank_for_this_customer:");
      console.dir(already_created_bank_for_this_customer);
      this.editedObjectCopy = { ...already_created_bank_for_this_customer };
      console.log("editedObjectCopy:");
      console.dir(this.editedObjectCopy);
      //this.remainingMaterialQuantity = already_created_bank_for_this_customer.remaining_quantity;
      
      let initialBankInfo = this.banks_loaded_quantities.find(b => b.bank_id == already_created_bank_for_this_customer.id);
      if(initialBankInfo){
        this.initialBankQuantity = initialBankInfo.initial_bank_quantity;
        this.initialBankRemainingQuantity = initialBankInfo.initial_bank_remaining;
        this.initialBankInUseQuantity = initialBankInfo.bank_in_use;
      }
      
    }
  }
}
