import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDialog, WingBaby } from '../../../../types';
import { BabiesLengthPickerComponent } from "../../babies/babies-length-picker/babies-length-picker.component";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogClosingReason, ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
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
export class BabyLengthModalComponent implements ModalContentDirective, ModalDialog, AfterViewInit {

  @ViewChild("dialogWrapper") dialogWrapper!: ModalDialogComponent | null;

  @Input() crown_units: number = 0;
  @Input() crown_babies_options: number[] = Array(5).fill(0).map((_, i)=> i+1);
  @Output() length_changed = new EventEmitter<WingBaby>();
  @Output() crown_babies_quantity_changed = new EventEmitter<number>();
  @Output() confirm = new EventEmitter<WingBaby>();
  @Output() cancel = new EventEmitter<WingBaby>();
  @ViewChild("crown_size", { read: ElementRef }) crown_size!: ElementRef;
  console = console;
  object_changed:boolean = false;

  public editedObject: WingBaby = {
    id: 0,
    wing_id: 0,
    length: 0,
    position: ''
  };
  original_length: number = 0;
  close: EventEmitter<any> = new EventEmitter<WingBaby>();

  onOpen() {
    this.object_changed = false;
    this.console.dir(this.crown_babies_options);
  }

  ngAfterViewInit(): void {
    this.dialogWrapper!.btnCancelText = "Cancel";
    this.dialogWrapper!.cancel.subscribe({next: () => {
      if(this.object_changed) {
        //restore the original object
        this.editedObject.length = this.original_length;
        this.length_changed.emit(this.editedObject);
      }
    }});

  }
  

  set_crown(){
    //this.console.log("set_crown " +  this.crown_units + " :: " + this.crown_size.nativeElement.value);
  }

  crown_units_changed(){
    this.crown_babies_quantity_changed.emit(this.crown_units);
  }


  beforeClose(reason: DialogClosingReason): Boolean {
    if(this.object_changed) {
      this.length_changed.emit(this.editedObject);
    }
    this.confirm.emit(this.editedObject);
    return true;
  }

  lengthClicked(newLength:number){
    if(this.editedObject.length != newLength) {
      if(!this.object_changed){
        this.original_length = this.editedObject.length;
        this.object_changed = true;
      }
      this.editedObject.length = newLength;
      this.length_changed.emit(this.editedObject);  
    }
  }
}
