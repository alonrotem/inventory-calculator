import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Country, Currency, RawMaterial } from '../../../../types';
import { RouterModule } from '@angular/router';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { DatePipe } from '@angular/common';
import { BabiesTableComponent } from '../../babies/babies-table/babies-table.component';
import { InfoService } from '../../../services/info.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateStrPipe } from '../../../utils/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave, faTrashAlt, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-raw-material-editor',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterOutlet, FormsModule, DatePipe, BabiesTableComponent, NgSelectModule, DateStrPipe, FaIconComponent ],
  templateUrl: './raw-material-editor.component.html',
  styleUrl: './raw-material-editor.component.scss'
})
export class RawMaterialEditorComponent implements OnInit {

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
    created_at: new Date()
  }

  countries: Country[] = [];
  currencies: Currency[] = [];
  title: string = "Create Raw Material";
  newMaterialMode: boolean = true;
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;

  @ViewChild("purchasedAt") purchase_date!: ElementRef;
  @ViewChild("radioWeight") radioWeight!: ElementRef;
  @ViewChild("radioUnits") radioUnits!: ElementRef;
  @ViewChild("materialWeight") materialWeight!: ElementRef;
  @ViewChild("materialUnits") materialUnits!: ElementRef;

  
constructor(private rawMaterialsService: RawMaterialsService, private infoService: InfoService, private location: Location, private activatedRoute: ActivatedRoute) { 
  
}
  ngOnInit(): void {
    if(this.activatedRoute.snapshot.queryParamMap.has('id'))
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
  this.rawMaterialItem.purchased_at =  new Date(this.purchase_date.nativeElement.value); //.toISOString()
  //edit
  if(this.activatedRoute.snapshot.queryParamMap.has('id'))
  {
    const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
    console.log("edit: ");
    console.log(this.rawMaterialItem);
    this.editRawMaterial(id, this.rawMaterialItem);
  }
  //add
  else
  {
    console.log("add: ");
    console.log(this.rawMaterialItem);
    this.addRawMaterial(this.rawMaterialItem);
  }
}

addRawMaterial(material:RawMaterial)
{
  this.rawMaterialsService.addRawMaterial(material).subscribe(
    {
      next:(data) => { console.log(data);  this.goBack(); },//this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); }
    }
  );
}

editRawMaterial(id: number, material:RawMaterial)
{
  this.rawMaterialsService.editRawMaterial(material).subscribe(
  {
    next:(data) => { console.log(data); this.goBack(); },//this.getRawMaterials(this.current_page); },
    error:(error) => { console.log(error); }
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


  goBack() {
    this.location.back();
  }

}
