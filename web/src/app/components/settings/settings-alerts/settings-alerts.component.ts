import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings-alerts',
  standalone: true,
  imports: [ NgIf, FormsModule ],
  templateUrl: './settings-alerts.component.html',
  styleUrl: './settings-alerts.component.scss'
})
export class SettingsAlertsComponent implements OnChanges{

  @Input() settings: any = {
    alert_raw_material_total_kg: true,
    alert_raw_material_total_kg_below: 5,
    alert_raw_material_total_units: true,
    alert_raw_material_total_units_below: 5
  };

  ngOnChanges(changes: SimpleChanges): void {
    //console.dir(this.settings);
  }
}
