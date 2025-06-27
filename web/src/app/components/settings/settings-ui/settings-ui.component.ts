import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings-ui',
  standalone: true,
  imports: [ FormsModule, NgIf ],
  templateUrl: './settings-ui.component.html',
  styleUrl: './settings-ui.component.scss'
})
export class SettingsUiComponent {
  settings: any;
  currentUrl: string = '';

  constructor(private settingsService: SettingsService){
    this.settingsService.getSettings([]).subscribe({next: (settings:any) => {
      this.settings = settings;
    }});
  }
}
