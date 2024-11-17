import { Directive, EventEmitter, Host, Inject, Optional } from '@angular/core';
import { ModalDialog } from '../../../../types';
import { MODAL_OBJECT_EDITOR } from './modal-object-editor.token';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';

@Directive({
  selector: '[modalContent]',
  standalone: true // Mark as standalone
})
export class ModalContentDirective implements ModalDialog {
  constructor(@Optional() @Inject(MODAL_OBJECT_EDITOR) private host?: ModalDialog) {
  }
  dialogWrapper: ModalDialogComponent | null = null;

    editedObject: any;
  
    onOpen() {
      if (this.host?.onOpen) {
        this.host.onOpen(); // Call the component's implementation if provided
      } 
      else  {
        console.log('onOpen called from ModalContentDirective (no override)');
      }      
    }
    
    beforeClose(): Boolean {
      console.log(this.host);
      if (this.host?.beforeClose) {
        return this.host.beforeClose(); // Call the component's implementation if provided
      } 
      else {
        console.log('beforeClose called from ModalContentDirective (no override)');
        return true;
      }
    }
  
    close!: EventEmitter<any>;
}
