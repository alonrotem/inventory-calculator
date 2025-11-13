import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BackupService } from '../../../services/backup.service';
import { faArrowsRotate, faCloudUpload, faFileImport, faFolderOpen, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AnimationProp, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { FormsModule, NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-backup-upload',
  standalone: true,
  imports: [ FaIconComponent, ConfirmationDialogComponent, FormsModule, NgIf ],
  templateUrl: './backup-upload.component.html',
  styleUrl: './backup-upload.component.scss'
})
export class BackupUploadComponent implements AfterViewInit {
  file: File | null = null;
  no_file_selected_message: string = "No file selected";
  filename: string = this.no_file_selected_message;
  faCloudUpload: IconDefinition = faCloudUpload;
  faFolderOpen: IconDefinition = faFolderOpen;
  faFileImport: IconDefinition = faFileImport;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  isDragging = false;
  overwriterestore:boolean = true;
  isProcessing:boolean = false;
  @ViewChild("restore_confirm") restore_confirm!: ConfirmationDialogComponent;
  @ViewChild("backupFile") backupFile! :ElementRef;
  
  constructor(private backupService: BackupService, private toast: ToastService) {


  }  
  ngAfterViewInit(): void {
    this.restore_confirm.confirm.subscribe(() => {
      this.isProcessing = true;
      const formData = new FormData();
      if(this.file)
        formData.append('file', this.file);

      formData.append('data', JSON.stringify({ conf_del_all: this.overwriterestore }));

      this.backupService.uploadBackup(formData).subscribe({
        next: (response) => {
          //this.message = response.message || 'File uploaded successfully!';
          this.toast.showSuccess(response.message || 'File uploaded successfully!');
          this.file = null;
          this.filename = this.no_file_selected_message;
          formData.delete("file");
          formData.delete("data");
          this.backupFile.nativeElement.value = "";
          this.isProcessing = false;
        },
        error: (error) => {
          this.toast.showError("Failed to process backup");
          //console.dir(error);
          this.file = null;
          this.filename = this.no_file_selected_message;        
          formData.delete("file");
          formData.delete("data");
          this.backupFile.nativeElement.value = "";
          this.isProcessing = false;
        },
      });
    });
  }

  // Handle drag over
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  // Handle drag leave
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  // Handle file drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.file = files[0];
      if((!this.file.name.toUpperCase().endsWith(".ZIP")) && (!this.file.name.toUpperCase().endsWith(".SQL"))){
        this.toast.showError("File type must be .zip or .sql");
      }
      else {
        this.filename  = this.file.name;
      }
    }
    else {
      this.filename = this.no_file_selected_message;
    }
  }

    // Store the selected file
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.file = input.files[0];
        if((!this.file.name.toUpperCase().endsWith(".ZIP")) && (!this.file.name.toUpperCase().endsWith(".SQL"))){
          this.toast.showError("File type must be .zip or .sql");
        }
        else {
          var fakePath = input.value.split('\\');
          fakePath[fakePath.length - 1];
          this.filename  = fakePath[fakePath.length - 1];
        }
      }
      else {
        this.filename = this.no_file_selected_message;
      }
    }

      // Upload the file to the server
  onUpload(): void {
    if (!this.file) {
      return;
    }
    this.restore_confirm.open();
  }
}
