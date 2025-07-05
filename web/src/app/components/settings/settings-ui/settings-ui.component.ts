import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';
import { faPaintRoller, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-settings-ui',
  standalone: true,
  imports: [ FormsModule, NgIf, FaIconComponent ],
  templateUrl: './settings-ui.component.html',
  styleUrl: './settings-ui.component.scss'
})
export class SettingsUiComponent {
  currentUrl: string = '';
  faPaintRoller: IconDefinition = faPaintRoller;
  @Input() settings: Record<string, string> = {};
  @Output() settings_changed: EventEmitter<void> = new EventEmitter<void>();

  constructor(){
  }

  emit_settings_changed() {
    this.settings_changed.emit();
  }
}
