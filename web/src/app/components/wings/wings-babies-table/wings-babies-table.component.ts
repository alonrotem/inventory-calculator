import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { WingBaby } from '../../../../types';
import { NgFor, NgIf } from '@angular/common';
import { faArrowsUpToLine, faSave, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BabiesLengthPickerComponent } from '../../babies/babies-length-picker/babies-length-picker.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule } from '@angular/forms';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { ToastService } from '../../../services/toast.service';
import { PrefixPipe } from "../../../utils/pipes/prefix-pipe";
import { SortBabiesPipe } from '../../../utils/pipes/sort-babies-pipe';

@Component({
  selector: 'app-wings-babies-table',
  standalone: true,
  imports: [NgFor, NgIf, FaIconComponent, BabiesLengthPickerComponent, AutocompleteLibModule, FormsModule, PrefixPipe, SortBabiesPipe],
  templateUrl: './wings-babies-table.component.html',
  styleUrl: './wings-babies-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WingsBabiesTableComponent implements OnChanges {
  @Input() wing_id: number = 0;
  @Input() position: string = '';
  @Input() wingsbabies: WingBaby[] = [];
  @Input() wingPrefix : string = '';
  @Output() wingsbabiesChange = new EventEmitter();
  @Output() OnBabyClick = new EventEmitter();
  @ViewChild("picker") picker :BabiesLengthPickerComponent = new BabiesLengthPickerComponent();
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowsUpToLine:IconDefinition = faArrowsUpToLine;

  constructor(private toastService: ToastService){
    //this.wingsbabiesChange.emit(this.wingsbabies);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("CHANGES!");
    //console.dir(changes);
    changes["wingsbabies"].currentValue = [];
  }

  addBabyToTable(){
    this.wingsbabies.push({
      id: 0,
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

  clicked(wingbaby :WingBaby) {
    this.OnBabyClick.emit(wingbaby);
  }

  wingsByPrefix(){
    return this.wingsbabies.filter(b=> b.position.startsWith('L'));
  }

  trackItem (index: number, item: WingBaby) {
    return item.position;
  }

  show_append(e: any){
    if(e.target.nextElementSibling)
      e.target.nextElementSibling.classList.add("expand-balloon-visible");
  }

  hide_append(e: any){
    if(e.target.nextElementSibling)
    e.target.nextElementSibling.classList.remove("expand-balloon-visible");
  }

  show_me(e:any) {
    e.target.classList.add("expand-balloon-visible");
  }
  hide_me(e:any){
    e.target.classList.remove("expand-balloon-visible");
  }
  
  insert_row(index:number){
    let index_at_pos=0, item_index_with_prefix = 0;
    for(let i=0, arr_pos_found=false; !arr_pos_found ; i++){
      if(this.wingsbabies[i].position.toUpperCase().startsWith(this.wingPrefix.toUpperCase()))
      {
        index_at_pos= i;
        item_index_with_prefix++;
      }
      if(item_index_with_prefix > index)
        arr_pos_found = true;
    }
    this.wingsbabies.splice(index_at_pos, 0, {
      id: 0,
      wing_id: this.wing_id,
      length: 0,
      position: this.wingPrefix.toUpperCase() + "1"
    });
    for(let i=0, pos=1; i< this.wingsbabies.length; i++){
      if(this.wingsbabies[i].position.toUpperCase().startsWith(this.wingPrefix.toUpperCase()))
        this.wingsbabies[i].position = this.wingPrefix.toUpperCase() + (pos++);
    }
    this.wingsbabiesChange.emit(this.wingsbabies);
  }
}
