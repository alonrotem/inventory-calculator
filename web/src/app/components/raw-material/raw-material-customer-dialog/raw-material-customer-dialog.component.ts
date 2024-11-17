import { AfterViewInit, Component, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { Customer, Customers, ModalDialog, RawMaterialCustomerBank } from '../../../../types';
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
  customers: Customer[] = [];
  customer_names: string[] = [];
  attemptedClose: boolean = false;
  
  @ViewChild("customerDialog") dialogWrapper!: ModalDialogComponent;
  @ViewChild("bankForm") bankForm!: NgForm;
  @Input() initialBankQuantity: number = -1;
  @Input() initialBankRemainingQuantity: number = -1;
  @Input() remainingMaterialQuantity: number = -1;

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
    console.log("beforeClose from RawMaterialCustomerDialogComponent");
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
