import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPersonDigging, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-settings-notifications',
  standalone: true,
  imports: [TranslatePipe,  FaIconComponent ],
  templateUrl: './settings-notifications.component.html',
  styleUrl: './settings-notifications.component.scss'
})
export class SettingsNotificationsComponent {
  faPersonDigging: IconDefinition = faPersonDigging;
}
