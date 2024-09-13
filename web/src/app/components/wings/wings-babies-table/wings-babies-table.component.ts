import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WingBaby } from '../../../../types';
import { NgFor, NgIf } from '@angular/common';
import { faArrowsUpToLine, faSave, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BabiesLengthPickerComponent } from '../../babies/babies-length-picker/babies-length-picker.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { ToastService } from '../../../services/toast.service';
import { PrefixPipe } from "./prefix-pipe";

@Component({
  selector: 'app-wings-babies-table',
  standalone: true,
  imports: [NgFor, NgIf, FaIconComponent, BabiesLengthPickerComponent, AutocompleteLibModule, FormsModule, PrefixPipe],
  templateUrl: './wings-babies-table.component.html',
  styleUrl: './wings-babies-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WingsBabiesTableComponent {
  @Input() wing_id: number = 0;
  @Input() position: string = '';
  @Input() wingsbabies: WingBaby[] = [];
  @Input() wingPrefix : string = '';
  @Output() wingsbabiesChange = new EventEmitter();
  @ViewChild("picker") picker :BabiesLengthPickerComponent = new BabiesLengthPickerComponent();
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowsUpToLine:IconDefinition = faArrowsUpToLine;

  constructor(private toastService: ToastService){
    this.wingsbabiesChange.emit(this.wingsbabies);
  }

  addBabyToTable(){
    this.wingsbabies.push({
      /*id: 0,*/
      wing_id: this.wing_id,
      length: this.picker.get_length(),
      position: this.wingPrefix + (this.wingsbabies.filter((b)=> b.position.startsWith(this.wingPrefix)).length + 1)
    });
    this.picker.reset();
    this.wingsbabiesChange.emit(this.wingsbabies);
  }

  deleteBaby(wingbaby: WingBaby){
    let babyIndex = this.wingsbabies.findIndex(b => b.position == wingbaby.position);
    if(babyIndex >= 0)
    {
      this.wingsbabies.splice(babyIndex, 1);
    }
    for(let b=0, pos=1; b < this.wingsbabies.length; b++)
    {
      if(this.wingsbabies[b].position.startsWith(this.wingPrefix))
        this.wingsbabies[b].position = this.wingPrefix + (pos++);
    }
    this.wingsbabiesChange.emit(this.wingsbabies);
  }
}
