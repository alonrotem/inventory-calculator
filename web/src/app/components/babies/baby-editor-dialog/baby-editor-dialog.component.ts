import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Baby, ModalDialog } from '../../../../types';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, NgSelectOption, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { DecimalPipe, NgIf } from '@angular/common';
import { NgOptionComponent, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { BabiesLengthPickerComponent } from '../babies-length-picker/babies-length-picker.component';
import { ToastService } from '../../../services/toast.service';
import { DialogClosingReason, ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { NumericInputDirective } from '../../../utils/directives/auto-numeric.directive';

@Component({
  selector: 'app-baby-editor-dialog',
  standalone: true,
  imports: [ 
    FormsModule, NgIf, NgSelectModule, ReactiveFormsModule, NumericInputDirective,
    BabiesLengthPickerComponent, ModalDialogComponent, ModalContentDirective, DecimalPipe ],
  templateUrl: './baby-editor-dialog.component.html',
  styleUrl: './baby-editor-dialog.component.scss',
  providers: [
    {
      provide: MODAL_OBJECT_EDITOR,
      useExisting: BabyEditorDialogComponent
    }
  ]  
})
export class BabyEditorDialogComponent implements ModalContentDirective, ModalDialog, AfterViewInit {

  //@ViewChild("length") length!: NgSelectComponent;
  @ViewChild("length_picker") length_picker!: BabiesLengthPickerComponent;
  @ViewChild("quantity", { read: ElementRef }) quantity!: ElementRef;
  @ViewChild("babyEditorDialog") dialogWrapper!: ModalDialogComponent;

  @Input() babies_to_edit: { length: number; quantity: number }[] = [];
  @Input() highlighted_baby_length: number = 0;
  @Input() units_available: number = 0;
  highlighted_baby_quantity_before_change: number = 0;
  highlighted_baby_quantity: number = 0;

  //[ 5.0, 5.5, 6.0, 6.5, ... 13.0 ]
  min_length:number = 5;
  max_length:number = 13;
  length_steps: number = 0.5;
  lengths: number[] = Array(
    (this.max_length - this.min_length)*2+1)
    .fill(this.min_length)
    .map((_,i) => _ + i * this.length_steps);
  console = console;

  public editedObject: null = null;
  appendBaby: EventEmitter<{ length: number; quantity: number }> = new EventEmitter<{ length: number; quantity: number }>();

  /*
    babyFormEditor = this.fb.group({
    /*
    length: [this.editedObject.length, [
      Validators.required
    ]],*/
    /*
    quantity: [this.editedObject.quantity, [
      Validators.required
    ]]
  });
  */
  isSubmitted : boolean = false;
  babyEditMode: boolean = false; // babyEditmode: editing an existing baby. Otherwise in add mode

  constructor(private fb: FormBuilder, private toastService: ToastService) {
  }

  close: EventEmitter<any> = new EventEmitter<Baby>();

  ngAfterViewInit(): void {
    this.length_picker.lengthChange.subscribe((value: number) => {
      this.highlighted_baby_length = value;
      this.highlightNext();
    });
  }



  onOpen(): any {
    this.isSubmitted = false;
    //this.babyFormEditor.get("length")?.setValue(this.editedObject.length);
    this.length_picker.reset();
    this.highlightNext();
    /*
    if(this.editedObject.length == 0){
      this.editedObject.length = this.min_length;
    }
    this.length_picker.length = this.editedObject.length;
    this.babyFormEditor.get("quantity")?.setValue(this.editedObject.quantity);
    this.babyFormEditor.markAsPristine();
    this.babyFormEditor.markAsUntouched();
    this.quantity.nativeElement.focus();
    /*
    this.length.searchInput.nativeElement.focus();
    if(this.length && this.length.itemsList)
    {  
      let item = this.length.itemsList.findByLabel(this.editedObject.length.toString());
      if(item)
      {
        this.length.select(item);
      }
    }
    */
    //console.log("subscribing...");
    this.dialogWrapper.cancel.subscribe({next: () => {
      //console.log("CAUCHT CLOSE");
    },
  error: (error: any)=> {
    alert(error);
  }});   
  }

  highlightNext(){
    //this.console.dir(this.highlighted_baby_length);
    if(this.highlighted_baby_length < this.min_length || this.highlighted_baby_length > this.max_length){
      this.highlighted_baby_length = this.min_length;
    }
    this.length_picker.length = this.highlighted_baby_length;
    const baby_info = this.babies_to_edit.find(b => b.length == this.highlighted_baby_length);
    //this.console.log("baby info:");
    
    this.highlighted_baby_quantity = (baby_info)? baby_info.quantity: 0;
    this.highlighted_baby_quantity_before_change = this.highlighted_baby_quantity;

    this.quantity.nativeElement.focus();
    //this.quantity.nativeElement.select();
    setTimeout(() => {
      this.quantity.nativeElement.focus();
      this.quantity.nativeElement.select();
    }, 0);
  }

  beforeClose(reason: DialogClosingReason): Boolean {
    if(reason == DialogClosingReason.confirm)
      return false;
    //console.log("beforeClose...");
    this.isSubmitted = true;
    return true;
    /*
    this.babyFormEditor.markAsDirty();
    if(this.babyFormEditor.invalid || (this.length_picker.isLengthInvalid()))
    {
      this.toastService.showError("Please fill length and quantity!");
      return false;
    }
      */
     /*
    //this.editedObject.length =  this.babyFormEditor.get('length')!.value ?? 0;
    //this.editedObject.length = this.length_picker.get_length();
    this.editedObject.quantity =  this.babyFormEditor.get('quantity')!.value ?? 0;
    this.appendBaby.emit(this.editedObject);
    //this.toastService.showSuccess("Applied");

    //reset the form and don't close
    this.length_picker.reset();
    this.babyFormEditor.get('quantity')!.setValue(0);
    this.editedObject.length = this.editedObject.length + this.length_steps;
    if(this.editedObject.length > this.max_length){
      this.editedObject.length = this.min_length;
    }
    this.babyFormEditor.markAsPristine();
    this.babyFormEditor.markAsUntouched();
    this.quantity.nativeElement.focus();

    return this.babyEditMode;
    */
  }

  sendit(event:any){
    if(this.highlighted_baby_quantity > this.units_available + this.highlighted_baby_quantity_before_change)
      return;
    
    this.appendBaby.emit({
      length: this.highlighted_baby_length,
      quantity: this.highlighted_baby_quantity
    });
    this.units_available -= this.highlighted_baby_quantity - this.highlighted_baby_quantity_before_change;
    let baby_to_modify = this.babies_to_edit
      .find(b => b.length == this.highlighted_baby_length);

//------------
    if(this.babyEditMode){
      if(baby_to_modify){
        baby_to_modify.quantity = this.highlighted_baby_quantity;
      }
      else {
        this.babies_to_edit.push({
          length:this.highlighted_baby_length,
          quantity: this.highlighted_baby_quantity,
        });
      }
    }
    //append mode
    else {
      //add mode
      // find the baby
      // if found -> 
      //  top up quantity
      // if not found
      //  append new with quantity
      if(baby_to_modify){
        baby_to_modify.quantity += this.highlighted_baby_quantity;
      }
      else {
        this.babies_to_edit.push({
          length:this.highlighted_baby_length,
          quantity: this.highlighted_baby_quantity,
        });
      }      
    }
//------------

      //this.pendingBabyAppendAllocation
      //edit mode:
      // find the baby
      // if found -> 
      //  if quantity is 0, and in_orders is 0 -> splice out
      //  if quantity is > 0 -> update the quanitty
      // if not found && quantity > 0->
      //    append new with quantity

    this.highlighted_baby_length += this.length_steps;
    this.highlightNext();
    //this.close.emit(this.editedObject);
  }
/*
  setLength(length:string) {
    this.editedObject.length = Number(length);
  }

  isLengthInvalid(){
    if((this.babyFormEditor.touched || this.babyFormEditor.dirty) && (this.length_picker.isLengthInvalid()))
    {
      return true;
    }
    return false;
  }*/
}
