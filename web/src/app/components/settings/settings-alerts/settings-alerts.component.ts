import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPersonDigging, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings-alerts',
  standalone: true,
  imports: [ NgIf, FormsModule, FaIconComponent ],
  templateUrl: './settings-alerts.component.html',
  styleUrl: './settings-alerts.component.scss'
})
export class SettingsAlertsComponent implements OnChanges{

  faPersonDigging: IconDefinition = faPersonDigging;
  
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
