import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Baby, Customer_Baby, Customer_Bank, Customer_Bank_Baby_Allocation } from '../../../../types';
import { RouterModule } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { BabiesTableComponent } from '../../babies/babies-table/babies-table.component';
import { faChartPie, faPencil, faTrashCan, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { BankAllocationDialogComponent } from '../bank-allocation-dialog/bank-allocation-dialog.component';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { SortPipe } from '../../../utils/pipes/sort-pipe';

@Component({
  selector: 'app-customer-banks-table',
  standalone: true,
  imports: [ RouterModule, NgFor, FilterPipe, NgIf, BabiesTableComponent, FaIconComponent, 
    DecimalPipe, ConfirmationDialogComponent, BankAllocationDialogComponent, BabyEditorDialogComponent, SortPipe ],
  templateUrl: './customer-banks-table.component.html',
  styleUrl: './customer-banks-table.component.scss'
})
export class CustomerBanksTableComponent implements AfterViewInit {
  @Input() bank: Customer_Bank = {
    raw_material_name: '',
    id: 0,
    customer_id: 0,
    raw_material_id: 0,
    quantity: 0,
    remaining_quantity: 0,
    raw_material_quantity_units: ''
  };
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Customer_Baby[] = [];
  @Input() raw_material_quantity_units: string = "";
  @Output() bank_changed = new EventEmitter<void>();
  @ViewChild('delete_allocation_dialog') delete_allocation_dialog!: ConfirmationDialogComponent;
  @ViewChild('allocation_dialog') allocation_dialog!: BankAllocationDialogComponent;
  @ViewChild('babies_picker') babies_picker!: BabyEditorDialogComponent;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faPencil: IconDefinition = faPencil;
  faTrashCan: IconDefinition = faTrashCan;
  faChartPie: IconDefinition = faChartPie;
  newAllcoationCounter: number = -1;
  pendingDeletionAllocation: number = -999;
  pendingBabyAppendAllocation: number = -999;
  pendingBabyAppendBaby: number = -999;
  newAllocationIdCounter = -1;

  constructor() { 
   }

  ngAfterViewInit(): void {

    this.delete_allocation_dialog.confirm.subscribe((response:any) => {
      if(this.pendingDeletionAllocation != -999) {
        this.delete_allocation_confirmed(this.pendingDeletionAllocation);
        this.pendingDeletionAllocation = -999;
      }
    });
    this.babies_picker.dialogWrapper.modalTitle = "Modify babies in allocation";
    this.babies_picker.dialogWrapper.btnSaveText = "Save";
    this.babies_picker.dialogWrapper.confirm.subscribe((baby: Baby) => { this.babies_dialog_closed(baby); });

    this.allocation_dialog.dialogWrapper.modalTitle = "Manage allocation";
  }

  delete_allocation(allocationId:number){
    let babiesCount = this.babies.filter(b => b.customer_banks_babies_id == allocationId).length;
    if(babiesCount == 0){
      this.delete_allocation_confirmed(allocationId);
    }
    else {
      this.pendingDeletionAllocation = allocationId;
      this.delete_allocation_dialog.open();
    }
  }
  delete_allocation_confirmed(allocationId:number){
    let baby_index = 999;
    let deleted = false;
    while (baby_index >= 0){
      baby_index = this.babies.findIndex(b => b.customer_banks_babies_id == allocationId);
      if(baby_index >= 0){
        this.babies.splice(baby_index, 1);
        deleted = true;
      }
    }
    let allocation_index = this.banks_baby_allocations.findIndex(a => a.id == allocationId);
    if(allocation_index >= 0){
      this.banks_baby_allocations.splice(allocation_index, 1);
      deleted = true;
    }
    if(deleted)
      this.bank_changed.emit();
  }

  open_allocation_dialog(allocation_id: number) {
    
    //bank.remaining_quantity
    this.allocation_dialog.open();
  }

  delete_baby(baby_id: number) {
    let babyIndex = this.babies.findIndex(b => b.id == baby_id);
    if(babyIndex >= 0)
    {
      this.babies.splice(babyIndex, 1);
    }
    this.bank_changed.emit();
  }

  open_babies_dialog(bank_allocation_id: number, baby_length: number) {
    this.pendingBabyAppendAllocation = bank_allocation_id;
    this.pendingBabyAppendBaby = baby_length;
    let baby_to_edit = this.babies.find(b => b.length == baby_length && b.customer_banks_babies_id == this.pendingBabyAppendAllocation);
    this.babies_picker.editedObject = {
      id: 0,
      raw_material_parent_id: 0,
      raw_material: '',
      length: 0,
      quantity: 0,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 1,
      updated_by: 1
    };
    if(baby_to_edit){
      this.babies_picker.editedObject.quantity = baby_to_edit.quantity;
      this.babies_picker.editedObject.length = baby_to_edit.length;
    }
    this.babies_picker.dialogWrapper.open();
  }

  babies_dialog_closed(baby: Baby) {
    let baby_to_edit = this.babies.find(b => b.length == baby.length && b.customer_banks_babies_id == this.pendingBabyAppendAllocation);
    if(baby_to_edit) {
      baby_to_edit.quantity = baby.quantity;
    }
    else {
      this.babies.push({
        id: 0,
        customer_banks_babies_id: this.pendingBabyAppendAllocation,
        length: baby.length,
        quantity: baby.quantity
      });
    }
    this.pendingBabyAppendAllocation = -999;
    this.pendingBabyAppendBaby = -999;
  }
}
