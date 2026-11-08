import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { BackupService } from '../../../services/backup.service';
import { faArrowsRotate, faCloudUpload, faFileImport, faFolderOpen, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AnimationProp, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { FormsModule, NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { TranslationService } from '../../../i18n/translation.service';

@Component({
  selector: 'app-backup-upload',
  standalone: true,
  imports: [TranslatePipe,  FaIconComponent, ConfirmationDialogComponent, FormsModule, NgIf ],
  templateUrl: './backup-upload.component.html',
  styleUrl: './backup-upload.component.scss'
})
export class BackupUploadComponent implements AfterViewInit {
  private translation = inject(TranslationService);

  file: File | null = null;
  no_file_selected_message: string = this.translation.t('backup:no_file');
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
        this.toast.showError(this.translation.t('backup:bad_type'));
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
          this.toast.showError(this.translation.t('backup:bad_type'));
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
  async onUpload() {
    if (!this.file) {
      return;
    }

    const confirm_reply = await this.restore_confirm.open_with_message({
      modalText: this.translation.t('backup:confirm_text') + "<div class='text-danger'><strong>" + this.translation.t('backup:confirm_warning') + "</strong></div>",
      modalTitle: this.translation.t('backup:confirm_title'),
      btnYesIcon: faCloudUpload,
      btnYesText: this.translation.t('common:actions.yes'),
      btnYesClass: "btn-danger"
    });

    if (confirm_reply) {
      this.isProcessing = true;
      const formData = new FormData();
      if(this.file)
        formData.append('file', this.file);

      formData.append('data', JSON.stringify({ conf_del_all: this.overwriterestore }));
      this.backupService.uploadBackup(formData).subscribe({
        next: (response) => {
          //this.message = response.message || this.translation.t('backup:uploaded');
          this.toast.showSuccess(response.message || this.translation.t('backup:uploaded'));
          this.file = null;
          this.filename = this.no_file_selected_message;
          formData.delete("file");
          formData.delete("data");
          this.backupFile.nativeElement.value = "";
          this.isProcessing = false;
        },
        error: (error) => {
          this.toast.showError(this.translation.t('backup:failed'));
          //console.dir(error);
          this.file = null;
          this.filename = this.no_file_selected_message;        
          formData.delete("file");
          formData.delete("data");
          this.backupFile.nativeElement.value = "";
          this.isProcessing = false;
        },
      });
    } 
  }
}
