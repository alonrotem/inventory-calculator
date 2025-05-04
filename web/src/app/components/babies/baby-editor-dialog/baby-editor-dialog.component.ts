import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Baby, ModalDialog } from '../../../../types';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, NgSelectOption, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgOptionComponent, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { BabiesLengthPickerComponent } from '../babies-length-picker/babies-length-picker.component';
import { ToastService } from '../../../services/toast.service';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';

@Component({
  selector: 'app-baby-editor-dialog',
  standalone: true,
  imports: [ FormsModule, NgIf, NgSelectModule, ReactiveFormsModule, BabiesLengthPickerComponent, ModalDialogComponent, ModalContentDirective ],
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

  public editedObject: Baby = {
    id: 0,
    raw_material_parent_id: 0,
    raw_material: '',
    length: 0,
    quantity: 0,
    quantity_in_pending_orders: 0,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 1,
    updated_by: 1
  }

  babyFormEditor = this.fb.group({
    /*
    length: [this.editedObject.length, [
      Validators.required
    ]],*/
    quantity: [this.editedObject.quantity, [
      Validators.required
    ]]
  });
  isSubmitted : boolean = false;

  constructor(private fb: FormBuilder, private toastService: ToastService) {
  }

  close: EventEmitter<any> = new EventEmitter<Baby>();

  ngAfterViewInit(): void {
    this.length_picker.lengthChange.subscribe((value: Number) => {
      this.quantity.nativeElement.focus();
    });
  }

  //[ 5.0, 5.5, 6.0, 6.5, ... 13.0 ]
  lengths = Array.from({ length:17 }, (v, k) => (5.5 + ((k-1)*0.5)).toFixed(1));
  console = console;

  onOpen(): any {
    this.isSubmitted = false;
    //this.babyFormEditor.get("length")?.setValue(this.editedObject.length);
    this.length_picker.reset();
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
    console.log("subscribing...");
    this.dialogWrapper.cancel.subscribe({next: () => {
      console.log("CAUCHT CLOSE");
    },
  error: (error: any)=> {
    alert(error);
  }});   
  }

  beforeClose(): Boolean {
    console.log("beforeClose...");
    this.isSubmitted = true;
    this.babyFormEditor.markAsDirty();
    if(this.babyFormEditor.invalid || (this.length_picker.isLengthInvalid()))
    {
      this.toastService.showError("Please fill length and quantity!");
      return false;
    }
    //this.editedObject.length =  this.babyFormEditor.get('length')!.value ?? 0;
    //this.editedObject.length = this.length_picker.get_length();
    this.editedObject.quantity =  this.babyFormEditor.get('quantity')!.value ?? 0;
    this.toastService.showSuccess("Saved");
    return true;
  }

  sendit(event:any){
    this.close.emit(this.editedObject);
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
