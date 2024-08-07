import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { Country, Currency, RawMaterial } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { DatePipe } from '@angular/common';
import { BabiesTableComponent } from '../../babies/babies-table/babies-table.component';
import { InfoService } from '../../../services/info.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-raw-material-editor',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterOutlet, FormsModule, DatePipe, BabiesTableComponent, NgSelectModule, DateStrPipe, FaIconComponent, NgIf, ConfirmationDialogComponent],
  templateUrl: './raw-material-editor.component.html',
  styleUrl: './raw-material-editor.component.scss'
})
export class RawMaterialEditorComponent implements OnInit, AfterViewInit {

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
    babies: []
  }

  countries: Country[] = [];
  currencies: Currency[] = [];
  title: string = "Create Raw Material";
  newMaterialMode: boolean = true;
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  is_new_material: Boolean = true;

  @ViewChild("purchasedAt", { read: ElementRef }) purchase_date!: ElementRef;
  @ViewChild("radioWeight", { read: ElementRef }) radioWeight!: ElementRef;
  @ViewChild("radioUnits", { read: ElementRef }) radioUnits!: ElementRef;
  @ViewChild("materialWeight", { read: ElementRef }) materialWeight!: ElementRef;
  @ViewChild("materialUnits", { read: ElementRef }) materialUnits!: ElementRef;
  @ViewChild('raw_material_form') raw_material_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('babies_table') babies_table!: BabiesTableComponent;
  
constructor(private rawMaterialsService: RawMaterialsService, private infoService: InfoService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) { 
  
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
  console.log(this.babies_table.babies);
  this.raw_material_form.form.markAllAsTouched();
  if(this.raw_material_form.form.valid)
  {
    this.rawMaterialItem.babies = this.babies_table.babies;
    this.rawMaterialItem.purchased_at =  new Date(this.purchase_date.nativeElement.value); //.toISOString()
    //edit
    if(!this.is_new_material)
    {
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      console.log("edit: ");
      console.log(this.rawMaterialItem);
      this.updateRawMaterial(id, this.rawMaterialItem);
    }
    //add
    else
    {
      console.log("add: ");
      console.log(this.rawMaterialItem);
      this.saveNewRawMaterial(this.rawMaterialItem);
    }
  }
}

saveNewRawMaterial(material:RawMaterial)
{
  this.rawMaterialsService.saveNewRawMaterial(material).subscribe(
    {
      next:(data) => { console.log(data);  this.gotoMaterialsList(data['message'], false); },//this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); this.gotoMaterialsList(error, true); }
    }
  );
}

updateRawMaterial(id: number, material:RawMaterial)
{
  this.rawMaterialsService.updateRawMaterial(material).subscribe(
  {
    next:(data) => { console.log(data); this.gotoMaterialsList(data['message'], false); },//this.getRawMaterials(this.current_page); },
    error:(error) => { console.log(error); this.gotoMaterialsList(error, true); }
  });
}

focusOnWeight(): void {
  console.log("CLICKED! weight");
  this.radioWeight.nativeElement.checked = true;
  this.materialWeight.nativeElement.focus();
  this.materialUnits.nativeElement.classList.add("transparent_text");
  this.materialWeight.nativeElement.classList.remove("transparent_text");
}

focusOnUnits(): void {
  console.log("CLICKED! unit");
  this.radioUnits.nativeElement.checked = true;
  this.materialUnits.nativeElement.focus();
  this.materialUnits.nativeElement.classList.remove("transparent_text");
  this.materialWeight.nativeElement.classList.add("transparent_text");

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
    this.delete_confirmation.confirm.subscribe((value: Boolean) => {
      //alert(this.rawMaterialItem.id);
      console.log("deleting " + this.rawMaterialItem.id);
      this.rawMaterialsService.deleteRawMaterial(this.rawMaterialItem.id).subscribe(
        {
          next:(data) => {
            console.log(data);
            this.gotoMaterialsList(data['message'], false);
          }
        });
    });    
  }
}
