import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { BackupService } from '../../../services/backup.service';
import { faCloudDownload, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-settings-backup',
  standalone: true,
  imports: [ FaIconComponent ],
  templateUrl: './settings-backup.component.html',
  styleUrl: './settings-backup.component.scss'
})
export class SettingsBackupComponent {
  faCloudDownload: IconDefinition = faCloudDownload;
  
  constructor(private backupService: BackupService){

  }

  get_backup() {
    this.backupService.getBackup().subscribe((response) => {
      const ab = response.headers.keys();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = this.backupService.extractFilename(contentDisposition) || 'backup_file';

      // Create a link element and trigger the download
      const blob = new Blob([response.body!], { type: response.body!.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url); // Clean up URL
    });
  }


}
