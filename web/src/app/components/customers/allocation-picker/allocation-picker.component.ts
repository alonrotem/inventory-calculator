import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, ViewChild } from '@angular/core';
import { Allocation_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, ModalDialog } from '../../../../types';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DialogClosingReason, ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { SumPipe } from '../../../utils/pipes/sum-pipe';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-allocation-picker',
  standalone: true,
  imports: [
    NgFor, NgIf, FilterPipe, FaIconComponent, ModalDialogComponent, ModalContentDirective, 
    DecimalPipe, SumPipe, ConfirmationDialogComponent 
  ],
  templateUrl: './allocation-picker.component.html',
  styleUrl: './allocation-picker.component.scss',  
  providers: [
      {
        provide: MODAL_OBJECT_EDITOR,
        useExisting: AllocationPickerComponent
      }
    ]
})
export class AllocationPickerComponent implements ModalContentDirective, ModalDialog, AfterViewInit {


  @ViewChild("tooltip", { read: ElementRef }) tooltip!: ElementRef;
  @ViewChild("dialog") dialogWrapper!: ModalDialogComponent;
  @ViewChild("pickConfirmation") pickConfirmation!:ConfirmationDialogComponent;

  @Input() banks: Customer_Bank[] = [];
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Allocation_Baby[] = [];
  @Input() instructions: string = "";
  @Input() confirmAction: boolean = false;

  editedObject: number = -1;
  close: EventEmitter<any> = new EventEmitter<number>();
  show_tooltip = false;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;

  ngAfterViewInit(): void {
  }

  open(bank_id: number) {
    this.editedObject = -1;
    this.dialogWrapper.open();
  }

  onOpen() {
  }

  beforeClose(reason: DialogClosingReason): Boolean {
    return true;
  }

  async allocation_clicked(allocation_id: number) {
    this.editedObject = allocation_id;
    if(this.confirmAction){
      const result = await this.pickConfirmation.open_with_message({
        modalText: "Are you sure you want to merge the baabies into this allocation?",
        modalTitle: "Merge confirmation",
        btnYesText: "Merge",
        btnYesClass: "btn-warning"
      });
      
      if(result){
        this.dialogWrapper.onConfirm();
      }
      else {
        this.editedObject = -1;
      }     
    }
    else {
      this.dialogWrapper.onConfirm();
    }
  }
}
