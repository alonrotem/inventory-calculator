import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomersService } from '../../../services/customers.service';
import { CustomerListItem, Customers, nameIdPair } from '../../../../types';
import { NgFor, NgIf } from '@angular/common';
import { FirstPipe } from "../../../utils/pipes/first-pipe";
import { FilterPipe } from "../../../utils/pipes/filter-pipe";
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customer-picker',
  standalone: true,
  imports: [NgFor, NgIf, FirstPipe, FilterPipe, FormsModule, NgSelectModule, FaIconComponent],
  templateUrl: './customer-picker.component.html',
  styleUrl: './customer-picker.component.scss'
})
export class CustomerPickerComponent {
  customers: CustomerListItem[] = [];
  
  @Input() multi: boolean = true;
  @Input() pickedCustomers: nameIdPair[] = [];
  @Output() pickedCustomersChange = new EventEmitter<nameIdPair[]>();
  @Output() Change = new EventEmitter();
  
  @ViewChild("customer_select") customer_select!: NgSelectComponent;

  faX: IconDefinition = faX;

  picking: boolean = false;
  user_message: string = "";

  constructor(private customersService: CustomersService) {
    this.customersService.getCustomers({ page: 0, perPage: 0 }).subscribe({
      next: (cusomers: Customers) => { this.customers = cusomers.data;  },
      error: (error: any) => {}
    });
   }

   pick(){
    this.user_message = "";
    this.picking = true;
    this.customer_select.focus();
   }


   customerPicked(picked: CustomerListItem){
    if(!this.pickedCustomers){
      this.pickedCustomers = [];
    }
    if(picked){
      if(!this.pickedCustomers.find(c => c.id == picked.id)){
        this.pickedCustomers.push({ id: picked.id, name: picked.name });
        this.customer_select.handleClearClick();
        this.picking = false;
        this.pickedCustomersChange.emit(this.pickedCustomers);
        this.Change.emit();
      }
      else {
        this.user_message = `${picked.name} is already picked`;
      }
    }
   }

   removeCustomer(id: number){
    if(!this.pickedCustomers){
      this.pickedCustomers = [];
    }
    const index: number = this.pickedCustomers.findIndex(c => c.id == id);
    if (index !== -1) {
        this.pickedCustomers.splice(index, 1);
        this.pickedCustomersChange.emit(this.pickedCustomers);
        this.Change.emit();
    }     
   }
}
