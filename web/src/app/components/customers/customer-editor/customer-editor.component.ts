import { AfterViewInit, Component, ElementRef, OnInit,QueryList,ViewChild, ViewChildren } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Customer, Customer_Baby, TransactionType } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition, faArrowLeft, faMoneyCheckDollar, faTriangleExclamation, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastService } from '../../../services/toast.service';
import { CustomersService } from '../../../services/customers.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { first, Observable } from 'rxjs';
import { CustomerBanksTableComponent } from '../customer-banks-table/customer-banks-table.component';
import { HatsCalculatorDialogComponent } from '../hats-calculator-dialog/hats-calculator-dialog.component';
import { AllocationPickerComponent } from '../allocation-picker/allocation-picker.component';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { WingsService } from '../../../services/wings.service';
import { StateService } from '../../../services/state.service';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { UnsavedChangesDialogComponent } from "../../common/unsaved-changes-dialog/unsaved-changes-dialog.component";

@Component({
  selector: 'app-customer-editor',
  standalone: true,
  imports: [RouterModule, FormsModule, NgSelectModule, DateStrPipe,
    FaIconComponent, NgIf, NgFor, ConfirmationDialogComponent, AutocompleteLibModule,
    CustomerBanksTableComponent, HatsCalculatorDialogComponent, AllocationPickerComponent, FilterPipe, UnsavedChangesDialogComponent],
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
  faCalculator: IconDefinition = faCalculator;
  is_new_customer: Boolean = true;
  banks_loaded_quantities: any[] = [];

  // for opening the unsave changes dialog
  private confirmResult: boolean | null = null;
  private modalSubscription: any; // Track the subscription

  //@ViewChild("materialName", { read: ElementRef }) materialName!: ElementRef;
  @ViewChild("customerName", { read: ElementRef }) customerName! :ElementRef;
  @ViewChild('customer_form') customer_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;
  @ViewChild('hats_calculator') hats_calculator!: HatsCalculatorDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChildren('customer_banks_tables') customer_banks_tables!: QueryList<CustomerBanksTableComponent>;
 
  constructor(
    private customersService: CustomersService, 
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private toastService: ToastService,
    private stateService: StateService,
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService
    ) { 
  }
  
  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () =>
        !this.customer_form.pristine || this.customer_banks_tables.some(t => t.unsaved_changes),

      saveFn: () => this.customersService.saveCustomer(this.customerItem),

      confirmationDialog: this.unsaved_changes_dialog
    });
  }


  
/*
  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    const banksUnsaved = this.customer_banks_tables.find(t => t.unsaved_changes);
  
    if (!this.customer_form.pristine || banksUnsaved) {
      // Wrap the confirmation and follow-up call in a single Observable
      return new Observable<boolean>((observer) => {
        this.confirmResult = null;
        this.navigate_confirmation.open();
  
        const sub = this.navigate_confirmation.confirm
          .pipe(first()) // take the first result only
          .subscribe((confirmed: boolean) => {
            this.confirmResult = confirmed;
            setTimeout(() => this.confirmResult = null, 0);
  
            if (confirmed) {
              // 👇 call your HTTP service here
              this.customersService.saveCustomer(this.customerItem).subscribe({
                next: (serviceResult) => {
                  console.dir(serviceResult);
                  this.stateService.setState({ message: serviceResult.message, isError: false });
                  observer.next(serviceResult);
                  observer.complete();
                },
                error: () => {
                  this.stateService.setState({ message: "Error saving customer data", isError: true });
                  observer.next(false);
                  observer.complete();
                }
              });
            } else {
              observer.next(false);
              observer.complete();
            }
          });
  
        // Optional: clean up subscription if needed
        return () => sub.unsubscribe();
      });
    }
    return true;
  }
*/

  ngOnInit(): void {
    this.is_new_customer = !this.activatedRoute.snapshot.queryParamMap.has('id');
    //console.dir(this.activatedRoute.snapshot.queryParamMap);
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
    }
  }

  save()
  {
    this.customer_form.form.markAllAsTouched();
    if(this.customer_form.form.valid)
    {
      this.customer_form.form.markAsPristine();
      this.saveCustomer();
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

  processBankHistoryChanges(){
    this.customerItem.banks.forEach(bank => {
      let allocations_for_this_bank = this.customerItem.banks_baby_allocations.filter(alloc => alloc.customer_bank_id == bank.id);
      let initial_allocations_for_this_bank = this.banks_loaded_quantities.filter(alloc => alloc.bank_id == bank.id);

      let before_bank_quantities =  initial_allocations_for_this_bank.reduce((acc, alloc) => acc + alloc.quantity, 0);
      let after_bank_quantities =  allocations_for_this_bank.reduce((acc, alloc) => acc + alloc.quantity, 0);
      let diff = after_bank_quantities - before_bank_quantities;
      let bank_quantity = bank.quantity + diff;

      let new_allocations = allocations_for_this_bank.filter(alloc => (alloc.customer_bank_id == bank.id) &&  (initial_allocations_for_this_bank.findIndex(init => init.allocation_id == alloc.id ) < 0));
      let changed_allocations = allocations_for_this_bank.filter(alloc => initial_allocations_for_this_bank.findIndex(init => init.allocation_id == alloc.id) < 0);
    });
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
    console.log("saving customer:");
    console.dir(this.customerItem);
    this.customersService.saveCustomer(this.customerItem).subscribe(
    {
      next:(data) => { 
        this.customer_banks_tables.forEach(b => { b.unsaved_changes = false });
        this.btn_save.nativeElement.classList.remove("disabled"); this.gotoCustomersList(data['message'], false); },//this.getRawMaterials(this.current_page); },
      error:(error) => { 
        console.log("ERRRR:"); console.dir(error.error.message);
        this.btn_save.nativeElement.classList.remove("disabled"); 
        this.toastService.showError("Server error saving customer");
        //this.gotoCustomersList(error, true); 
      }
    });
  }


  gotoCustomersList(textInfo: string = '', isError: Boolean = false) {
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

  customer_bank_babies_updated(newBabies: Customer_Baby[]){
    this.customerItem.babies = newBabies;
    this.recalculateBanks();
  }

  openHatsCalculator() {
    this. router.navigate(['/inventory/customer/hat-calculator'], {queryParamsHandling:'preserve'});
    //this.router.navigate([, this.customerItem.id]);
    /*
    this.hats_calculator.customer = this.customerItem;
    this.hats_calculator.dialog.btnSaveClass="d-none" ;
    this.hats_calculator.dialog.btnCancelClass="btn-primary m-auto";
    this.hats_calculator.dialog.modalTitle="<span class='icon-calculator1'></span> Hats Calculator";
    this.hats_calculator.dialog.modalSize="xl";
    this.hats_calculator.banks = this.customerItem.banks;
    this.hats_calculator.banks_baby_allocations = this.customerItem.banks_baby_allocations;
    this.hats_calculator.babies = this.customerItem.babies;
    this.hats_calculator.open();
    */
  }
}
