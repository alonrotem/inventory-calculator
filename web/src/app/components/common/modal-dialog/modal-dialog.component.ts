import { Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgClass, NgIf } from '@angular/common';
import { ModalObjectEditor } from '../../../../types';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBorderNone, faTrashAlt, faW, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [ NgIf, NgClass, FaIconComponent ],
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.scss'
})
export class ModalDialogComponent {
  modalReference!: NgbModalRef;
  
  @ViewChild("content") content!: any;
  @ContentChild("modalContent") dialog_content_component!: ModalObjectEditor;
  @Input() btnText: string = "Open!";
  @Input() showOpenButton: boolean = false;
  @Input() modalTitle: string = "Modal";
  @Input() btnSaveText: string = "Save changes";
  @Input() btnCancelText: string = "Close";
  @Input() btnSaveIcon: IconDefinition = faBorderNone;
  @Input() btnSaveClass: string = "btn-primary";

  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  //@Input() editedItem: any;
  @Input() reverseButtons: boolean = false;
  modal_content_close_subscription:any;

  constructor(private modalService: NgbModal) { 

  }
  
  public open() {
    this.modalReference = this.modalService.open(this.content, { centered: true, size: 'm' });
    if(this.dialog_content_component.onOpen){
      this.dialog_content_component.onOpen();
    }

    if(this.dialog_content_component && this.dialog_content_component.close){
    this.modal_content_close_subscription = this.dialog_content_component.close.subscribe((obj :any) => {
        this.onConfirm();
      });
    }
  }

  onConfirm() {
    if(this.dialog_content_component.beforeClose)
    {
      let okToClose = this.dialog_content_component.beforeClose();
      if(!okToClose)
      {
        return;
      }
    }
    //if(this.dialog_content_component.beforeConfirm)
    //{
    //  console.log(this.dialog_content_component.beforeConfirm);
   //}
    if(this.dialog_content_component && this.dialog_content_component.editedObject)
    {
      this.confirm.emit(this.dialog_content_component.editedObject);
    }
    else
    {
      this.confirm.emit(true);
    }
    if(this.modal_content_close_subscription){
      this.modal_content_close_subscription.unsubscribe();
      this.modal_content_close_subscription = null;
    }
    this.modalReference.close();
  }

  onCancel () {
    this.cancel.emit();
    if(this.modal_content_close_subscription){
      this.modal_content_close_subscription.unsubscribe();
      this.modal_content_close_subscription = null;
    }
    this.modalReference.close();
  }
}
