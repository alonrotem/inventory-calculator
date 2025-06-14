import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { Customer, Allocation_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, ModalDialog } from '../../../../types';
import { CustomerBanksTableComponent } from '../customer-banks-table/customer-banks-table.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-hat-allocation-editor-picker',
  standalone: true,
  imports: [ ModalDialogComponent, CustomerBanksTableComponent, NgFor, ModalContentDirective ],
  templateUrl: './hat-allocation-editor-picker.component.html',
  styleUrl: './hat-allocation-editor-picker.component.scss',
    providers: [
        {
          provide: MODAL_OBJECT_EDITOR,
          useExisting: HatAllocationEditorPickerComponent
        }
      ]
})
export class HatAllocationEditorPickerComponent implements ModalContentDirective, ModalDialog, AfterViewInit {

  @ViewChild("dialog") dialogWrapper!: ModalDialogComponent;
  @ViewChild("banks_table") banks_table!: CustomerBanksTableComponent;
  
  editedObject: any = null;
  close: EventEmitter<any> = new EventEmitter();
  @Input() customer: Customer = {
    id: 0, name: '', business_name: '', email: '', phone: '', tax_id: '',
    created_at: new Date(), updated_at: new Date(), created_by: 0, updated_by: 0,
    banks: [], banks_baby_allocations: [], babies: [],
    customer_code: ''
  };
  @Input() wing_id: number = 0;
  @Input() banks: Customer_Bank[] = [];
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Allocation_Baby[] = [];
  @Output() allocation_selected = new EventEmitter<Customer_Bank_Baby_Allocation>();

  ngAfterViewInit(): void {
    if(this.banks_table){
      this.banks_table.collapsed_babies_lists = true;
    }
  }

  onOpen(): void {
    console.log("picker says: wing id is " + this.wing_id);
    if(this.banks_table){
      this.banks_table.collapsed_babies_lists = true;
      this.banks_table.wing_id = this.wing_id;
    }
  }

  banks_table_init(){
    if(this.banks_table){
      this.banks_table.collapsed_babies_lists = true;
    }
  }

  cancel_changes(){
    this.banks_table.undo_changes();
  }

  beforeClose(): Boolean {
    return true;
  }
  
  allocation_clicked(alloc: Customer_Bank_Baby_Allocation){
    this.allocation_selected.emit(alloc);
    this.dialogWrapper.onConfirm();
  }
}
