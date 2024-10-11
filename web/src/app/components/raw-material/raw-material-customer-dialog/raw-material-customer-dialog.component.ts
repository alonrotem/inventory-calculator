import { AfterViewInit, Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
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
    weight: 0,
    units: 0
  };
  customers: Customer[] = [];
  customer_names: string[] = [];
  attemptedClose: boolean = false;
  
  @ViewChild("radioWeight", { read: ElementRef }) radioWeight!: ElementRef;
  @ViewChild("radioUnits", { read: ElementRef }) radioUnits!: ElementRef;
  @ViewChild("materialWeight", { read: ElementRef }) materialWeight!: ElementRef;
  @ViewChild("materialUnits", { read: ElementRef }) materialUnits!: ElementRef;
  @ViewChild("bankForm") bankForm!: NgForm;

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
    if(this.editedObject.units > 0){
      this.focusOnUnits();
      this.materialWeight.nativeElement.value = "";
    }
    else {
      this.focusOnWeight();
      this.materialUnits.nativeElement.value = "";
    }
    this.attemptedClose = false;
  }
  
  beforeClose(): Boolean {
    this.attemptedClose = true;
    this.bankForm.form.markAllAsTouched();
    if((this.bankForm.valid) && (this.checkUnitsOrWeight() == true)) {
      if(this.radioWeight.nativeElement.checked){
        this.editedObject.units = 0;
      }
      else if (this.radioUnits.nativeElement.checked) {
        this.editedObject.weight = 0;
      }
      return true;  
    }
    setTimeout(() => {
      this.bankForm.form.controls["customerName"].markAsUntouched();
      this.bankForm.form.controls["materialWeight"].markAsUntouched();
      this.bankForm.form.controls["materialUnits"].markAsUntouched();
    }, 3000); 
    
    return false;
  }
  
  ngAfterViewInit(): void {
    
  }

  focusOnWeight(): void {
    this.radioWeight.nativeElement.checked = true;
    this.materialWeight.nativeElement.focus();
    this.materialUnits.nativeElement.classList.add("transparent_text");
    this.materialWeight.nativeElement.classList.remove("transparent_text");
  }

  focusOnUnits(): void {
    this.radioUnits.nativeElement.checked = true;
    this.materialUnits.nativeElement.focus();
    this.materialUnits.nativeElement.classList.remove("transparent_text");
    this.materialWeight.nativeElement.classList.add("transparent_text");
  }

  checkUnitsOrWeight(): boolean {
    return (
      ((this.radioUnits.nativeElement.checked) && (!!Number(this.materialUnits.nativeElement.value))) ||
      ((this.radioWeight.nativeElement.checked) && (!!Number(this.materialWeight.nativeElement.value)))
    );
  }

  customer_name_selected(e:string){
    let customer_in_existing_list = this.customers.find((c) => c.name.toUpperCase() == e.toUpperCase());
    if(customer_in_existing_list){
      this.editedObject.customer_id = customer_in_existing_list.id;
      this.editedObject.business_name = customer_in_existing_list.business_name;
    }
    else {
      //this.editedObject.id = 0;
      this.editedObject.customer_id = 0;
    }
  }
}
