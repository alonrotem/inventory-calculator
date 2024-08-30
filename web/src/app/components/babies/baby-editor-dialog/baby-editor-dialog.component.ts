import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Baby, ModalObjectEditor } from '../../../../types';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, NgSelectOption, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgOptionComponent, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { BabiesLengthPickerComponent } from '../babies-length-picker/babies-length-picker.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-baby-editor-dialog',
  standalone: true,
  imports: [ FormsModule, NgIf, NgSelectModule, ReactiveFormsModule, BabiesLengthPickerComponent ],
  templateUrl: './baby-editor-dialog.component.html',
  styleUrl: './baby-editor-dialog.component.scss'
})
export class BabyEditorDialogComponent implements ModalObjectEditor, AfterViewInit {

  //@ViewChild("length") length!: NgSelectComponent;
  @ViewChild("length_picker") length_picker!: BabiesLengthPickerComponent;
  @ViewChild("quantity", { read: ElementRef }) quantity!: ElementRef;

  public editedObject: Baby = {
    id: 0,
    raw_material_parent_id: 0,
    raw_material: '',
    length: 0,
    quantity: 0,
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
  }

  beforeClose(): Boolean {
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
    this.toastService.showSuccess("Added!");
    return true;
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
