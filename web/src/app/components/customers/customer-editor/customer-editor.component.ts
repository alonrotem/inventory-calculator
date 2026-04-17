import { AfterViewInit, Component, ElementRef, OnInit,QueryList,ViewChild, ViewChildren } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Customer, Allocation_Baby, TransactionType, nameIdPair, RawMaterialNameColor } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition, faArrowLeft, faMoneyCheckDollar, faTriangleExclamation, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastService } from '../../../services/toast.service';
import { CustomersService } from '../../../services/customers.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable, tap } from 'rxjs';
import { CustomerBanksTableComponent } from '../customer-banks-table/customer-banks-table.component';
import { HatsCalculatorDialogComponent } from '../hats-calculator-dialog/hats-calculator-dialog.component';
import { StateService } from '../../../services/state.service';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { UnsavedChangesDialogComponent } from "../../common/unsaved-changes-dialog/unsaved-changes-dialog.component";
import { UsersService } from '../../../services/users.service';
import { HasPermissionPipe } from '../../../utils/pipes/has-permission.pipe';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { RawMaterialsService } from '../../../services/raw-materials.service';

@Component({
  selector: 'app-customer-editor',
  standalone: true,
  imports: [RouterModule, FormsModule, NgSelectModule, DateStrPipe,
    FaIconComponent, NgIf, NgFor, ConfirmationDialogComponent, AutocompleteLibModule,
    CustomerBanksTableComponent, HatsCalculatorDialogComponent, 
    UnsavedChangesDialogComponent, HasPermissionPipe, AsyncPipe],
  templateUrl: './customer-editor.component.html',
  styleUrl: './customer-editor.component.scss'
})
export class CustomerEditorComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit, HasUnsavedChanges {

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
    babies: [],
    customer_code: '',
    order_seq_number: 0,
    allow_calculation_advisor: undefined,
    is_demo_customer: false
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
  raw_materials_list: RawMaterialNameColor[] = [];
  raw_materials_info: RawMaterialNameColor[] = [];
  selected_raw_material_id: number | null = null;
  is_current_user_demo_customer: boolean = false;

  // for opening the unsave changes dialog
  private confirmResult: boolean | null = null;
  private modalSubscription: any; // Track the subscription

    user$ = this.usersService.user$.pipe(
      tap(user => {
        if (user) {
          this.is_current_user_demo_customer = user.is_demo_customer;
        }
      })
    );

  //@ViewChild("materialName", { read: ElementRef }) materialName!: ElementRef;
  @ViewChild("customerName", { read: ElementRef }) customerName! :ElementRef;
  @ViewChild('customer_form') customer_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;
  @ViewChild('hats_calculator') hats_calculator!: HatsCalculatorDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChild("raw_material_select") raw_material_select!: NgSelectComponent;
  @ViewChildren('customer_banks_tables') customer_banks_tables!: QueryList<CustomerBanksTableComponent>;
 
  constructor(
    private customersService: CustomersService, 
    private rawMaterialsService: RawMaterialsService,
    activatedRoute: ActivatedRoute,
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService,
    private usersService: UsersService,
    toastService: ToastService,
    stateService: StateService,
    router: Router
    ) { 
      super(toastService, stateService, router, activatedRoute);

      this.rawMaterialsService.getRawMaterialNamesColors(0).subscribe({
        next: (raw_materials: RawMaterialNameColor[]) => {
          this.raw_materials_info = raw_materials;
          raw_materials.forEach(m => this.insert_material_to_selector(m.id));
        },
        error: (error) => { console.log(error); }
      });      
  }

  insert_material_to_selector(raw_material_id: number){
    const raw_material = this.raw_materials_info.find(m => m.id == raw_material_id);
    if(!raw_material || this.raw_materials_list.some(m => Number(m.id) === Number(raw_material_id))){
      return;
    }

    this.raw_materials_list = [
      ...this.raw_materials_list,
      { 
        id: raw_material.id, name: 
        raw_material.name, 
        color: raw_material.color, 
        allow_shortening_babies_in_pairs: raw_material.allow_shortening_babies_in_pairs 
      }
    ].sort((a, b) => a.name.localeCompare(b.name));
  }

  bankOfRawMaterialAdded(raw_material_id: number){
    this.raw_materials_list = this.raw_materials_list.filter(m => Number(m.id) !== Number(raw_material_id));
  }

  bankDeleted(bank_id: number){
    this.insert_material_to_selector(bank_id);
    this.recalculateBanks();
  }

  customer_updated(customer: Customer){
    this.customerItem = {...customer};
    this.recalculateBanks();
  }
  
  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () =>
        !this.customer_form.pristine || this.customer_banks_tables.some(t => t.unsaved_changes),

      saveFn: () => this.customersService.saveCustomer(this.customerItem),

      confirmationDialog: this.unsaved_changes_dialog
    });
  }

  ngOnInit(): void {
    //console.log("customer editor init with query params:"); console.dir(this.activatedRoute.snapshot.queryParamMap);
    this.is_new_customer = !this.activatedRoute.snapshot.queryParamMap.has('id');
    //console.dir(this.activatedRoute.snapshot.queryParamMap);
    if(!this.is_new_customer)
    {
      this.title = "Edit Customer";
      this.newCustomerMode = false;
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getCustomer(id);
    }
    else {
      this.usersService.user$.subscribe({ next: (loggedInUser)=> { 
        if(loggedInUser && loggedInUser.is_demo_customer){
          this.title = "Demo customer playground";
          this.getDemoCustomerByUserId(loggedInUser.id);
        }
      }
      });
    }
  }

  materialPicked(raw_material: number | string | nameIdPair | null | undefined){
    if(raw_material == null){
      return;
    }

    const raw_material_id = typeof raw_material === 'object' ? Number(raw_material.id) : Number(raw_material);
    if(Number.isNaN(raw_material_id)){
      return;
    }
    const selected_raw_material = this.raw_materials_info.find(m => Number(m.id) === raw_material_id);

    this.raw_materials_list = this.raw_materials_list.filter(m => Number(m.id) !== raw_material_id);
    this.selected_raw_material_id = null;
    this.raw_material_select.handleClearClick();

    this.customerItem.banks.push({
      raw_material_name: selected_raw_material!.name,
      raw_material_color: selected_raw_material!.color,
      raw_material_quantity_units: 'units',
      allow_shortening_babies_in_pairs: selected_raw_material!.allow_shortening_babies_in_pairs,
      pre_save_id: 0,
      id: 0,
      customer_id: this.customerItem.id,
      raw_material_id: selected_raw_material!.id,
      quantity: 1000000,
      remaining_quantity: 1000000,
      transaction_history: []
    });
  }

  getCustomer(id: number){
    this.customersService.getCustomer(id).subscribe(
    {
      next: (customer: Customer) => {
        if(customer.is_demo_customer){
          this.title = "Demo customer playground";
        }
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

  getDemoCustomerByUserId(user_id: number){
    this.customersService.getDemoCustomerByUserId(user_id).subscribe(
    {
      next: (customer: Customer) => {
        /*
        if(Object.keys(customer).length == 0) {
          // no demo customer for this user, stay in new customer mode
          return;
        }
        */
        this.customerItem = customer;
        this.cacheCustomerBanksInitialData();
        this.recalculateBanks();
      },
      error: (error) => {
        console.log(error);
      }
    });
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
  }

  saveCustomer()
  {
    this.btn_save.nativeElement.classList.add("disabled");
    //console.log("saving customer:");
    //console.dir(this.customerItem);
    this.customersService.saveCustomer(this.customerItem).subscribe(
    {
      next:(data) => { 
        //console.log("SAVED CUSTOMER !!!"); console.dir(data["customer"]);
        this.customer_form.form.markAsPristine();
        this.customer_banks_tables.forEach(b => { b.unsaved_changes = false });
        this.btn_save.nativeElement.classList.remove("disabled"); 
        if(!this.is_current_user_demo_customer){
          this.gotoCustomersList(data['message'], false);
        }
        else {
          //console.log("Demo customer saved, showing toast message and staying on page...");
          //this.router.navigate([this.router.url, 'open']);
          this.reloadTheSamePageWithToastMessage(data["message"], false);
        }
      },//this.getRawMaterials(this.current_page); },
      error:(error) => { 
        //console.log("ERRRR:"); console.dir(error.error.message);
        this.btn_save.nativeElement.classList.remove("disabled"); 
        this.toastService.showError("Server error saving customer");
        //this.gotoCustomersList(error, true); 
      }
    });
  }


  gotoCustomersList(textInfo: string = '', isError: boolean = false) {
    console.dir(this.customerItem);
    if(this.customerItem.is_demo_customer){
      this.navigateWithToastMessage("", textInfo, isError);
    }
    else {
      this.navigateWithToastMessage("inventory/customers", textInfo, isError);
    }
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

  customer_bank_babies_updated(newBabies: Allocation_Baby[]){
    this.customerItem.babies = newBabies;
    this.recalculateBanks();
  }

  openHatsCalculator() {
    if(!this.activatedRoute.snapshot.queryParamMap.has('id') && this.customerItem && this.customerItem.id){
      this.router.navigate(['/inventory/customer/hat-calculator'], {
        queryParams: {
          "id": this.customerItem.id
      }
    });
    }
    else {
      this. router.navigate(['/inventory/customer/hat-calculator'], {queryParamsHandling:'preserve'});
    }
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
