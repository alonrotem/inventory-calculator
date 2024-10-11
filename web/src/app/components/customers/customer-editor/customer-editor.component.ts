import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Location, NgFor, NgIf } from '@angular/common';
import { Country, Currency, Customer, RawMaterial } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { DatePipe } from '@angular/common';
import { BabiesTableComponent } from '../../babies/babies-table/babies-table.component';
import { InfoService } from '../../../services/info.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition, faArrowLeft, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastService } from '../../../services/toast.service';
import { CustomersService } from '../../../services/customers.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable } from 'rxjs';
import { CustomerBankTableComponent } from '../customer-bank-table/customer-bank-table.component';


@Component({
  selector: 'app-customer-editor',
  standalone: true,
  imports: [ RouterModule, RouterLink, RouterOutlet, FormsModule, 
    DatePipe, BabiesTableComponent, NgSelectModule, DateStrPipe, 
    FaIconComponent, NgIf, ConfirmationDialogComponent, NgFor, AutocompleteLibModule, CustomerBankTableComponent ],
  templateUrl: './customer-editor.component.html',
  styleUrl: './customer-editor.component.scss'
})
export class CustomerEditorComponent implements OnInit, AfterViewInit, HasUnsavedChanges {

  public customerItem : Customer = {
    id: 0,
    name: "",
    business_name: "",
    email: '',
    phone: '',
    tax_id: '',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0,
    banks: [],
    babies: []
  }

  title: string = "Create Customer";
  newCustomerMode: boolean = true;
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowLeft: IconDefinition = faArrowLeft;
  faMoneyCheckDollar: IconDefinition = faMoneyCheckDollar;
  is_new_customer: Boolean = true;

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
        this.customerItem = customer;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  save()
  {
    this.customer_form.form.markAllAsTouched();
    if(this.customer_form.form.valid)
    {
      this.customer_form.form.markAsPristine();
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

  saveNewCustomer(customer:Customer)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.customersService.saveNewCustomer(customer).subscribe(
      {
        next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoCustomersList(data['message'], false); },//this.getRawMaterials(this.current_page); },
        error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoCustomersList(error, true); }
      }
    );
  }

  updateCustomer(id: number, customer:Customer)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.customersService.updateCustomer(customer).subscribe(
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
}
