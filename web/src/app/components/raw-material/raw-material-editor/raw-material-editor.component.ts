import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Location, NgFor, NgIf } from '@angular/common';
import { Country, Currency, RawMaterial, RawMaterialCustomerBank, TransactionType } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { DatePipe } from '@angular/common';
import { InfoService } from '../../../services/info.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition, faArrowLeft, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastService } from '../../../services/toast.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable } from 'rxjs';
import { RawMaterialCustomerTableComponent } from '../raw-material-customer-table/raw-material-customer-table.component';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { RawMaterialQuantityDialogComponent } from '../raw-material-quantity-dialog/raw-material-quantity-dialog.component';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { RawMaterialHistoryDialogComponent } from '../raw-material-history-dialog/raw-material-history-dialog.component';


@Component({
  selector: 'app-raw-material-editor',
  standalone: true,
  imports: [ 
    RouterModule, RouterLink, RouterOutlet, FormsModule, 
    DatePipe, NgSelectModule, DateStrPipe, 
    FaIconComponent, NgIf, ConfirmationDialogComponent, NgFor, AutocompleteLibModule, 
    RawMaterialCustomerTableComponent, ModalDialogComponent, RawMaterialQuantityDialogComponent,
    RawMaterialHistoryDialogComponent
  ],
  templateUrl: './raw-material-editor.component.html',
  styleUrl: './raw-material-editor.component.scss'
})
export class RawMaterialEditorComponent implements OnInit, AfterViewInit, HasUnsavedChanges {

  public rawMaterialItem : RawMaterial = {
    id: 0,
    name: "",
    purchased_at: new Date(),
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0,
    units_per_kg: 0,
    vendor_name: '',
    origin_country: 'US',
    price: 0,
    currency: 'USD',
    notes: '',
    created_at: new Date(),
    purchase_quantity: 0,
    remaining_quantity: 0,
    quantity_units: 'kg',
    customer_banks: [],
    transaction_record: null
  }

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
  is_new_material: Boolean = true;
  raw_material_names: string[] = [];
  confirmResult: boolean | null = null;
  purchaseQuantity: number = 0;
  remainingQuantity: number = 0;
  lock_quantity_control: boolean = false;
  show_tooltip = false;

  // keeping track of changes, for the history records
  initial_quantity = 0;
  initial_remaining = 0;
  initial_in_banks: number = 0;
  initial_totals_per_bank: any[] = [];
  insufficient_quantity_for_banks: boolean = false;
  curr_total_in_banks: number = 0;

  @ViewChild("materialName", { read: ElementRef }) materialName! :ElementRef;
  @ViewChild("suggestions", { read: ElementRef }) suggestions!: ElementRef;
  @ViewChild("purchasedAt", { read: ElementRef }) purchase_date!: ElementRef;
  @ViewChild('raw_material_form') raw_material_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('navigate_confirmation') navigate_confirmation!: ConfirmationDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChild("price", { read: ElementRef }) price!: ElementRef;
  @ViewChild("currency") currency!: NgSelectComponent;
  @ViewChild("tooltip", { read: ElementRef }) tooltip!: ElementRef;
  @ViewChild('modalContent') quantityDialogContent!: RawMaterialQuantityDialogComponent
  @ViewChild('quantityDialog') quantityDialog! :ModalDialogComponent;
  @ViewChild('history_dialog') history_dialog!: RawMaterialHistoryDialogComponent;
  
  /*
  Transaction history:
  * Allow change raw mterial quantity only with new material, or old material without customer banks
  * For old material with customer banks, allow add only
  * On save:
    if the quantity has changed, add a raw_material_purchase record
    Remaining quantity will be set on this screen autocalculated
    With new customer banks, add a to_customer_bank record
    changing a customer banks, add a to_customer_bank (with + or -)

initial_quantity: 200
initial_remaining = 157
initial_in_banks: 43
quantity_per_bank []

quantity 200 -> 220
remaining: 157
banks: 43 -> 63

save:
if(quantity != initial_quantity)
	save record:
		transaction quantity = quantity - initial_quantity (20)
		current quantity: quantity (220)

if(banks != initial_in_banks)
	counting_quantity = quantity (220)
	for each bank b ->
		counting_quantity -= bank_quantity
		if(bank_quantity_changed or bank is new)
			save record:
				transaction_qnaitity: bank_quantity - initial_bank_quantity
				raw_quantity = counting_quantity
				bank_quantity: bank_quantity
    */
  
  constructor(private rawMaterialsService: RawMaterialsService, private infoService: InfoService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router, private toastService: ToastService) { 
    this.rawMaterialsService.getRawMaterialNames().subscribe({
      next: (names)=> {
        this.raw_material_names = names;
      }
    });
    this.rawMaterialsService.getRawMaterialQuantityUnits().subscribe({
      next: (quantity_units)=> {
        this.quantity_units = quantity_units;
      }
    });
  }

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(event : any) {
    if(this.show_tooltip){
      this.tooltip.nativeElement.style.top = (event.pageY + 19) + "px";
      this.tooltip.nativeElement.style.left = (event.pageX + 12) + "px";
      this.tooltip.nativeElement.style.display = "block";
    }
    else {
      this.tooltip.nativeElement.style.display = "none";
      this.tooltip.nativeElement.style.top = "0px";
      this.tooltip.nativeElement.style.left = "0px";
    }
  }

  showTooltip(content: string){
    this.tooltip.nativeElement.innerHTML = content;
    this.show_tooltip = true;
  }
  hideTooltip (){
    this.show_tooltip = false;
  }

  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.raw_material_form.pristine) {
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
    this.is_new_material = !this.activatedRoute.snapshot.queryParamMap.has('id');
    if(!this.is_new_material)
    {
      this.title = "Edit Raw Material";
      this.newMaterialMode = false;
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getRawMaterial(id);
    }
    this.getCountries();
    this.getCurrencies();
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
        this.rawMaterialItem = rawMaterial;
        this.initial_quantity = rawMaterial.purchase_quantity;
        this.initial_remaining = rawMaterial.remaining_quantity;
        this.initial_in_banks = rawMaterial.customer_banks.reduce((n, {quantity}) => n + quantity, 0);
        this.initial_totals_per_bank = rawMaterial.customer_banks.map(b => ({ bank_id: b.id, bank_quantity: b.quantity  }));

        this.recalculateRemaining();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  save()
  {
    this.raw_material_form.form.markAllAsTouched();
    if((this.raw_material_form.form.valid) && (!this.insufficient_quantity_for_banks))
    {
      this.raw_material_form.form.markAsPristine();
      this.rawMaterialItem.purchased_at =  new Date(this.purchase_date.nativeElement.value); //.toISOString()
      
      let added_to_banks_since_last_load = 0;
      this.rawMaterialItem.customer_banks.forEach((bank: RawMaterialCustomerBank) => {
        let initial_bank_data = this.initial_totals_per_bank.find(b => b.bank_id == bank.id);
        let initial_bank_quantity = (initial_bank_data)? initial_bank_data.bank_quantity : 0 ;
        added_to_banks_since_last_load += (bank.quantity - initial_bank_quantity);
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
          customer_banks_babies_id: 0,
          cur_raw_material_quantity: this.rawMaterialItem.remaining_quantity + added_to_banks_since_last_load,
          cur_customer_bank_quantity: -1,
          cur_banks_babies_allocation_quantity: -1
        };
      }
      else {
        this.rawMaterialItem.transaction_record = null;
      }

      // bank quantities have changex
      if(this.curr_total_in_banks != this.initial_in_banks) {
        let counting_quantity = this.rawMaterialItem.remaining_quantity + added_to_banks_since_last_load;
        console.log("this.rawMaterialItem.remaining_quantity " + this.rawMaterialItem.remaining_quantity);
        console.log("added_to_banks_since_last_load " + added_to_banks_since_last_load);
        console.log("counting_quantity " + counting_quantity);
        
        let artificial_secs = 1;  //add artificial seconds, to make the records sequential
        this.rawMaterialItem.customer_banks.forEach(customer_bank => {
          
          let initial_bank_data = this.initial_totals_per_bank.find(b => b.bank_id == customer_bank.id);
          let initial_bank_quantity = (initial_bank_data)? initial_bank_data.bank_quantity : 0 ;

          counting_quantity -= (customer_bank.quantity-initial_bank_quantity);
          //this is a new bank, or the quantity has changed
          if(initial_bank_quantity != customer_bank.quantity){
            let date = new Date();
            date.setSeconds(date.getSeconds() + artificial_secs);
            customer_bank.transaction_record = {
              id: 0,
              date: date,
              added_by: 1,
              transaction_quantity: (customer_bank.quantity - initial_bank_quantity),
              transaction_type: TransactionType.to_customer_bank,
              raw_material_id: this.rawMaterialItem.id,
              customer_id: customer_bank.customer_id,
              customer_bank_id: customer_bank.id,
              customer_banks_babies_id: 0,
              cur_raw_material_quantity: counting_quantity,
              cur_customer_bank_quantity: customer_bank.quantity,
              cur_banks_babies_allocation_quantity: -1              
            };
          }
          artificial_secs++;
        });
      }
      this.btn_save.nativeElement.classList.add("disabled");

      this.rawMaterialsService.save(this.rawMaterialItem).subscribe(
        {
          next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(data['message'], false); },//this.getRawMaterials(this.current_page); },
          error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(error, true); }
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
  }
  /*
  saveNewRawMaterial(material:RawMaterial)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.rawMaterialsService.saveNewRawMaterial(material).subscribe(
      {
        next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(data['message'], false); },//this.getRawMaterials(this.current_page); },
        error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(error, true); }
      }
    );
  }

  updateRawMaterial(id: number, material:RawMaterial)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.rawMaterialsService.saveRawMaterial(material).subscribe(
    {
      next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(data['message'], false); },//this.getRawMaterials(this.current_page); },
      error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(error, true); }
    });
  }
*/
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

  confirm_delete() {
    this.delete_confirmation.open();
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

    if(this.currency.itemsList) {
      let curr = this.currency.itemsList.findByLabel(this.rawMaterialItem.currency);
      this.currency.select(curr);
    }

    this.delete_confirmation.confirm.subscribe((value: Boolean) => {
      this.rawMaterialsService.deleteRawMaterial(this.rawMaterialItem.id).subscribe(
        {
          next:(data) => {
            this.gotoMaterialsList(data['message'], false);
          }
        });
    });
    this.quantityDialog.confirm.subscribe(() => { 
      let top_up = this.quantityDialogContent.top_up_quantity;
      if(top_up > 0) {
        this.rawMaterialItem.purchase_quantity += top_up;
        this.recalculateRemaining();
      }
    });
  }

  closedQuantityEditor(top_up: number){

  }

  recalculateRemaining() {
    //console.log("recalculateRemaining");
    this.curr_total_in_banks = this.rawMaterialItem.customer_banks.reduce((n, {quantity}) => n + quantity, 0);
    this.rawMaterialItem.remaining_quantity = this.rawMaterialItem.purchase_quantity - this.curr_total_in_banks;
    this.lock_quantity_control = this.curr_total_in_banks > 0;
    this.insufficient_quantity_for_banks = this.rawMaterialItem.remaining_quantity < 0;
  }

  openQuantityDialog(){
    //this.quantityDialogContent.remaining_quantity = this.rawMaterialItem.remaining_quantity;
    this.quantityDialog.dialog_content_component.editedObject = this.rawMaterialItem;
    this.quantityDialog.modalTitle = "+ Top up quantity";
    this.quantityDialog.open();
  }

  openHistoryDialog() {
    this.history_dialog.open(this.rawMaterialItem);
  }
}
