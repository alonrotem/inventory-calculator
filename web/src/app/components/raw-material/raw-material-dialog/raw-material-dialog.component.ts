import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RawMaterial } from '../../../../types';

@Component({
  selector: 'app-raw-material-dialog',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './raw-material-dialog.component.html',
  styleUrl: './raw-material-dialog.component.scss'
})
export class RawMaterialDialogComponent {

  public outputObj : RawMaterial = {
    name: "",
    purchased_at: new Date(),
    weight: 0,
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0
  }
  //@Output() confirm = new EventEmitter<RawMaterial>();

  /*
  emit_confirm () {
    this.confirm.emit(this.rawMaterial);
  }
  */
}
/*
[-----------------------------------]
              Dialog
  [-------------------------------]
              Inner
            [product]
  [-------------------------------]
  [OK] [Cancel]
[-----------------------------------]
*/