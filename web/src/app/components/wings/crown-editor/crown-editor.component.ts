import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Wing, WingBaby } from '../../../../types';
import { SortBabiesPipe } from "../../../utils/pipes/sort-babies-pipe";
import { PrefixPipe } from "../../../utils/pipes/prefix-pipe";
import { WingsService } from '../../../services/wings.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowsLeftRightToLine, faArrowUp91, faChartBar, faEquals, faRuler, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';

enum length_options {
  individual,
  common
};

@Component({
  selector: 'app-crown-editor',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, SortBabiesPipe, PrefixPipe, FaIconComponent, DecimalPipe],
  templateUrl: './crown-editor.component.html',
  styleUrl: './crown-editor.component.scss'
})
export class CrownEditorComponent implements OnChanges {

  min_crown_length: number = 5;
  max_crown_length: number = 13;
  min_crown_width: number = 1;
  max_crown_width: number = 3;
  max_babies_in_crown = 5;
  
  num_crown_babies_options = Array(this.max_babies_in_crown).fill(0).map((_, i)=> i+1);
  crown_width_options = Array((this.max_crown_width - this.min_crown_width)*2+1).fill(0).map((_,i) => i/2 + this.min_crown_width);
  crown_length_options = Array((this.max_crown_length - this.min_crown_length)*2 + 1).fill(0).map((_,i) => i/2 + this.min_crown_length);

  //individual_babies_length: boolean = true;
   
  //length_mode: string[] = [ 'individual', 'common' ]
  length_options = length_options;
  length_mode: length_options = length_options.common;
  common_length : number = this.min_crown_length;

  faArrowsLeftRightToLine: IconDefinition = faArrowsLeftRightToLine;
  faRuler: IconDefinition = faRuler;
  faChartBar: IconDefinition =  faChartBar;
  faEquals: IconDefinition =  faEquals;
  faArrowUp91: IconDefinition =  faArrowUp91;
  faTrashCan: IconDefinition =  faTrashCan;

  @Input() wing_id: number = 0;

  @Input() num_of_crown_babies :number = 1;
  @Output() num_of_crown_babiesChanged: EventEmitter<number> = new EventEmitter<number>();

  @Input() crown_width :number = 2;
  @Output() crown_widthChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() crown_babies : WingBaby[] = [];
  @Output() crown_babiesChanged : EventEmitter<WingBaby[]> = new EventEmitter<WingBaby[]>();

  constructor(private wingsService:WingsService, private cdr: ChangeDetectorRef, private zone: NgZone){

  }


  ngOnChanges(changes: SimpleChanges): void {
    if(
      changes["crown_babies"] && changes["crown_babies"]["currentValue"] && changes["crown_babies"]["previousValue"] &&
      JSON.stringify(changes["crown_babies"]["currentValue"].sort((wb1: WingBaby, wb2: WingBaby) => wb1.length - wb2.length)) != JSON.stringify(changes["crown_babies"]["previousValue"].sort((wb1: WingBaby, wb2: WingBaby) => wb1.length - wb2.length))
    )
    {
      this.num_of_crown_babies = changes["crown_babies"]["currentValue"].length;

      if(changes["crown_babies"]["currentValue"].every((item: WingBaby) => item.length == changes["crown_babies"]["currentValue"][0].length)){
        this.length_mode = length_options.common;
        this.common_length = changes["crown_babies"]["currentValue"][0].length;
        console.log("got new crown, with common lengths");
      }
      else
      {
        this.length_mode = length_options.individual;
        console.log("got new crown, with individual lengths");
      }

      //changes["crown_babies"]["currentValue"] = this.wingsService.sort_babies(changes["crown_babies"]["currentValue"], true);
    }
  }

  length_mode_changed(){
    if(this.length_mode == length_options.common){
      this.crown_babies.forEach((b: WingBaby) => {
        b.length = this.crown_babies[0].length;
      });
      this.emit_changes();
    }
  }

  common_length_changed(){
    this.crown_babies.forEach(b => b.length = this.common_length);
    this.emit_changes();
  }

  num_of_babies_changed() {
    if(this.num_of_crown_babies > this.crown_babies.length) {
        let items_to_add = this.num_of_crown_babies - this.crown_babies.length;
        let tempBabies = [...this.crown_babies]; // Create a temporary copy

        for(let i = 1; i <= items_to_add; i++) {
            tempBabies.push({
                id: 0,
                wing_id: this.wing_id,
                length: this.common_length,
                position: `C${this.crown_babies.length + i}`
            });
        }
        this.crown_babies = [...tempBabies]; // Reassign the array just once
    }
      else if(this.num_of_crown_babies < this.crown_babies.length) {
        let items_to_remove = this.crown_babies.length - this.num_of_crown_babies;
        console.log(items_to_remove + " to be removed");
        /*
        this.crown_babies = this.crown_babies.map(item => 
          item.id === updateId ? { ...item, length: newLength } : item
        );*/

        for(let i=0; i < items_to_remove; i++){
          this.crown_babies.pop();
        }
      }
      console.log("Crown babies are now " + this.crown_babies.length);
      this.emit_changes();
  }

  add_baby(){
    if(this.crown_babies.length < this.max_babies_in_crown){
      let length = (this.length_mode == length_options.common)?
        this.common_length :
        this.crown_babies[this.crown_babies.length-1].length;

      this.crown_babies.push({
        id: 0,
        wing_id: this.wing_id,
        length: length,
        position: `C${this.crown_babies.length + 1}`
      });
    }
    this.emit_changes();
  }

  remove_baby(baby_index: number){
    this.crown_babies.splice(baby_index, 1);
    for(let i=0; i < this.crown_babies.length; i++){
      this.crown_babies[i].position = `C${i+1}`;
    }
    this.emit_changes();
  }

  emit_changes(){
    this.crown_babiesChanged.emit(this.crown_babies);
  }
}
