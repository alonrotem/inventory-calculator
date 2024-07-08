import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { RawMaterial } from '../../../../types';
import { RouterModule } from '@angular/router';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { DatePipe } from '@angular/common';
import { BabiesTableComponent } from '../../babies/babies-table/babies-table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-raw-material-editor',
  standalone: true,
  imports: [ RouterModule, RouterLink, RouterOutlet, FormsModule, DatePipe, BabiesTableComponent ],
  templateUrl: './raw-material-editor.component.html',
  styleUrl: './raw-material-editor.component.scss'
})
export class RawMaterialEditorComponent implements OnInit {

  public outputObj : RawMaterial = {
    id: 0,
    name: "",
    purchased_at: new Date(),
    weight: 0,
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0
  }

  @ViewChild("purchasedAt") purchase_date!: ElementRef;
  
  
constructor(private rawMaterialsService: RawMaterialsService, private location: Location, private activatedRoute: ActivatedRoute) { 
  
}
  ngOnInit(): void {
    if(this.activatedRoute.snapshot.queryParamMap.has('id'))
    {
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getRawMaterial(id);  
    }
  }

getRawMaterial(id: number){
  this.rawMaterialsService.getRawMaterial(`${environment.serverUrl}/raw_materials/${id}`).subscribe(
  {
    next: (rawMaterial: RawMaterial) => {
      this.outputObj = rawMaterial;
    },
    error: (error) => {
      console.log(error);
    }
  })
}

save()
{
  this.outputObj.purchased_at =  new Date(this.purchase_date.nativeElement.value); //.toISOString()
  //edit
  if(this.activatedRoute.snapshot.queryParamMap.has('id'))
  {
    const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
    console.log("edit: ");
    console.log(this.outputObj);
    this.editRawMaterial(id, this.outputObj);
  }
  //add
  else
  {
    console.log("add: ");
    console.log(this.outputObj);
    this.addRawMaterial(this.outputObj);
  }
}

addRawMaterial(material:RawMaterial)
{
  this.rawMaterialsService.addRawMaterial(`${environment.serverUrl}/raw_materials/`, material).subscribe(
    {
      next:(data) => { console.log(data);  this.goBack(); },//this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); }
    }
  );
}

editRawMaterial(id: number, material:RawMaterial)
{
  this.rawMaterialsService.editRawMaterial(`${environment.serverUrl}/raw_materials/${id}`, material).subscribe(
  {
    next:(data) => { console.log(data); this.goBack(); },//this.getRawMaterials(this.current_page); },
    error:(error) => { console.log(error); }
  });
}

  goBack() {
    this.location.back();
  }
}
