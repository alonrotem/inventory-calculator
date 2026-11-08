import { Component, EventEmitter, ViewChild, inject } from '@angular/core';
import { TranslationService } from '../../../i18n/translation.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-unsaved-changes-dialog',
  standalone: true,
  imports: [ ModalDialogComponent, FaIconComponent, TranslatePipe ],
  templateUrl: './unsaved-changes-dialog.component.html',
  styleUrl: './unsaved-changes-dialog.component.scss'
})
export class UnsavedChangesDialogComponent {
  private translation = inject(TranslationService);
  modalTitle: string = this.translation.t('common:dialogs.unsaved_title');
  modalText: string = this.translation.t('common:dialogs.unsaved_text');
  save_click: EventEmitter<void> = new EventEmitter<void>();
  discard_click: EventEmitter<void> = new EventEmitter<void>();
  cancel_click: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('dialog') dialog!: ModalDialogComponent;
  isOpen: boolean = false;
  faArrowLeft: IconDefinition = faArrowLeft;
  faSave: IconDefinition = faSave;

  public open() {
    this.dialog.open();
    this.isOpen = true;
  }

  public save(){
    this.save_click.emit();
    this.dialog.onConfirm();
  }

  public discard(){
    this.discard_click.emit();
    this.dialog.onConfirm();
  }

  public cancel(){
    this.cancel_click.emit();
    this.dialog.onCancel();
  }
}
