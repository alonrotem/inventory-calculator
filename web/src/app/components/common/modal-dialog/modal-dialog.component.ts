import { Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { ModalObjectEditor } from '../../../../types';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [ NgIf ],
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

  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() editedItem: any;

  constructor(private modalService: NgbModal) { }
  
  public open() {
    this.modalReference = this.modalService.open(this.content, { centered: true, size: 'm' });
  }

  onConfirm() {
    let okToClose = this.dialog_content_component.beforeClose();
    if(!okToClose)
    {
      console.log("Pre closing validation: " + okToClose);
      return;
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
    this.modalReference.close();
  }

  onCancel () {
    this.cancel.emit();
    this.modalReference.close();
  }
}
