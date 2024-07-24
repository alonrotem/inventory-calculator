import { Component, ViewChild } from '@angular/core';
import { Baby, ModalObjectEditor } from '../../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-baby-editor-dialog',
  standalone: true,
  imports: [ FormsModule, NgIf ],
  templateUrl: './baby-editor-dialog.component.html',
  styleUrl: './baby-editor-dialog.component.scss'
})
export class BabyEditorDialogComponent implements ModalObjectEditor {

  @ViewChild('baby_editor_form') baby_editor_form!: NgForm;

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

  beforeClose(): Boolean {
    this.baby_editor_form.form.markAllAsTouched();
    return this.baby_editor_form.form.valid;
  }
}
