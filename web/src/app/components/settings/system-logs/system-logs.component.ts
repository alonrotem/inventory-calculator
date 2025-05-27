import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SystemLogsService } from '../../../services/system-logs.service';
import { LogfileListItem } from '../../../../types';
import { ToastService } from '../../../services/toast.service';
import { faArrowsRotate, faTrash, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgIf } from '@angular/common';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { BackupService } from '../../../services/backup.service';
import { ConfirmationDialogComponent } from "../../common/confirmation-dialog/confirmation-dialog.component";
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";
import { FileSizePipe } from '../../../utils/pipes/file-size-pipe';

@Component({
  selector: 'app-system-logs',
  standalone: true,
  imports: [FaIconComponent, NgFor, NgIf, DateStrPipe, ConfirmationDialogComponent, ModalDialogComponent, FileSizePipe],
  templateUrl: './system-logs.component.html',
  styleUrl: './system-logs.component.scss'
})
export class SystemLogsComponent implements OnInit, AfterViewInit {
  logFiles: LogfileListItem[] = [];
  loading: boolean = true;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faTrash: IconDefinition = faTrash;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  preview_filename: string = "Log preview";
  preview_filesize: number = 0;
  preview_loading: boolean = false;
  previewing: boolean = false;
  log_content: string[] = [];
  pending_clear_file: string = "";
  @ViewChild("confirm_delete_logs") confirm_delete_logs!: ConfirmationDialogComponent;
  @ViewChild("log_preview") log_preview!: ModalDialogComponent;
  
  constructor(private systemLogsService: SystemLogsService, private backupservice:BackupService, private toastService: ToastService) {}
  
  ngOnInit(): void {
    this.loadLogFilesList();
  }

  ngAfterViewInit(): void {
    this.confirm_delete_logs.confirm.subscribe((conf:boolean) => {
      if(this.pending_clear_file){
        this.clearLogFile_confirmed();
      }
      else {
        this.deleteAllLogs_confirm();
      }
    });
    this.log_preview.cancel.subscribe(() => {
      this.previewing = false;
    });
  }

  loadLogFilesList() {
    this.loading = true;
    this.systemLogsService.getLogsList().subscribe({
      next:(logs: LogfileListItem[]) => {
        this.logFiles = logs.sort((f1, f2) => { return new Date(f2.date).getTime() - new Date(f1.date).getTime() });
        this.loading = false;
      },
      error: (err: any) => {
        this.toastService.showError("Failed to load log files");
        console.log(err);
        this.logFiles = [];
        this.loading = false;
      }
    });

  }

  downloadLogFile(filename: string) {
    this.systemLogsService.downloadLogFile(filename).subscribe({ next: (response) => {
      const ab = response.headers.keys();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = this.backupservice.extractFilename(contentDisposition) || 'logfile.log';

      // Create a link element and trigger the download
      const blob = new Blob([response.body!], { type: response.body!.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url); // Clean up URL
    },
    error: (err) => { 
      this.toastService.showError(err);
    }
  });
  }

  viewLogFile(logfilename: string, size: number) {
    this.load_preview(logfilename, size);
    this.previewing = true;
    this.log_preview.open();
  }

  load_preview(logfilename: string, size: number){
    this.preview_loading = true;
    this.systemLogsService.getLogFileContent(logfilename).subscribe((lines: string[]) => {
      this.preview_filename = logfilename;
      this.preview_filesize = size;
      lines = lines.map(line => { 
        return line.replace(
          /^(\[[^\]]*\])\s*([^\:]*)(\:.*)/, 
          `<span class='timestamp'>$1</span> <span class='level_$2'>$2$3</span>`); })
      this.log_content = lines;
      this.preview_loading = false;
    });
  }

  downloadallLogs() {
    this.systemLogsService.downloadAllLogs().subscribe({ next: (response) => {
      const ab = response.headers.keys();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = this.backupservice.extractFilename(contentDisposition) || 'logfile.log';

      // Create a link element and trigger the download
      const blob = new Blob([response.body!], { type: response.body!.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url); // Clean up URL
    },
    error: (err) => { 
      this.toastService.showError(err);
    }
  });
  }

  clearLogFile(logfilename: string){
    this.confirm_delete_logs.confirmation_dialog.modalTitle="Clear log file";
    this.confirm_delete_logs.modalText=`Are you sure you want to clear this log file, '${logfilename}'?`;
    this.confirm_delete_logs.btnYesIcon=this.faTrash;
    this.confirm_delete_logs.confirmation_dialog.btnSaveText="Clear that MF!"
    this.confirm_delete_logs.btnYesClass="btn-danger"
    this.confirm_delete_logs.btnNoText="Cancel";
    this.pending_clear_file = logfilename;
    this.confirm_delete_logs.open();
  }

  clearLogFile_confirmed(){
    this.loading = true;
    const logfilename = this.pending_clear_file;
    if(logfilename) {
      this.systemLogsService.deleteLogFile(logfilename).subscribe({
        next:(logs: LogfileListItem[]) => {
          this.logFiles = logs.sort((f1, f2) => { return new Date(f2.date).getTime() - new Date(f1.date).getTime() });
          this.loading = false;
          this.pending_clear_file = "";
          if(this.previewing) {
            this.load_preview(logfilename, this.preview_filesize);
          }
        },
        error: (err: any) => {
          this.toastService.showError("Failed to load log files");
          console.log(err);
          this.logFiles = [];
          this.loading = false;
          this.pending_clear_file = "";
        }
      });
    }
  }

  deleteAllLogs(){  
    this.confirm_delete_logs.modalTitle="Clear system logs";
    this.confirm_delete_logs.modalText="Are you sure you want to delete all the system logs?";
    this.confirm_delete_logs.btnYesIcon=this.faTrash;
    this.confirm_delete_logs.confirmation_dialog.btnSaveText="Clear 'em!"
    this.confirm_delete_logs.btnYesClass="btn-danger"
    this.confirm_delete_logs.btnNoText="Cancel";
    this.confirm_delete_logs.open();
  }

  deleteAllLogs_confirm(){
    this.loading = true;
    this.systemLogsService.deleteAllLogs().subscribe({
      next:(logs: LogfileListItem[]) => {
        this.logFiles = logs.sort((f1, f2) => { return new Date(f2.date).getTime() - new Date(f1.date).getTime() });
        this.loading = false;
      },
      error: (err: any) => {
        this.toastService.showError("Failed to load log files");
        console.log(err);
        this.logFiles = [];
        this.loading = false;
      }
    });
  }
}
