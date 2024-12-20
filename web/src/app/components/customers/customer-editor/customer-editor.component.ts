import { AfterViewInit, Component, ElementRef, Input, OnInit,ViewChild } from '@angular/core';
import { Location, NgFor, NgIf } from '@angular/common';
import { Customer, TransactionRecord, TransactionType } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { InfoService } from '../../../services/info.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition, faArrowLeft, faMoneyCheckDollar, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastService } from '../../../services/toast.service';
import { CustomersService } from '../../../services/customers.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable } from 'rxjs';
import { CustomerBanksTableComponent } from '../customer-banks-table/customer-banks-table.component';
//import { CustomerBankTableComponent } from '../customer-bank-table/customer-bank-table.component';


@Component({
  selector: 'app-customer-editor',
  standalone: true,
  imports: [ RouterModule, FormsModule, NgSelectModule, DateStrPipe, 
    FaIconComponent, NgIf, NgFor, ConfirmationDialogComponent, AutocompleteLibModule, 
    CustomerBanksTableComponent ],
  templateUrl: './customer-editor.component.html',
  styleUrl: './customer-editor.component.scss'
})
export class CustomerEditorComponent implements OnInit, AfterViewInit, HasUnsavedChanges {

  public customerItem : Customer = {
    id: 0,
    name: '',
    business_name: '',
    email: '',
    phone: '',
    tax_id: '',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0,
    banks: [],
    banks_baby_allocations: [],
    babies: []
  }

  title: string = "Create Customer";
  newCustomerMode: boolean = true;
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowLeft: IconDefinition = faArrowLeft;
  faMoneyCheckDollar: IconDefinition = faMoneyCheckDollar;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  is_new_customer: Boolean = true;
  banks_loaded_quantities: any[] = [];

  // for opening the unsave changes dialog
  private confirmResult: boolean | null = null;
  private modalSubscription: any; // Track the subscription

  //@ViewChild("materialName", { read: ElementRef }) materialName!: ElementRef;
  @ViewChild("customerName", { read: ElementRef }) customerName! :ElementRef;
  @ViewChild('customer_form') customer_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('navigate_confirmation') navigate_confirmation!: ConfirmationDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
 
  constructor(private customersService: CustomersService, private infoService: InfoService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router, private toastService: ToastService) { 
  }

  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {

    if(!this.customer_form.pristine) {
      return new Promise((resolve) => {
        this.confirmResult = null;
        // Ensure this refers to the component's instance using an arrow function
        this.navigate_confirmation.open(); // Open the modal dialog
    
        // Use arrow function to preserve `this` context
        this.navigate_confirmation.confirm.subscribe((result: boolean) => {
          this.confirmResult = result;
          setTimeout(() => this.confirmResult = null, 0); 
          resolve(result);  // Resolve the promise based on user confirmation
        });
      });
    }
    return true;
  }

  ngOnInit(): void {
    this.is_new_customer = !this.activatedRoute.snapshot.queryParamMap.has('id');
    if(!this.is_new_customer)
    {
      this.title = "Edit Customer";
      this.newCustomerMode = false;
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getCustomer(id);
    }
  }

  getCustomer(id: number){
    this.customersService.getCustomer(id).subscribe(
    {
      next: (customer: Customer) => {
        //failed to fetch material with ID, returned an empty object
        if(Object.keys(customer).length == 0) {
          this.gotoCustomersList("Could not find customer with ID " + id, true);
          return;
        }

        this.customerItem = customer;
        this.cacheCustomerBanksInitialData();
        this.recalculateBanks();
        //console.log(customer);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  cacheCustomerBanksInitialData() {
    if(this.banks_loaded_quantities.length == 0 && this.customerItem.banks_baby_allocations.length > 0){
      this.banks_loaded_quantities = this.customerItem.banks_baby_allocations.map((a => ({
        allocation_id: a.id,
        bank_id: a.customer_bank_id,
        quantity: a.quantity
      })));
      //console.log("this.banks_loaded_quantities.length " + this.banks_loaded_quantities.length);
    }
    else {
      //("initial banks already loaded...");
    }
  }

  save()
  {
    this.customer_form.form.markAllAsTouched();
    if(this.customer_form.form.valid)
    {
      this.customer_form.form.markAsPristine();
      //this.processBankHistoryChanges();
      this.saveCustomer();
      /*
      //edit
      if(!this.is_new_customer)
      {
        const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
        this.updateCustomer(id, this.customerItem);
      }
      //add
      else
      {
        this.saveNewCustomer(this.customerItem);
      }
      */
    }
    else
    {
      let form = document.getElementById('raw_material_form');
      if(form){
        form.childNodes[0]
        let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
        firstInvalidControl.classList.remove("ng-invalid");
        firstInvalidControl.scrollIntoView();
        (firstInvalidControl as HTMLElement).focus();
        firstInvalidControl.classList.add("ng-invalid");
      }

      this.toastService.showError("Please fill all the mandatory fields before saving!");

    }
  }
/*
  saveNewCustomer(customer:Customer)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.customersService.saveNewCustomer(customer).subscribe(
      {
        next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoCustomersList(data['message'], false); },//this.getRawMaterials(this.current_page); },
        error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoCustomersList(error, true); }
      }
    );
  }*/
  processBankHistoryChanges(){
    this.customerItem.banks.forEach(bank => {
      let allocations_for_this_bank = this.customerItem.banks_baby_allocations.filter(alloc => alloc.customer_bank_id == bank.id);
      let initial_allocations_for_this_bank = this.banks_loaded_quantities.filter(alloc => alloc.bank_id == bank.id);

      let before_bank_quantities =  initial_allocations_for_this_bank.reduce((acc, alloc) => acc + alloc.quantity, 0);
      let after_bank_quantities =  allocations_for_this_bank.reduce((acc, alloc) => acc + alloc.quantity, 0);
      let diff = after_bank_quantities - before_bank_quantities;
      let bank_quantity = bank.quantity + diff;
/*
      allocation_id: a.id,
      bank_id: a.customer_bank_id,
      quantity: a.quantity
*/
      let new_allocations = allocations_for_this_bank.filter(alloc => (alloc.customer_bank_id == bank.id) &&  (initial_allocations_for_this_bank.findIndex(init => init.allocation_id == alloc.id ) < 0));
      let changed_allocations = allocations_for_this_bank.filter(alloc => initial_allocations_for_this_bank.findIndex(init => init.allocation_id == alloc.id) < 0);
    });

/*
    //sum up all the changes in the allocations
    let new_allocations = this.customerItem.banks_baby_allocations.filter(a => this.banks_loaded_quantities.findIndex(preloaded => preloaded.allocation_id == a.id) < 0);
    let changed_allocations = this.customerItem.banks_baby_allocations.filter(a => this.banks_loaded_quantities.findIndex(preloaded => preloaded.allocation_id == a.id && preloaded.quantity != a.quantity) >= 0);
    let deleted_allocations = this.banks_loaded_quantities.filter(preloaded => this.customerItem.banks_baby_allocations.findIndex(a => a.id == preloaded.allocation_id) < 0);

    let sum_added_allocations = new_allocations.reduce((acc, alloc) => acc + alloc.quantity, 0);
    let sum_changed_allocations = changed_allocations.reduce((acc, alloc) => {
      let preloaded_bank = this.banks_loaded_quantities.find(preloaded => preloaded.allocation_id == alloc.id);
      let diff = 0;
      if(preloaded_bank) {
        diff = alloc.quantity - preloaded_bank.quantity;
      }
      return acc + diff;
    }, 0);
    let sum_deleted_allocations = deleted_allocations.reduce((acc, alloc) => acc + alloc.quantity, 0);    
    
    console.log("SUM sum_added_allocations " + sum_added_allocations);
    console.dir(new_allocations);
    console.log("SUM sum_changed_allocations " + sum_changed_allocations);
    console.dir(changed_allocations);
    console.log("SUM sum_deleted_allocations " + sum_deleted_allocations);
    console.dir(deleted_allocations);
    
    new_allocations.forEach(new_allocation => {
      let bank = this.customerItem.banks.find(b => b.id == new_allocation.customer_bank_id);
      this.customerItem.transaction_history.push({
        id: 0,
        raw_material_name: bank!.raw_material_name,
        customer_name: this.customerItem.name,
        transaction_type: TransactionType.customer_bank_allocate_to_Work,
        transaction_quantity: new_allocation.quantity,
        raw_material_id: bank!.raw_material_id,
        customer_id: this.customerItem.id,
        customer_bank_id: bank!.id,
        customer_banks_babies_id: new_allocation.id,
        cur_raw_material_quantity: 0,
        cur_customer_bank_quantity: 0,
        cur_banks_babies_allocation_quantity: 0,
        date: undefined,
        added_by: 0
      })
    });
    
    return;
    //go through the banks
    // check if the bank is
    //  - new
    //  - changed
    //  - deleted
    
/*
    let sum_changed_allocations = 0;
    this.customerItem.banks_baby_allocations.forEach(alloc => {
      let original_allocation = this.banks_loaded_quantities.find(preloaded => preloaded.allocation_id == alloc.id && preloaded.quantity != alloc.quantity);
      if(original_allocation) {
        sum_changed_allocations += (alloc.quantity - original_allocation.quantity); 
      }
    });
/*
    new_allocations.forEach(alloc => {
      let bank = this.customerItem.banks.find(b => b.id == alloc.customer_bank_id);
      this.createHistoryRecord(
        bank!.raw_material_name, 
        TransactionType.customer_bank_allocate_to_Work,
        alloc.quantity,
        bank!.raw_material_id,
        bank!.id,
        alloc.id,

      );
    });*/
  }
  
  createHistoryRecord(
    raw_material_name: string, 
    transaction_type: TransactionType, 
    transaction_quantity: number,
    raw_material_id:number,
    bank_id:number, 
    allocation_id:number,
    bank_quantity:number) {
    /*
      this.customerItem.transaction_history.push({
      raw_material_name: raw_material_name,
      customer_name: this.customerItem.name,
      transaction_type: transaction_type,
      transaction_quantity: transaction_quantity,
      raw_material_id: raw_material_id,
      customer_id: this.customerItem.id,
      customer_bank_id: bank_id,
      customer_banks_babies_id: allocation_id,
      cur_raw_material_quantity: 0,
      cur_customer_bank_quantity: 0,
      cur_banks_babies_allocation_quantity: 0,
      date: undefined,
      added_by: 1
    });
    */
  }

  saveCustomer()
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.customersService.saveCustomer(this.customerItem).subscribe(
    {
      next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoCustomersList(data['message'], false); },//this.getRawMaterials(this.current_page); },
      error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoCustomersList(error, true); }
    });
  }


  gotoCustomersList(textInfo: string = '', isError: Boolean = false) {
    //this.location.back();
    this.router.navigate(['inventory/customers'], {
      state: {
        info: { 
          textInfo: textInfo, 
          isError: isError 
        }
      },
    });
  }

  confirm_delete() {
    this.delete_confirmation.open();
  }

  ngAfterViewInit() {
    //---------------------------------------------------------------
    //Hack: focus on the autocomplete input, and hide the suggestions
    /*
    let autoCompleteInput = null;
    let autoCompleteSuggestionsBox = null;
    if(this.customerName && this.customerName.nativeElement)
    {
      let inputContainer =  this.customerName.nativeElement.getElementsByClassName("input-container");
      if(inputContainer && inputContainer.length > 0)
      {
        let inputsInContainer = inputContainer[0].getElementsByTagName("input");
        if(inputsInContainer && inputsInContainer.length > 0)
        {
          autoCompleteInput = inputsInContainer[0];
        }
      }
    }
    if(this.suggestions && this.suggestions.nativeElement)
    {
      let uls = this.suggestions.nativeElement.getElementsByTagName("ul");
      if(uls && uls.length)
      {
        autoCompleteSuggestionsBox = uls[0];
      }
    }
    setTimeout(() => {
      if(autoCompleteInput && autoCompleteSuggestionsBox){
        autoCompleteInput.focus();
        autoCompleteSuggestionsBox.replaceChildren();
      }
    }, 0)
    //End hack
    //---------------------------------------------------------------

    if(this.currency.itemsList){
      let curr = this.currency.itemsList.findByLabel(this.rawMaterialItem.currency);
      this.currency.select(curr);
    }*/

    this.delete_confirmation.confirm.subscribe((value: Boolean) => {
      this.customersService.deleteCustomer(this.customerItem.id).subscribe(
        {
          next:(data) => {
            this.gotoCustomersList(data['message'], false);
          }
        });
    });    
  }

  phoneChanged (event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const allowedPattern = /^[0-9]*$/;

    // Only allow characters that match the allowed pattern
    if (!allowedPattern.test(inputElement.value)) {
      inputElement.value = inputElement.value.replace(/[^0-9\-\+\(\)\ ]/g, ''); // Remove invalid characters
    }
  }

  recalculateBanks(){
    //let totalQuantity = this.banks.reduce((acc, cur) => acc + cur.quantity, 0);
    this.customerItem.banks.forEach(bank => {
      bank.remaining_quantity = bank.quantity;
      let allocated = this.customerItem.banks_baby_allocations.filter(alloc => alloc.customer_bank_id == bank.id).reduce((acc, cur) => acc + cur.quantity, 0);
      bank.remaining_quantity -= allocated;
    });
  }
}
