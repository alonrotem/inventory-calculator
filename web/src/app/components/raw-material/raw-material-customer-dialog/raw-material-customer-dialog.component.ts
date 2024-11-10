import { AfterViewInit, Component, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { Customer, Customers, ModalObjectEditor, RawMaterialCustomerBank } from '../../../../types';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CustomersService } from '../../../services/customers.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';



@Component({
  selector: 'app-raw-material-customer-dialog',
  standalone: true,
  imports: [ AutocompleteLibModule, FormsModule, NgIf, NgClass ],
  templateUrl: './raw-material-customer-dialog.component.html',
  styleUrl: './raw-material-customer-dialog.component.scss'
})
export class RawMaterialCustomerDialogComponent implements ModalObjectEditor, AfterViewInit {
  editedObject: RawMaterialCustomerBank = {
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
  customers: Customer[] = [];
  customer_names: string[] = [];
  attemptedClose: boolean = false;
  
  @ViewChild("bankForm") bankForm!: NgForm;
  @Input() remainingQuantity: number = -1;

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
  }
  
  beforeClose(): Boolean {
    this.attemptedClose = true;
    this.bankForm.form.markAllAsTouched();
    if(this.bankForm.valid){
      return true;
    }
    setTimeout(() => {
      this.bankForm.form.markAsUntouched();
      this.bankForm.form.controls["customerName"].markAsUntouched();
      this.bankForm.form.controls["materialquantity"].markAsUntouched();
    }, 3000); 
    
    return false;
  }
  
  ngAfterViewInit(): void {
    
  }

  customer_name_selected(e:string){
    let customer_in_existing_list = this.customers.find((c) => c.name.toUpperCase() == e.toUpperCase());
    if(customer_in_existing_list){
      this.editedObject.customer_id = customer_in_existing_list.id;
      this.editedObject.business_name = customer_in_existing_list.business_name;
    }
    else {
      this.editedObject.customer_id = 0;
    }
  }
}
