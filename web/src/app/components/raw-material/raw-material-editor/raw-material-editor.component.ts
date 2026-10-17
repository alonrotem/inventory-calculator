import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Country, Currency, RawMaterial, RawMaterialCustomerBank, RawMaterialBasicDetails, TransactionType, RawMaterialPurchase, Customers, Customer_Bank } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { DatePipe } from '@angular/common';
import { InfoService } from '../../../services/info.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition, faArrowLeft, faClockRotateLeft, faCartShopping, faArrowRightArrowLeft, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { AutocompleteComponent, AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastService } from '../../../services/toast.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable } from 'rxjs';
import { RawMaterialCustomerTableComponent } from '../raw-material-customer-table/raw-material-customer-table.component';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { RawMaterialQuantityDialogComponent } from '../raw-material-quantity-dialog/raw-material-quantity-dialog.component';
import { RawMaterialHistoryDialogComponent } from '../raw-material-history-dialog/raw-material-history-dialog.component';
import { UnsavedChangesDialogComponent } from "../../common/unsaved-changes-dialog/unsaved-changes-dialog.component";
import { StateService } from '../../../services/state.service';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { NumericInputDirective } from '../../../utils/directives/auto-numeric.directive';
import { SaveChangesButtonComponent } from "../../common/save-changes-button/save-changes-button.component";
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { CustomersService } from '../../../services/customers.service';
import { CapacityBarComponent } from '../capacity-bar/capacity-bar.component';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { TooltipDirective } from '../../common/tooltip/tooltip.directive';


@Component({
  selector: 'app-raw-material-editor',
  standalone: true,
  imports: [
    RouterModule, FormsModule,
    DatePipe, NgSelectModule, DateStrPipe, DecimalPipe,
    FaIconComponent, NgIf, ConfirmationDialogComponent, AutocompleteLibModule,
    RawMaterialCustomerTableComponent, RawMaterialQuantityDialogComponent,
    RawMaterialHistoryDialogComponent, NgClass,
    UnsavedChangesDialogComponent, NgFor, NumericInputDirective,
    SaveChangesButtonComponent,
    ModalDialogComponent,
    CapacityBarComponent, FilterPipe, TooltipDirective
],
  templateUrl: './raw-material-editor.component.html',
  styleUrl: './raw-material-editor.component.scss'
})
export class RawMaterialEditorComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit, HasUnsavedChanges {

  public rawMaterialItem : RawMaterial = {
    id: 0,
    name: "",
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0,
    created_at: new Date(),
    customer_banks: [],
    transaction_record: null,
    deleted_bank_records: [],
    color: '',
    allow_shortening_babies_in_pairs: false,
    is_usable_for_h_material: false,
    purchases: []
  }

  colors: string[] = [];
  countries: Country[] = [];
  currencies: Currency[] = [];
  quantity_units: string[] = [];
  title: string = "Create Raw Material";
  newMaterialMode: boolean = true;
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowLeft: IconDefinition = faArrowLeft;
  faClockRotateLeft : IconDefinition = faClockRotateLeft;
  faCartShopping: IconDefinition = faCartShopping;
  faArrowRightArrowLeft: IconDefinition = faArrowRightArrowLeft;
  faArrowDownShortWide: IconDefinition = faArrowDownShortWide;
  is_new_material: Boolean = true;
  raw_material_names: RawMaterialBasicDetails[] = [];
  confirmResult: boolean | null = null;
  purchaseQuantity: number = 0;
  remainingQuantity: number = 0;
  lock_quantity_control: boolean = false;

  // keeping track of changes, for the history records
  initial_quantity = 0;
  initial_remaining = 0;
  initial_in_banks: number = 0;
  initial_totals_per_bank: any[] = [];
  insufficient_quantity_for_banks: boolean = false;
  curr_total_in_banks: number = 0;
  console=console;

  customer_names: { id: number; name: string; }[] = [];
  purchase_edited_customer_id = 0;

  editedPurchase: RawMaterialPurchase = {
    id: 0,
    raw_material_id: 0,
    purchased_at: new Date(),
    purchase_quantity: 0,
    remaining_quantity: 0,
    quantity_units: 'units',
    units_per_kg: 0,
    vendor_name: '',
    origin_country: 'US',
    price: 0,
    currency: 'USD',
    notes: ''
  };

  edited_bank: RawMaterialCustomerBank = {
    id: 0,
    name: '',
    business_name: '',
    raw_material_purchase_id: 0,
    customer_id: 0,
    quantity: 0,
    remaining_quantity: 0,
    quantity_units: '',
    quantity_in_kg: 0,
    transaction_record: null,
    bank_in_use: false
  };
  new_purchase_counter = -1;
  new_bank_counter = -1;
  edited_bank_initial_quantity = 0;
  edited_purchase_initial_remaining_quantity = 0;
  min_bank_quantity = -Infinity;
  max_bank_quantity = Infinity;
  is_bank_saveable = false;
  is_bank_cancellable = false;

  @ViewChild("materialName", { read: ElementRef }) materialName! :ElementRef;
  @ViewChild("suggestions", { read: ElementRef }) suggestions!: ElementRef;
  @ViewChild("purchasedAt", { read: ElementRef }) purchase_date!: ElementRef;
  @ViewChild('raw_material_form') raw_material_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChild("price", { read: ElementRef }) price!: ElementRef;
  @ViewChild("currency") currency!: NgSelectComponent;
  @ViewChild('quantityDialog') quantityDialog!: RawMaterialQuantityDialogComponent
  @ViewChild('history_dialog') history_dialog!: RawMaterialHistoryDialogComponent;
  @ViewChild('customer_table') customer_table!: RawMaterialCustomerTableComponent;
  @ViewChild('save_changes_button') save_changes_button!: SaveChangesButtonComponent;
  @ViewChild('purchase_editor') purchase_editor!: ModalDialogComponent;
  @ViewChild("meter") meter!: CapacityBarComponent;
  @ViewChild("confirm_action") confirm_action!: ConfirmationDialogComponent;
  @ViewChild("customerAutocomplete") customerAutocomplete!: AutocompleteComponent;
  private last_customer_name_handled: string | null = null;
  
  constructor(
    private rawMaterialsService: RawMaterialsService, 
    private infoService: InfoService, 
    private location: Location, 
    activatedRoute: ActivatedRoute, 
    router: Router,
    toastService: ToastService,
    stateService: StateService,
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService,
    private customersService: CustomersService) { 
      super(toastService, stateService, router, activatedRoute);
      this.rawMaterialsService.getRawMaterialBasicDetails().subscribe({
        next: (names)=> {
          this.console.log(names);
          this.raw_material_names = names;
        }
      });
      this.rawMaterialsService.getRawMaterialQuantityUnits().subscribe({
        next: (quantity_units)=> {
          this.quantity_units = quantity_units;
        }
      });

      this.customersService.getCustomers({ } as any).subscribe({
        next: (customers: Customers) => {
        this.customer_names = customers.data.map((c) => { return { id: c.id, name: c.name } });
          //this.customers = customers.data;
        }
      });
  }

  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () =>
        { return (!this.raw_material_form.pristine || this.customer_table.unsaved_changes); },

      saveFn: () => this.rawMaterialsService.save(this.rawMaterialItem),

      confirmationDialog: this.unsaved_changes_dialog
    });
  }

  ngOnInit(): void {
    this.is_new_material = !this.activatedRoute.snapshot.queryParamMap.has('id');
    if(!this.is_new_material)
    {
      this.title = "Edit Raw Material";
      this.newMaterialMode = false;
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getRawMaterial(id);
    }
    this.get_colors();
    this.getCountries();
    this.getCurrencies();
  }

  get_colors(){
    this.rawMaterialsService.getRawMaterialColors().subscribe({
      next: (colors: string[]) => {
        //this.console.log("colorssss");
        //this.console.dir(colors);
        this.colors = colors;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getCountries(){
    this.infoService.getCountries().subscribe({
      next: (countries: Country[]) => {
        this.countries = countries;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getCurrencies(){
    this.infoService.getCurrencies().subscribe({
      next: (currencies: Currency[]) => {
        this.currencies = currencies;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getRawMaterial(id: number){
    this.rawMaterialsService.getRawMaterial(id).subscribe(
    {
      next: (rawMaterial: RawMaterial) => {
        //failed to fetch material with ID, returned an empty object
        if(Object.keys(rawMaterial).length == 0)
        {
          this.gotoMaterialsList("Could not find material with ID " + id, true);
          return;
        }
        else {
          this.rawMaterialItem = rawMaterial;
          //this.initial_quantity = rawMaterial.purchase_quantity;
          //this.initial_remaining = rawMaterial.remaining_quantity;
          this.initial_in_banks = rawMaterial.customer_banks.reduce((n, {quantity}) => n + quantity, 0);
          this.initial_totals_per_bank = rawMaterial.customer_banks.map(b => ({ 
            bank_id: b.id, 
            bank_name:b.name, 
            bank_quantity: b.quantity,
            quantity_in_kg: b.quantity_in_kg,
            customer_id: b.customer_id
          }));
          this.recalculateRemaining();
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  save(navigate_after_save: boolean = true){
    /*
    this.raw_material_form.form.markAllAsTouched();
    if((this.raw_material_form.form.valid) && (!this.insufficient_quantity_for_banks))
    {
      this.raw_material_form.form.markAsPristine();
      this.rawMaterialItem.purchased_at =  new Date(this.purchase_date.nativeElement.value);
      
      let added_to_banks_since_last_load = 0;
      this.rawMaterialItem.customer_banks.forEach((bank: RawMaterialCustomerBank) => {
        let initial_bank_data = this.initial_totals_per_bank.find(b => b.bank_id == bank.id);
        let initial_bank_quantity = (initial_bank_data)? 
          ((this.rawMaterialItem.quantity_units=="kg")? 
            ((initial_bank_data.quantity_in_kg)?             
              initial_bank_data.quantity_in_kg : 0) 
              : initial_bank_data.bank_quantity) 
            : 0;
        added_to_banks_since_last_load += (((this.rawMaterialItem.quantity_units=="kg")? bank.quantity_in_kg : bank.quantity) - initial_bank_quantity);
      });

      //purchased/reduced material
      if (this.rawMaterialItem.purchase_quantity != this.initial_quantity){
        this.rawMaterialItem.transaction_record = {
          id: 0,
          date: new Date(),
          added_by: 1,
          transaction_quantity: (this.rawMaterialItem.purchase_quantity - this.initial_quantity),
          transaction_type: TransactionType.raw_material_purchase,
          raw_material_id: this.rawMaterialItem.id,
          customer_id: 0,
          customer_bank_id: 0,
          allocation_id: 0,
          cur_raw_material_quantity: this.rawMaterialItem.remaining_quantity + added_to_banks_since_last_load,
          cur_customer_bank_quantity: -1,
          cur_banks_babies_allocation_quantity: -1
        };
      }
      else {
        this.rawMaterialItem.transaction_record = null;
      }

      let artificial_secs = 1;  //add artificial seconds, to make the records sequential
      // bank quantities have changex
      if(this.curr_total_in_banks != this.initial_in_banks) {
        let counting_quantity = this.rawMaterialItem.remaining_quantity + added_to_banks_since_last_load;
        //console.log("this.rawMaterialItem.remaining_quantity " + this.rawMaterialItem.remaining_quantity);
        //console.log("added_to_banks_since_last_load " + added_to_banks_since_last_load);
        //console.log("counting_quantity " + counting_quantity);
        
        this.rawMaterialItem.customer_banks.forEach(customer_bank => {
          
          let initial_bank_data = this.initial_totals_per_bank.find(b => b.bank_id == customer_bank.id);
          let initial_bank_quantity = (initial_bank_data)? 
            ((this.rawMaterialItem.quantity_units=="kg")? initial_bank_data.quantity_in_kg : initial_bank_data.bank_quantity)
            : 0 ;

          counting_quantity -= (this.rawMaterialItem.quantity_units=="kg")? (customer_bank.quantity_in_kg - initial_bank_quantity) : (customer_bank.quantity - initial_bank_quantity);
          //this is a new bank, or the quantity has changed
          let current_bank_quantity = (this.rawMaterialItem.quantity_units=="kg")? customer_bank.quantity_in_kg : customer_bank.quantity;
          if(initial_bank_quantity != current_bank_quantity){
            let date = new Date();
            date.setSeconds(date.getSeconds() + artificial_secs);
            customer_bank.transaction_record = {
              id: 0,
              date: date,
              added_by: 1,
              transaction_quantity: (current_bank_quantity - initial_bank_quantity),
              transaction_type: TransactionType.to_customer_bank,
              raw_material_id: this.rawMaterialItem.id,
              customer_id: customer_bank.customer_id,
              customer_bank_id: customer_bank.id,
              allocation_id: 0,
              cur_raw_material_quantity: counting_quantity,
              cur_customer_bank_quantity: customer_bank.remaining_quantity,
              cur_banks_babies_allocation_quantity: -1              
            };
          }
          artificial_secs++;
        });
      }
      let current_bank_ids = this.rawMaterialItem.customer_banks.filter(bank => bank.id > 0).map(bank => bank.id);
      let deleted_banks = this.initial_totals_per_bank.filter(bank => current_bank_ids.indexOf(bank.bank_id) < 0);
      let total_quantity_in_deleted_banks = deleted_banks.reduce((n, {bank_quantity}) => n + bank_quantity, 0);
      //let cur_raw_material_quantity = this.rawMaterialItem.remaining_quantity - total_quantity_in_deleted_banks;
      //console.log("quantity before banks were deleted: " + cur_raw_material_quantity);
      if(!this.rawMaterialItem.deleted_bank_records) {
        this.rawMaterialItem.deleted_bank_records = [];
      }
      deleted_banks.forEach(bank => {
        let date = new Date();
        date.setSeconds(date.getSeconds() + artificial_secs);
        //cur_raw_material_quantity += bank.bank_quantity;
        //console.log("Deleted costomer bank " + bank.bank_name + ", quantity " + bank.bank_quantity + " remaining "+ cur_raw_material_quantity);
        this.rawMaterialItem.deleted_bank_records.push({
          id: 0,
          date: date,
          added_by: 1,
          transaction_quantity: bank.bank_quantity,
          transaction_type: TransactionType.deleted_customer_bank,
          raw_material_id: this.rawMaterialItem.id,
          customer_id: bank.customer_id,
          customer_bank_id: bank.bank_id,
          allocation_id: 0,
          cur_raw_material_quantity: cur_raw_material_quantity,
          cur_customer_bank_quantity: 0,
          cur_banks_babies_allocation_quantity: 0
        });
        artificial_secs++;
      });

      this.btn_save.nativeElement.classList.add("disabled");

      this.rawMaterialsService.save(this.rawMaterialItem).subscribe(
        {
          next:(data) => { 
            this.raw_material_form.form.markAsPristine();
             this.customer_table.unsaved_changes = false;
            this.btn_save.nativeElement.classList.remove("disabled");
            if(navigate_after_save){
              this.gotoMaterialsList(data['message'], false); 
            }
            else {
              if(Number(this.activatedRoute.snapshot.queryParamMap.get('id'))){
                this.reloadTheSamePageWithToastMessage(data["message"], false);
              }
              else {
                this.reloadTheSamePageWithToastMessage(data["message"], false, { id: data["material"].id });
                this.toastService.showSuccess(data["message"]);
              }
              Object.assign(this.rawMaterialItem, data["material"]);
            }
          },
          error:(error) => { 
            this.btn_save.nativeElement.classList.remove("disabled"); 
            //this.gotoMaterialsList(error, true); 
            this.toastService.showError(error.error["message"]);
          }
        }
      );      
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
    */
  }

  gotoMaterialsList(textInfo: string = '', isError: Boolean = false) {
    this.router.navigate(['inventory/raw'], {
      state: {
        info: { 
          textInfo: textInfo, 
          isError: isError 
        }
      },
    });
  }

  async confirm_delete() {
    const confirmed = await this.delete_confirmation.open_with_message({
      modalText: `Are you sure you want to delete this raw material, ${this.rawMaterialItem.name}?`,
      modalTitle: "Delete confirmation",
      btnYesIcon: this.faTrashAlt,
      btnYesText: "Delete",
      btnYesClass: "btn-danger"
    });
    if(confirmed) {
      this.raw_material_form.form.markAsPristine();
      this.customer_table.unsaved_changes == false;
      this.rawMaterialsService.deleteRawMaterial(this.rawMaterialItem.id).subscribe(
        {
          next:(data) => {
            this.gotoMaterialsList(data['message'], false);
          }
        });
    }
  }

  ngAfterViewInit() {
    //---------------------------------------------------------------
    //Hack: focus on the autocomplete input, and hide the suggestions
    let autoCompleteInput = null;
    let autoCompleteSuggestionsBox = null;
    if(this.materialName && this.materialName.nativeElement) {
      let inputContainer =  this.materialName.nativeElement.getElementsByClassName("input-container");
      if(inputContainer && inputContainer.length > 0) {
        let inputsInContainer = inputContainer[0].getElementsByTagName("input");
        if(inputsInContainer && inputsInContainer.length > 0) {
          autoCompleteInput = inputsInContainer[0];
        }
      }
    }
    if(this.suggestions && this.suggestions.nativeElement) {
      let uls = this.suggestions.nativeElement.getElementsByTagName("ul");
      if(uls && uls.length) {
        autoCompleteSuggestionsBox = uls[0];
      }
    }
    setTimeout(() => {
      if(autoCompleteInput && autoCompleteSuggestionsBox){
        autoCompleteInput.focus();
        autoCompleteSuggestionsBox.replaceChildren();
      }
    }, 0);
    //End hack
    //---------------------------------------------------------------

    /*
    if(this.currency.itemsList) {
      let curr = this.currency.itemsList.findByLabel(this.rawMaterialItem.currency);
      this.currency.select(curr);
    }

    this.quantityDialog.dialogWrapper.confirm.subscribe(() => {
      let top_up = this.quantityDialog.editedObject.top_up_quantity;
      if(top_up > 0) {
        this.rawMaterialItem.purchase_quantity += top_up;
        this.recalculateRemaining();
      }
      this.raw_material_form.form.markAsDirty();
    });
    */
    this.raw_material_form.form.markAsPristine();
  }

  closedQuantityEditor(top_up: number){

  }

  recalculateRemaining() {
    /*
    //console.log("recalculateRemaining");
    this.curr_total_in_banks = (this.rawMaterialItem.quantity_units == "kg")? 
      this.rawMaterialItem.customer_banks.reduce((n, { quantity_in_kg }) => n + quantity_in_kg, 0) :
      this.rawMaterialItem.customer_banks.reduce((n, { quantity }) => n + quantity, 0);

    this.rawMaterialItem.remaining_quantity = this.rawMaterialItem.purchase_quantity - this.curr_total_in_banks;
    this.lock_quantity_control = this.curr_total_in_banks > 0;
    this.insufficient_quantity_for_banks = this.rawMaterialItem.remaining_quantity < 0;
    */
  }

  openQuantityDialog(){
    /*
    //this.quantityDialogContent.remaining_quantity = this.rawMaterialItem.remaining_quantity;
    this.quantityDialog.editedObject = {
      top_up_quantity: 0,
      current_quantity: this.rawMaterialItem.purchase_quantity,
      remaining_quantity: this.rawMaterialItem.remaining_quantity,
      quantity_units: this.rawMaterialItem.quantity_units,
      current_quantity_kg: 0, // this is just for banks
      max_topping: 0
    };
    this.quantityDialog.dialogWrapper.modalTitle = "+ Top up quantity";
    this.quantityDialog.rawMaterialQuantityUnits = this.rawMaterialItem.quantity_units;
    this.quantityDialog.show_units_to_kg_adjustment = false;
    this.quantityDialog.open();
    */
  }

  openHistoryDialog() {
    this.history_dialog.open(this.rawMaterialItem);
  }

  open_purchase_editor(purchase_id = 0) {
    this.purchase_editor.modalTitle = (purchase_id)? 'Edit purchase':'Add purchase';
    this.purchase_editor.btnSaveClass= "btn-success";
    this.purchase_editor.btnSaveIcon = faCartShopping;
    this.purchase_editor.btnSaveText = (purchase_id)? 'Save changes':'Add purchase';
    this.purchase_editor.btnCancelText = "Cancel";
    if(purchase_id!=0){
      this.editedPurchase = this.rawMaterialItem.purchases.find(p => p.id == purchase_id) ?? this.editedPurchase;
    }
    else {
      this.editedPurchase = {
        id: 0,
        raw_material_id: 0,
        purchased_at: new Date(),
        purchase_quantity: 0,
        remaining_quantity: 0,
        quantity_units: 'units',
        units_per_kg: 0,
        vendor_name: '',
        origin_country: 'US',
        price: 0,
        currency: 'USD',
        notes: ''
      };
    }
    this.lock_quantity_control = this.rawMaterialItem.customer_banks.filter(b => b.raw_material_purchase_id == purchase_id).length > 0;
    this.purchase_editor.open();
  }

  // Returns false if the user declined to discard the changes of the bank currently being edited
  async edit_bank(bank_id:number): Promise<boolean> {
    if(this.is_bank_saveable){
      if(!await this.verify_cancellation_of_unsaved_changes()){
        return false;
      }
    }
    let bank = this.rawMaterialItem.customer_banks.find(b => b.id == bank_id);
    if(bank) {
      this.edited_bank = JSON.parse(JSON.stringify(bank));
      this.console.log(this.edited_bank);
    }
    else {
      this.edited_bank = {
        id: this.new_bank_counter,
        name: '',
        business_name: '',
        raw_material_purchase_id: 0,
        customer_id: 0,
        quantity: 0,
        remaining_quantity: 0,
        quantity_units: '',
        quantity_in_kg: 0,
        transaction_record: null,
        bank_in_use: false
      };
    }
    this.last_customer_name_handled = null;
    this.edited_bank_initial_quantity = this.edited_bank.quantity;
    this.edited_purchase_initial_remaining_quantity = this.editedPurchase.remaining_quantity;
    this.meter.bankQuantity = this.edited_bank.quantity;
    this.meter.materialInUse = this.edited_bank.quantity - this.edited_bank.remaining_quantity;
    this.meter.totalCapacity = this.edited_bank.quantity + this.editedPurchase.remaining_quantity;
    this.max_bank_quantity = this.meter.totalCapacity;
    this.min_bank_quantity = this.meter.materialInUse;
    //console.log("min/man " + this.meter.totalCapacity + " - " + this.meter.materialInUse);
    this.meter.recalculate();
    this.checkIfBankIsSaveable();
    return true;
  }

  // Called by the customer tables, which only receive a (possibly filtered) copy of customer_banks
  delete_bank(bank: RawMaterialCustomerBank){
    const bankIndex = this.rawMaterialItem.customer_banks.findIndex(b => b.id == bank.id);
    if(bankIndex >= 0){
      this.rawMaterialItem.customer_banks.splice(bankIndex, 1);
      // The deleted bank's material goes back to the purchase
      if(bank.raw_material_purchase_id == this.editedPurchase.id){
        this.editedPurchase.remaining_quantity += bank.quantity;
      }
    }
  }

  customerBankQuantityChanged(quantity:number){
    this.edited_bank.quantity = quantity;
    this.editedPurchase.remaining_quantity = this.edited_purchase_initial_remaining_quantity - (quantity - this.edited_bank_initial_quantity);
    this.edited_bank.remaining_quantity = quantity - this.meter.materialInUse;

    this.meter.bankQuantity = this.edited_bank.quantity;
    this.meter.materialInUse = this.edited_bank.quantity - this.edited_bank.remaining_quantity;
    this.meter.totalCapacity = this.edited_bank.quantity + this.editedPurchase.remaining_quantity;
    this.meter.recalculate();
    this.checkIfBankIsSaveable();
    this.is_bank_cancellable = true;
  }

  checkIfBankIsSaveable(){
    let quantity_is_within_boundaries = (this.edited_bank.quantity >= this.min_bank_quantity) && (this.edited_bank.quantity <= this.max_bank_quantity);
    let is_new_bank = (this.edited_bank.customer_id <= 0);
    let quantity_changed = false;
    if(!is_new_bank){
      let unedited_bank = this.rawMaterialItem.customer_banks.find(b => b.id == this.edited_bank.id);
      quantity_changed = unedited_bank?.quantity != this.edited_bank.quantity;
    }

    this.is_bank_saveable = 
      ((quantity_is_within_boundaries) && 
       ((is_new_bank) || (!is_new_bank && quantity_changed))); 
  }

  async verify_cancellation_of_unsaved_changes(){
    let cancel = true;
    this.checkIfBankIsSaveable();
    if(this.is_bank_saveable){
      if(await this.confirm_action.open_with_message({
        modalText: "Are you sure you want to cancel the changes you made to this bank?",
        modalTitle: "Cancel changes",
        btnYesText: "Cancel changes",
        btnYesClass: "btn-danger"
      })) {
        this.clear_bank();
        cancel = true;
      }
      else {
        cancel = false;
      }
    }
    return cancel;
  }

  // keep_in_collection: pass true after saving, so a newly added (unsaved, negative id) bank is not discarded
  clear_bank(keep_in_collection: boolean = false){
    let edited_bank_quantity = this.edited_bank.quantity;
    let unedited_bank_quantity = 0;
    let unedited_bank = this.rawMaterialItem.customer_banks.find(b => b.id == this.edited_bank.id);
    unedited_bank_quantity = unedited_bank?.quantity ?? 0;


    this.editedPurchase.remaining_quantity += (edited_bank_quantity - unedited_bank_quantity);
    this.meter.bankQuantity = 0;
    this.meter.totalCapacity = 0;
    this.meter.materialInUse = 0;
    this.meter.recalculate();
    this.min_bank_quantity = 0;
    this.max_bank_quantity = Infinity;


    // Cancelling a newly added bank removes it from the collection. Existing banks are never touched.
    if(!keep_in_collection && this.edited_bank.id < 0){
      const bankIndex = this.rawMaterialItem.customer_banks.findIndex(b => b.id == this.edited_bank.id);
      if(bankIndex >= 0) {
        this.rawMaterialItem.customer_banks.splice(bankIndex, 1);
      }
    }

    this.edited_bank = {
      id: this.new_bank_counter,
      name: '',
      business_name: '',
      raw_material_purchase_id: 0,
      customer_id: 0,
      quantity: 0,
      remaining_quantity: 0,
      quantity_units: '',
      quantity_in_kg: 0,
      transaction_record: null,
      bank_in_use: false
    }    

    this.is_bank_saveable = false;
    this.is_bank_cancellable = false;
    this.purchase_edited_customer_id = 0;
    this.last_customer_name_handled = null;
  }

  // Triggered when the user types in the input box (string) or selects an item from the dropdown (object)
  async onCustomerChanged(val: string | { id: number; name: string } | null) {
    // The autocomplete's ngModel update (which overwrites edited_bank.name) runs after this synchronous part
    const previous_name = this.edited_bank.name;
    // The autocomplete can report the same value more than once (typing + selecting), so ignore repeats
    const name = ((val && typeof val === 'object') ? val.name : (val ?? '')).toLowerCase();
    if (name === this.last_customer_name_handled) {
      return;
    }
    this.last_customer_name_handled = name;
    console.log("customer changed ", val);
    if (val && typeof val === 'object') {
      this.purchase_edited_customer_id = val.id;
      // Typing: look for an exact match in the list. Otherwise, reset to 0.
      const match = this.customer_names.find(c => c.name.toLowerCase() === name);
      this.purchase_edited_customer_id = match ? match.id : 0;

      if(this.purchase_edited_customer_id){
        let existing_bank = this.rawMaterialItem.customer_banks.find(b => b.customer_id == this.purchase_edited_customer_id);
        if(existing_bank){
          if(!await this.edit_bank(existing_bank.id)){
            // User kept editing the current bank: put its name back
            this.edited_bank.name = previous_name;
            this.last_customer_name_handled = null;
          }
        }
        else {
          let bank: RawMaterialCustomerBank = {
            id: this.new_bank_counter--,
            name: val.name,
            business_name: '',
            raw_material_purchase_id: this.editedPurchase.id,
            customer_id: val.id,
            quantity: 0,
            remaining_quantity: 0,
            quantity_units: 'units',
            quantity_in_kg: 0,
            transaction_record: null,
            bank_in_use: false
          };
          this.rawMaterialItem.customer_banks.push(bank);
          if(!await this.edit_bank(bank.id)){
            // User kept editing the current bank: drop the bank we just added and put the name back
            const bankIndex = this.rawMaterialItem.customer_banks.findIndex(b => b.id == bank.id);
            if(bankIndex >= 0) {
              this.rawMaterialItem.customer_banks.splice(bankIndex, 1);
            }
            this.edited_bank.name = previous_name;
            this.last_customer_name_handled = null;
          }
        }
      }
    }
  }

  // The autocomplete's model is the selected item object when picking from the list, but a string when typing
  onCustomerModelChange(value: string | { id: number; name: string } | null) {
    this.edited_bank.name = (value && typeof value === 'object') ? value.name : (value ?? '');
  }

  // Triggered when the user clears the input completely
  async onCustomerCleared() {
    if(!await this.verify_cancellation_of_unsaved_changes()){        
      //revert the customer's name the user clared
      let unedited_bank = this.rawMaterialItem.customer_banks.find(b => b.id == this.edited_bank.id);
      if(unedited_bank){
        this.edited_bank.name = unedited_bank.name;
      }
      return;
    }
    this.clear_bank();
    // Wait for the modal to finish closing and the autocomplete to re-render, then focus it
    setTimeout(() => this.customerAutocomplete?.focus(), 300);
  }

  save_bank_changes(){
    if(this.is_bank_saveable){
      const bankIndex = this.rawMaterialItem.customer_banks.findIndex(b => b.id == this.edited_bank.id);
      if(bankIndex >= 0) {
        // Replace the item in the collection (reassigning a local variable would not update the array)
        this.rawMaterialItem.customer_banks[bankIndex] = JSON.parse(JSON.stringify(this.edited_bank));
      }
    }
    // The bank now lives in the collection, so only reset the editor
    this.clear_bank(true);
  }
}
