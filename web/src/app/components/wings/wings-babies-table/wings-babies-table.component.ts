import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WingBaby } from '../../../../types';
import { NgFor, NgIf } from '@angular/common';
import { faArrowsUpToLine, faSave, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BabiesLengthPickerComponent } from '../../babies/babies-length-picker/babies-length-picker.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-wings-babies-table',
  standalone: true,
  imports: [ NgFor, NgIf, FaIconComponent, BabiesLengthPickerComponent, AutocompleteLibModule, FormsModule ],
  templateUrl: './wings-babies-table.component.html',
  styleUrl: './wings-babies-table.component.scss'
})
export class WingsBabiesTableComponent {
  @Input() wing_id: number = 0;
  @Input() position_id: number = 0;
  @Input() position_name: string = '';
  @Input() wingsbabies: WingBaby[] = [];
  @Output() wingsbabiesChange = new EventEmitter();
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowsUpToLine:IconDefinition = faArrowsUpToLine;
  addMode: Boolean = false;
  raw_material_names: string[] = [];
  blankWingBaby: WingBaby = {
    id: 0,
    wing_id: this.wing_id,
    position_id: this.position_id,
    raw_material_name: '',
    length: 0,
    position: this.position_name
  }

  constructor(private rawMaterialsService: RawMaterialsService, private toastService: ToastService){
    //this.wingsbabiesChange.emit(this.wingsbabies);
    this.addMode = false;
    this.rawMaterialsService.getRawMaterialNames().subscribe({
      next: (names)=> {
        this.raw_material_names = names;
      }
    });    
  }

  addBabyToTable(){
    this.blankWingBaby.position_id = this.position_id;
    if(!this.blankWingBaby.raw_material_name || this.blankWingBaby.length <= 0)
    {
      this.toastService.showError("Please fill a raw material name and length!");
      return;
    }
    let alreadyAdded = this.wingsbabies.find(baby => baby.length == this.blankWingBaby.length && baby.raw_material_name == this.blankWingBaby.raw_material_name);
    if(!alreadyAdded)
    {
      const babyClone: WingBaby = {
        id: 0,
        wing_id: this.wing_id,
        position_id: this.position_id,
        raw_material_name: '',
        length: 0,
        position: this.position_name
      };
      Object.assign(babyClone, this.blankWingBaby);
      this.wingsbabies.push(babyClone);
      this.toastService.showSuccess(babyClone.raw_material_name + " ("+ babyClone.length.toFixed(1) +" cm) added");
    }
    else
    {
      this.toastService.showError(this.blankWingBaby.raw_material_name + " ("+ this.blankWingBaby.length.toFixed(1) +" cm) already in the list");
    }
    //this.addMode = false;
    this.blankWingBaby.length = -999;
    this.blankWingBaby.raw_material_name = '';
  }

  deleteBaby(wingbaby: WingBaby){
    let babyIndex = this.wingsbabies.findIndex(b => b.id == wingbaby.id);
    if(babyIndex >= 0)
    {
      this.wingsbabies.splice(babyIndex, 1);
    }
    this.wingsbabiesChange.emit(this.wingsbabies);
    //this.recalculateTotalsOnClient();
  }
}
