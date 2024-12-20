import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDialog, WingBaby } from '../../../../types';
import { BabiesLengthPickerComponent } from "../../babies/babies-length-picker/babies-length-picker.component";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';

@Component({
  selector: 'app-baby-length-modal',
  standalone: true,
  imports: [BabiesLengthPickerComponent, NgFor, NgIf, FormsModule, ModalDialogComponent, ModalContentDirective],
  templateUrl: './baby-length-modal.component.html',
  styleUrl: './baby-length-modal.component.scss',
  providers: [
    {
      provide: MODAL_OBJECT_EDITOR,
      useExisting: BabyLengthModalComponent
    }
  ]
})
export class BabyLengthModalComponent implements ModalContentDirective, ModalDialog {
  
  @ViewChild("dialogWrapper") dialogWrapper!: ModalDialogComponent | null;

  @Input() crown_units: number = 0;
  @Input() crown_babies_options: number[] = [];
  @Output() length_changed = new EventEmitter<WingBaby>();
  @ViewChild("crown_size", { read: ElementRef }) crown_size!: ElementRef;
  console = console;

  public editedObject: WingBaby = {
    id: 0,
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
