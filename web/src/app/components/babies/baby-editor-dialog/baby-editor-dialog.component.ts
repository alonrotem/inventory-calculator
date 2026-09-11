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
import { SettingsService } from '../../../services/settings.service';
import { faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';

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
  @ViewChild("quantity_top_up", { read: ElementRef }) quantity_top_up!: ElementRef;
  @ViewChild("babyEditorDialog") dialogWrapper!: ModalDialogComponent;

  @Input() babies_data: { length: number; quantity: number }[] = [];
  edited_babies: { length: number; quantity: number }[] = [];
  enter_was_pressed_dont_close_the_dialog: boolean = false;
  faSave: IconDefinition = faSave;

  @Input() highlighted_baby_length: number = 0;
  @Input() units_available: number = 0;
  highlighted_baby_quantity_before_change: number = 0;
  highlighted_baby_quantity: number = 0;
  highlighted_baby_top_up: number = 0;
  
  //[ 5.0, 5.5, 6.0, 6.5, ... 13.0 ]
  min_length:number = 5;
  max_length:number = 16;
  length_steps: number = 0.5;
  lengths: number[] = Array(
    (this.max_length - this.min_length)*2+1)
    .fill(this.min_length)
    .map((_,i) => _ + i * this.length_steps);
  top_ups: { length: number, top_up: number }[] = this.lengths.map(l => { return { length: l, top_up: 0 } });
  console = console;

  public editedObject: null = null;
  //appendBaby: EventEmitter<{ length: number; quantity: number }> = new EventEmitter<{ length: number; quantity: number }>();
  babiesUpdated: EventEmitter<{changes_made: boolean, babies: { length: number; quantity: number }[]}> = new EventEmitter<{changes_made: boolean, babies: { length: number; quantity: number }[]}>();
  customer_banks_babies_reduce_from_allocation: boolean = false;


  isSubmitted : boolean = false;
  babyEditMode: boolean = false; // babyEditmode: editing an existing baby. Otherwise in add mode
  @Input() is_demo_customer: boolean = false;

  constructor(private fb: FormBuilder, private toastService: ToastService, private settingsService: SettingsService) {
  }

  close: EventEmitter<any> = new EventEmitter<Baby>();

  ngAfterViewInit(): void {
    this.settingsService.getSettings(["customer_banks_babies_reduce_from_allocation"]).subscribe({
      next: (setting:Record<string, any>) => { 
        this.customer_banks_babies_reduce_from_allocation = setting["customer_banks_babies_reduce_from_allocation"]; 
      },
      error: (err: any) => { console.error(err) }
    });    
    this.length_picker.lengthChange.subscribe((value: number[]) => {
      this.highlighted_baby_length = value.length > 0 ? value[0] : this.min_length;
      this.highlightLength();
    });    
  }



  onOpen(): any {
    this.isSubmitted = false;
    this.length_picker.reset();
    this.babies_data.forEach(b => {
      this.length_picker.setCountForLength(b.length, b.quantity);
    });
    //keeping a copy, for cancellation
    this.edited_babies = (JSON.parse(JSON.stringify(this.babies_data)));
    this.top_ups = this.lengths.map(l => { return { length: l, top_up: 0 } });
    //console.log("subscribing...");

    this.highlightLength();

    this.dialogWrapper.cancel.subscribe({next: () => {
      //console.log("CAUCHT CLOSE");
    },
  error: (error: any)=> {
    alert(error);
  }});   
  }

  switch_mode(){
    this.highlightLength([this.highlighted_baby_length]);
  }

  /**
  Select the next length in the list, focus on the input
  if babyEditMode
    Set the quantity to the current length quantity
    If not, set the quantity-top_up, and the top_up field to the top_up
   */
  highlightLength(lengths: number[] = []) {
    if(lengths.length > 0){
      this.highlighted_baby_length = lengths[0];
    }

    //this.console.dir(this.highlighted_baby_length);
    if(this.highlighted_baby_length < this.min_length || this.highlighted_baby_length > this.max_length){
      this.highlighted_baby_length = this.min_length;
    }
    this.length_picker.selected_lengths = [this.highlighted_baby_length];
    this.highlighted_baby_quantity = this.length_picker.getCountForLength(this.highlighted_baby_length);
    const current_top_up = this.top_ups.find(t => t.length == this.highlighted_baby_length);
    if(!this.babyEditMode && current_top_up){
      this.highlighted_baby_quantity -= current_top_up.top_up;
      this.highlighted_baby_top_up = current_top_up.top_up;
    }

    if(this.babyEditMode){
      setTimeout(() => {
        this.highlighted_baby_top_up = 0;
        this.quantity.nativeElement.focus();
        this.quantity.nativeElement.select();
      }, 0);
    }
    else {
      //quantity_top_up
      //
      setTimeout(() => {
        this.quantity_top_up.nativeElement.focus();
        this.quantity_top_up.nativeElement.select();
      }, 0);      
    }
  }

  /*
  If the user clicked confirm,
    babyEditMode?
    No:
      Add the top-ups to the quantities
    Emit the quantities  
  */
  beforeClose(reason: DialogClosingReason): Boolean {
    let changes_made = false;
    //the user just pressed enter. Don't close yet (highlighting just jumped to the next length)
    if(reason == DialogClosingReason.confirm){
      if(this.enter_was_pressed_dont_close_the_dialog) {
        //this is a one-time prevention (until Enter is pressed again)
        this.enter_was_pressed_dont_close_the_dialog = false;
        return false;
      }
      else {
        this.updateCurrentHighlghtedValues();
        this.edited_babies.forEach(b => {
          let baby_to_modify = this.babies_data.find(bd => bd.length == b.length);
          if(!baby_to_modify || b.quantity != baby_to_modify.quantity){
            changes_made = true;
          }
        });
        this.babies_data = (JSON.parse(JSON.stringify(this.edited_babies)));
        this.top_ups.forEach(t => {
          let baby_to_modify = this.babies_data.find(b => b.length == t.length);
          if(baby_to_modify && t.top_up > 0){
            changes_made = true;
            baby_to_modify.quantity += t.top_up;
          }
          else {
            if(t.top_up > 0){
              changes_made = true;
              this.babies_data.push({
                length: t.length,
                quantity: t.top_up
              });
            }
          }
        });
      }
    }
    //console.log("beforeClose...");
    this.top_ups = [];
    this.babiesUpdated.emit({
      changes_made: changes_made,
      babies: this.babies_data
    });
    this.isSubmitted = true;
    return true;
  }

  /*
  babyEditMode?
    Yes:
      Set top-up to 0
      Set babu quantity to current quantity
    No:
      Set top-up to the typed quantity
      Update the quantity in the baby picker to quantity + top up
      Don't change the baby quantity
  */
  sendit(event:any){
    this.enter_was_pressed_dont_close_the_dialog = true;
    if(this.customer_banks_babies_reduce_from_allocation && this.highlighted_baby_quantity > this.units_available + this.highlighted_baby_quantity_before_change)
      return;
    
    if(this.customer_banks_babies_reduce_from_allocation) {
      this.units_available -= ((this.babyEditMode)? (this.highlighted_baby_quantity - this.highlighted_baby_quantity_before_change) : this.highlighted_baby_top_up);
    }

    if(this.highlighted_baby_length >= this.min_length){
      this.length_picker.setCountForLength(this.highlighted_baby_length, this.highlighted_baby_quantity + ((this.babyEditMode)? 0: this.highlighted_baby_top_up) );
    }

    this.updateCurrentHighlghtedValues();

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
    this.highlightLength();
    //this.close.emit(this.editedObject);
    //this.enter_was_pressed_dont_close_the_dialog = false;
  }

  updateCurrentHighlghtedValues(){
    let baby_to_modify = this.edited_babies
      .find(b => b.length == this.highlighted_baby_length);

    if(this.babyEditMode){
      if(baby_to_modify){
        baby_to_modify.quantity = this.highlighted_baby_quantity;
      }
      else {
        this.edited_babies.push({
          length:this.highlighted_baby_length,
          quantity: this.highlighted_baby_quantity,
        });
      }
    }
    //append mode
    else {
      let current_top_up =this.top_ups.find(t => t.length == this.highlighted_baby_length);
      if(current_top_up){
        current_top_up.top_up = this.highlighted_baby_top_up;
      }
    }  
  }

}

