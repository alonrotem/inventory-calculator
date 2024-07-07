import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RawMaterial } from '../../../../types';

@Component({
  selector: 'app-raw-material-editor',
  standalone: true,
  imports: [],
  templateUrl: './raw-material-editor.component.html',
  styleUrl: './raw-material-editor.component.scss'
})
export class RawMaterialEditorComponent {

  public outputObj : RawMaterial = {
    name: "",
    purchased_at: new Date(),
    weight: 0,
    updated_at: new Date(),
    created_by: 0,
    updated_by: 0
  }
  
constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }
}
