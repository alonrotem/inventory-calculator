import { AfterViewInit, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { DialogClosingReason, ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MODAL_OBJECT_EDITOR } from '../../common/directives/modal-object-editor.token';
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { Customer, Allocation_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, ModalDialog, Bank_Allocation_Type } from '../../../../types';
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
  banksTableOpen: boolean = false;
  banksTableJustClosedDontCloseJustYet: boolean = false;
  
  editedObject: any = null;
  close: EventEmitter<any> = new EventEmitter();
  @Input() customer: Customer = {
    id: 0, name: '', business_name: '', email: '', phone: '', tax_id: '',
    created_at: new Date(), updated_at: new Date(), created_by: 0, updated_by: 0,
    banks: [], banks_baby_allocations: [], babies: [],
    customer_code: '', order_seq_number: 0, is_demo_customer: false,
    knives: [],
    default_mayler_width: null,
    default_num_of_wings_per_hat: null,
    is_disabled: false
  };
  @Input() wing_id: number = 0;
  @Input() banks: Customer_Bank[] = [];
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Allocation_Baby[] = [];
  @Input() num_wings_per_hat: number = 44;
  @Output() allocation_selected = new EventEmitter<Customer_Bank_Baby_Allocation>();
  @Output() customer_updated = new EventEmitter<Customer>();
  @Output() babies_of_selected_allocation_updated = new EventEmitter<void>();
  @Input() banks_baby_allocation_type_filter: Bank_Allocation_Type | null = null;
  @Input() selected_allocation_id: number | null = null;
  @Output() selected_allocation_idChange = new EventEmitter<number | null>();

  ngAfterViewInit(): void {
    if(this.banks_table){
      this.banks_table.collapsed_babies_lists = true;
    }
  }

  onOpen(): void {
    //console.log("picker says: wing id is " + this.wing_id);
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

  babies_picker_open() { this.banksTableOpen = true; /*console.log("caught baby picker open! ok to close: " + (!this.banksTableOpen));*/ }
  babies_picker_closed() { this.banksTableOpen = false;  this.banksTableJustClosedDontCloseJustYet= false; /*console.log("caught baby picker close! ok to close: " + (!this.banksTableOpen));*/ }

  @HostListener('document:keyup.escape', ['$event']) onEscdownHandler(evt: KeyboardEvent) {
    if(this.banksTableOpen) {
      this.banksTableJustClosedDontCloseJustYet= true;
    }
  }

  cancel_changes(){
    this.banks_table.undo_changes();
  }

  beforeClose(reason: DialogClosingReason): Boolean {
    //console.log("---- ok to close: " + (!this.banksTableOpen) + ", banksTableJustClosedDontCloseJustYet:" + this.banksTableJustClosedDontCloseJustYet + " ----");
    if(this.banksTableOpen)
      return false;
    if(this.banksTableJustClosedDontCloseJustYet)
    {
      this.banksTableJustClosedDontCloseJustYet = false;
      return false;      
    }
    return true;
  }

  babies_updated(babies:Allocation_Baby[]){
    //console.log("babies_updated. customer: ", this.customer, " babies: ", babies);
    let updated_allocation_id: number | null = null;
    if(babies.length > 0){
      updated_allocation_id = babies[0].allocation_id;
    }
    if(updated_allocation_id != null && updated_allocation_id == this.selected_allocation_id){
      const alloc = this.banks_baby_allocations.find(a => a.id == updated_allocation_id);
      this.banks_table.save_customer();
      this.selected_allocation_id = updated_allocation_id;
      this.selected_allocation_idChange.emit(updated_allocation_id);
      this.allocation_selected.emit(alloc);
      this.banksTableOpen = false; //ok to close
      this.dialogWrapper.onConfirm();



      this.babies_of_selected_allocation_updated.emit();
    }
  }
  
  allocation_clicked(alloc: Customer_Bank_Baby_Allocation){
    this.selected_allocation_id = alloc.id;
    this.selected_allocation_idChange.emit(alloc.id);
    this.allocation_selected.emit(alloc);
    this.dialogWrapper.onConfirm();
  }

  update_customer(customer: Customer){
    this.customer_updated.emit(customer);
  }
}
