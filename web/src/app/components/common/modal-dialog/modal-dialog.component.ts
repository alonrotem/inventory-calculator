import { Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { ModalObjectEditor } from '../../../../types';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBorderNone, faTrashAlt, faW, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [ NgIf, FaIconComponent ],
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
  @Input() editedItem: any;

  constructor(private modalService: NgbModal) { }
  
  public open() {
    console.log("modal-dialog open!")
    this.modalReference = this.modalService.open(this.content, { centered: true, size: 'm' });
    if(this.dialog_content_component.onOpen){
      this.dialog_content_component.onOpen();
    }
  }

  onConfirm() {
    if(this.dialog_content_component.beforeClose)
    {
      let okToClose = this.dialog_content_component.beforeClose();
      if(!okToClose)
      {
        console.log("Pre closing validation: " + okToClose);
        return;
      }
    }
    //if(this.dialog_content_component.beforeConfirm)
    //{
    //  console.log(this.dialog_content_component.beforeConfirm);
   //}
    if(this.dialog_content_component && this.dialog_content_component.editedObject)
    {
      console.log(this.dialog_content_component.editedObject);
      this.confirm.emit(this.dialog_content_component.editedObject);
    }
    else
    {
      this.confirm.emit(true);
    }
    this.modalReference.close();
  }

  onCancel () {
    this.cancel.emit();
    this.modalReference.close();
  }
}
