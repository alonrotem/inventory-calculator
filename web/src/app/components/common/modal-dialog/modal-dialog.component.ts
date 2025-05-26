import { Component, ContentChild, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgClass, NgIf } from '@angular/common';
//import { ModalObjectEditor } from '../../../../types';
//import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBorderNone, faTrashAlt, faW, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ModalContentDirective } from '../directives/modal-content.directive';
import { ModalDialog } from '../../../../types';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [ NgIf, NgClass, FaIconComponent ],
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.scss'
})
export class ModalDialogComponent implements ModalDialog {
  modalReference!: NgbModalRef;
  
  @ViewChild("content") content!: any;
  // @ContentChild("modalContent") dialog_content_component!: ModalObjectEditor;
  @Input() btnText: string = "Open!";
  @Input() showOpenButton: boolean = false;
  @Input() hide_buttons: boolean = false;
  @Input() modalTitle: string = "Modal";
  @Input() btnSaveText: string = "Save changes";
  @Input() btnCancelText: string = "Close";
  @Input() btnSaveIcon: IconDefinition = faBorderNone;
  @Input() btnSaveClass: string = "btn-primary";
  @Input() btnCancelClass: string = "btn-secondary";
  @Input() modalSize: string = "m";
  @Input() fullscreen: boolean = false;
  @Input() modalBodyClass: string = "";

  @Output() confirm = new EventEmitter<any>();
  @Output("cancel") cancel = new EventEmitter<void>();
  //@Input() editedItem: any;
  @Input() reverseButtons: boolean = false;
  modal_content_close_subscription:any;
  isOpen : boolean = false;

  @ContentChild(ModalContentDirective) dialogContentComponent!: ModalContentDirective;

  constructor(private modalService: NgbModal) { }
  dialogWrapper: ModalDialogComponent | null = null;
  
  editedObject = null;
  onOpen() { }
  beforeClose(): Boolean { return true; }
  close: EventEmitter<any> = new EventEmitter<any>();
  
  public open() {
    //console.log(this.modalSize);
    this.modalReference = this.modalService.open(this.content, { centered: true, size: this.modalSize, fullscreen: this.fullscreen });
    //console.log("openning " +this.dialogContentComponent);
    if(this.dialogContentComponent){
      this.dialogContentComponent.onOpen();

      if(this.dialogContentComponent.close){
        this.modal_content_close_subscription = this.dialogContentComponent.close.subscribe((obj :any) => {
          this.onConfirm();
        });
      }
      this.isOpen = true;
    }
    /*
    if(this.dialog_content_component && this.dialog_content_component.onOpen){
      this.dialog_content_component.onOpen();
    }

    if(this.dialog_content_component && this.dialog_content_component.close){
    this.modal_content_close_subscription = this.dialog_content_component.close.subscribe((obj :any) => {
        this.onConfirm();
      });
    }*/
  }


  @HostListener('document:keyup.escape', ['$event']) onEscdownHandler(evt: KeyboardEvent) {
    if(this.isOpen) {
      evt.preventDefault();
      console.log("ESC Caught");
      this.onCancel();
    }
  }

  @HostListener('document:keyup.enter', ['$event']) onEnterdownHandler(evt: KeyboardEvent) {
    if(this.isOpen) {
      evt.preventDefault();
      console.log("Enter Caught");
      this.onConfirm();
    }
  }

  onConfirm() {
    if(this.dialogContentComponent)
    {
      let okToClose = this.dialogContentComponent.beforeClose();
      if(!okToClose)
      {
        return;
      }
    }
    if(this.dialogContentComponent && this.dialogContentComponent["host"] && this.dialogContentComponent["host"].editedObject)
    {
      this.confirm.emit(this.dialogContentComponent["host"].editedObject);
    }
    else
    {
      this.confirm.emit(true);
    }
    if(this.modal_content_close_subscription){
      this.modal_content_close_subscription.unsubscribe();
      this.modal_content_close_subscription = null;
    }
    if(this.modalReference && this.modalReference.close)
      this.modalReference.close();

    this.isOpen = false;
  }

  onCancel () {
    this.cancel.emit();
    if(this.modal_content_close_subscription){
      this.modal_content_close_subscription.unsubscribe();
      this.modal_content_close_subscription = null;
    }
    if(this.modalReference && this.modalReference.close) {
      this.modalReference.close();
    }
    this.isOpen = false;
  }
}
