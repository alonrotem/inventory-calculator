import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CustomersService } from '../../../services/customers.service';
import { BasicCustomerInfo, CustomerListItem, Customers, nameIdPair } from '../../../../types';
import { MultiPickerComponent } from '../../common/multi-picker/multi-picker.component';

@Component({
  selector: 'app-customer-picker',
  standalone: true,
  imports: [MultiPickerComponent],
  templateUrl: './customer-picker.component.html'
})
export class CustomerPickerComponent implements OnChanges {
  customers: CustomerListItem[] = [];

  @Input() disabled: boolean = true;
  @Input() multi: boolean = true;
  @Input() pickedCustomers: nameIdPair[] = [];
  @Output() pickedCustomersChange = new EventEmitter<nameIdPair[]>();
  @Output() Change = new EventEmitter();

  constructor(private customersService: CustomersService) {
    this.customersService.getCustomers({ page: 0, perPage: 0 }).subscribe({
      next: (cusomers: Customers) => { this.customers = cusomers.data.filter(c => !c.is_demo_customer); },
      error: (error: any) => {}
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pickedCustomers'] && changes['pickedCustomers'].currentValue) {
      this.pickedCustomers = changes['pickedCustomers'].currentValue.filter((c: BasicCustomerInfo) => !c.is_demo_customer);
    }
  }
}
