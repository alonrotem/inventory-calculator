import { Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

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
  @Input() btnText: string = "Open!";
  @Input() showOpenButton: boolean = false;

  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() editedItem: any;

  constructor(private modalService: NgbModal) { }
  @ContentChild('modalContent') dialog_content_component: any;

  public open() {
    this.modalReference = this.modalService.open(this.content, { centered: true, size: 'm' });
  }

  onConfirm() {
    if(this.dialog_content_component && this.dialog_content_component.outputObj)
    {
      console.log(this.dialog_content_component.outputObj);
      this.confirm.emit(this.dialog_content_component.outputObj);
    }
    this.modalReference.close();
  }

  onCancel () {
    this.cancel.emit();
    this.modalReference.close();
  }
}
