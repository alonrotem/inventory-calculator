import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGears, faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SettingsAlertsComponent } from '../settings-alerts/settings-alerts.component';
import { BackupDownloadComponent } from '../../backup/backup-download/backup-download.component';
import { SettingsNotificationsComponent } from '../settings-notifications/settings-notifications.component';
import { SettingsService } from '../../../services/settings.service';
import { BackupUploadComponent } from '../../backup/backup-upload/backup-upload.component';
import { SystemLogsComponent } from "../system-logs/system-logs.component";
import { SettingsUiComponent } from "../settings-ui/settings-ui.component";
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable } from 'rxjs';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { UnsavedChangesDialogComponent } from '../../common/unsaved-changes-dialog/unsaved-changes-dialog.component';
import { ToastService } from '../../../services/toast.service';

enum settingsPage {
  alerts,
  notifications,
  ui,
  backup,
  system_logs
};

@Component({
  selector: 'app-settings-main',
  standalone: true,
  imports: [
    NgClass, RouterLink, FaIconComponent, SettingsAlertsComponent, BackupDownloadComponent, BackupUploadComponent, 
    SettingsNotificationsComponent, SystemLogsComponent, SettingsUiComponent, NgIf, UnsavedChangesDialogComponent],
  templateUrl: './settings-main.component.html',
  styleUrl: './settings-main.component.scss'
})
export class SettingsMainComponent implements HasUnsavedChanges {
  settings: Record<string, string> = {};
  unchanged_settings: Record<string, string> = {};
  pending_changes: boolean = false;
  currentUrl: string = '';
  faGears: IconDefinition = faGears;
  faSave: IconDefinition = faSave;
  currentPage: settingsPage = settingsPage.alerts;
  settingsPage = settingsPage;
  @ViewChild('btn_save') btn_save!: ElementRef;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;

  constructor(
    private settingsService: SettingsService, 
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService,
    private toastService: ToastService
  ){
    this.settingsService.getSettings([]).subscribe({next: (settings:any) => {
      this.settings = settings;
      this.unchanged_settings = { ...settings };
    }});
  }
 
    hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () => this.pending_changes,

      saveFn: () => this.settingsService.saveSettings(this.settings),

      confirmationDialog: this.unsaved_changes_dialog
    });
  }

 
  setPage(page: settingsPage){
    this.currentPage = page;
  }

  check_changes(){
    this.pending_changes = false;
    for (const key in this.settings)
    {
      if(this.unchanged_settings[key] != this.settings[key]){
        //console.log("Detected change: [" + key + "] " + this.unchanged_settings[key] + " -> " + this.settings[key]);
        this.pending_changes = true;
        //break;
      }
    }
    if(!this.pending_changes){
      //console.log("Nothing changed, or everything back to normal!")
    }
  }

  save_settings(){
    this.btn_save.nativeElement.classList.add("disabled");
    this.settingsService.saveSettings(this.settings).subscribe(
    {
      next:(data) => { 
        this.toastService.showSuccess("Saved successfully!");
        this.btn_save.nativeElement.classList.remove("disabled");
        this.pending_changes = false;
      },
      error:(error) => { 
        this.toastService.showError("Server error saving customer");        
        this.btn_save.nativeElement.classList.remove("disabled");
      }
    });
  }
}
