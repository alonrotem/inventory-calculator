import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Customer_Baby, Customer_Bank, Customer_Bank_Baby_Allocation } from '../../../../types';
import { RouterModule } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { BabiesTableComponent } from '../../babies/babies-table/babies-table.component';
import { faChartPie, faTrashCan, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-customer-banks-table',
  standalone: true,
  imports: [ RouterModule, NgFor, FilterPipe, NgIf, BabiesTableComponent, FaIconComponent, 
    DecimalPipe, ConfirmationDialogComponent ],
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
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faTrashCan: IconDefinition = faTrashCan;
  faChartPie: IconDefinition = faChartPie;
  newAllcoationCounter: number = -1;
  pendingDeletionAllocation: number = -999;

  constructor() {  }

  ngAfterViewInit(): void {

    this.delete_allocation_dialog.confirm.subscribe((response:any) => {
      if(this.pendingDeletionAllocation != -999) {
        this.delete_allocation_confirmed(this.pendingDeletionAllocation);
        this.pendingDeletionAllocation = -999;
      }
    });
    
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
}
