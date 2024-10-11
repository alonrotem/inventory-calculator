import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalObjectEditor, WingBaby } from '../../../../types';
import { BabiesLengthPickerComponent } from "../../babies/babies-length-picker/babies-length-picker.component";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-baby-length-modal',
  standalone: true,
  imports: [BabiesLengthPickerComponent, NgFor, NgIf, FormsModule],
  templateUrl: './baby-length-modal.component.html',
  styleUrl: './baby-length-modal.component.scss'
})
export class BabyLengthModalComponent implements ModalObjectEditor {

  @Input() crown_units: number = 0;
  @Input() crown_babies_options: number[] = [];
  @Output() length_changed = new EventEmitter<WingBaby>();
  @ViewChild("crown_size", { read: ElementRef }) crown_size!: ElementRef;
  console = console;

  public editedObject: WingBaby = {
    wing_id: 0,
    length: 0,
    position: ''
  };
  close: EventEmitter<any> = new EventEmitter<WingBaby>();

  onOpen() {
  }

  set_crown(){
    //this.console.log("set_crown " +  this.crown_units + " :: " + this.crown_size.nativeElement.value);
  }


  beforeClose(): Boolean {
    return true;
  }

  lengthClicked(newLength:number){
    //console.log("Changed " + newLength);
    this.editedObject.length = newLength;
    this.length_changed.emit(this.editedObject);
  }
}
