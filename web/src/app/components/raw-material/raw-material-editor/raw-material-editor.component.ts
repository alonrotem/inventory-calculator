import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Location, NgFor, NgIf } from '@angular/common';
import { Country, Currency, RawMaterial } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { DatePipe } from '@angular/common';
//import { BabiesTableComponent } from '../../babies/babies-table/babies-table.component';
import { InfoService } from '../../../services/info.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastService } from '../../../services/toast.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable } from 'rxjs';
import { RawMaterialCustomerTableComponent } from '../raw-material-customer-table/raw-material-customer-table.component';


@Component({
  selector: 'app-raw-material-editor',
  standalone: true,
  imports: [ 
    RouterModule, RouterLink, RouterOutlet, FormsModule, 
    DatePipe, NgSelectModule, DateStrPipe, 
    FaIconComponent, NgIf, ConfirmationDialogComponent, NgFor, AutocompleteLibModule, RawMaterialCustomerTableComponent
  ],
  templateUrl: './raw-material-editor.component.html',
  styleUrl: './raw-material-editor.component.scss'
})
export class RawMaterialEditorComponent implements OnInit, AfterViewInit, HasUnsavedChanges {

  public rawMaterialItem : RawMaterial = {
    id: 0,
    name: "",
    purchased_at: new Date(),
    weight: 0,
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0,
    units: 0,
    units_per_kg: 0,
    vendor_name: '',
    origin_country: 'US',
    price: 0,
    currency: 'USD',
    notes: '',
    created_at: new Date(),
    customer_banks: []
  }

  countries: Country[] = [];
  currencies: Currency[] = [];
  title: string = "Create Raw Material";
  newMaterialMode: boolean = true;
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowLeft: IconDefinition = faArrowLeft;
  is_new_material: Boolean = true;
  raw_material_names: string[] = [];
  private confirmResult: boolean | null = null;

  //@ViewChild("materialName", { read: ElementRef }) materialName!: ElementRef;
  @ViewChild("materialName", { read: ElementRef }) materialName! :ElementRef;
  @ViewChild("suggestions", { read: ElementRef }) suggestions!: ElementRef;
  @ViewChild("purchasedAt", { read: ElementRef }) purchase_date!: ElementRef;
  @ViewChild("radioWeight", { read: ElementRef }) radioWeight!: ElementRef;
  @ViewChild("radioUnits", { read: ElementRef }) radioUnits!: ElementRef;
  @ViewChild("materialWeight", { read: ElementRef }) materialWeight!: ElementRef;
  @ViewChild("materialUnits", { read: ElementRef }) materialUnits!: ElementRef;
  @ViewChild('raw_material_form') raw_material_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('navigate_confirmation') navigate_confirmation!: ConfirmationDialogComponent;
  //@ViewChild('babies_table') babies_table!: BabiesTableComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChild("price", { read: ElementRef }) price!: ElementRef;
  @ViewChild("currency") currency!: NgSelectComponent;
  
  
  constructor(private rawMaterialsService: RawMaterialsService, private infoService: InfoService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router, private toastService: ToastService) { 
    this.rawMaterialsService.getRawMaterialNames().subscribe({
      next: (names)=> {
        this.raw_material_names = names;
      }
    });
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
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  save()
  {
    this.raw_material_form.form.markAllAsTouched();
    if((this.raw_material_form.form.valid) && (this.checkUnitsOrWeight() == true))
    {
      this.raw_material_form.form.markAsPristine();
      this.rawMaterialItem.purchased_at =  new Date(this.purchase_date.nativeElement.value); //.toISOString()
      //edit
      if(!this.is_new_material)
      {
        const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
        this.updateRawMaterial(id, this.rawMaterialItem);
      }
      //add
      else
      {
        this.saveNewRawMaterial(this.rawMaterialItem);
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

    this.rawMaterialsService.updateRawMaterial(material).subscribe(
    {
      next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(data['message'], false); },//this.getRawMaterials(this.current_page); },
      error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoMaterialsList(error, true); }
    });
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


  gotoMaterialsList(textInfo: string = '', isError: Boolean = false) {
    //this.location.back();
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
    if(this.materialName && this.materialName.nativeElement)
    {
      let inputContainer =  this.materialName.nativeElement.getElementsByClassName("input-container");
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
    }

    this.delete_confirmation.confirm.subscribe((value: Boolean) => {
      this.rawMaterialsService.deleteRawMaterial(this.rawMaterialItem.id).subscribe(
        {
          next:(data) => {
            this.gotoMaterialsList(data['message'], false);
          }
        });
    });    
  }
}
