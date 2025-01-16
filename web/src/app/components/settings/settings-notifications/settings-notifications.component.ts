import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPersonDigging, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings-notifications',
  standalone: true,
  imports: [ FaIconComponent ],
  templateUrl: './settings-notifications.component.html',
  styleUrl: './settings-notifications.component.scss'
})
export class SettingsNotificationsComponent {
  faPersonDigging: IconDefinition = faPersonDigging;
}
