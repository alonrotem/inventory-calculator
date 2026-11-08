import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPersonDigging, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-settings-alerts',
  standalone: true,
  imports: [TranslatePipe,  NgIf, FormsModule, FaIconComponent ],
  templateUrl: './settings-alerts.component.html',
  styleUrl: './settings-alerts.component.scss'
})
export class SettingsAlertsComponent implements OnChanges{

  faPersonDigging: IconDefinition = faPersonDigging;
  
  @Output() settings_changed: EventEmitter<void> = new EventEmitter<void>();
  @Input() settings: Record<string, string> = {};

  ngOnChanges(changes: SimpleChanges): void {
    //console.dir(this.settings);
  }
  emit_settings_changed() {
    //console.log("change!");
    this.settings_changed.emit();
  }
}
