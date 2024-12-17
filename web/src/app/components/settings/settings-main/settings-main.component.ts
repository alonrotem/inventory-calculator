import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGears, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SettingsAlertsComponent } from '../settings-alerts/settings-alerts.component';
import { SettingsBackupComponent } from '../settings-backup/settings-backup.component';
import { SettingsNotificationsComponent } from '../settings-notifications/settings-notifications.component';
import { SettingsService } from '../../../services/settings.service';

enum settingsPage {
  alerts,
  notifications,
  backup,
};

@Component({
  selector: 'app-settings-main',
  standalone: true,
  imports: [ NgClass, RouterLink, FaIconComponent, SettingsAlertsComponent, SettingsBackupComponent, SettingsNotificationsComponent ],
  templateUrl: './settings-main.component.html',
  styleUrl: './settings-main.component.scss'
})
export class SettingsMainComponent {
  settings: any;
  currentUrl: string = '';
  faGears: IconDefinition = faGears;
  currentPage: settingsPage = settingsPage.alerts;
  settingsPage = settingsPage;

  constructor(private settingsService: SettingsService){
    this.settingsService.getSettings([]).subscribe({next: (settings:any) => {
      console.dir(settings);
      this.settings = settings;
    }});
  }
 
  setPage(page: settingsPage){
    this.currentPage = page;
  }
}
