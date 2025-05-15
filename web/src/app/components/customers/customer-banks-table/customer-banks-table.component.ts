import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Baby, Customer, Customer_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, HistoryReportRecord, TransactionRecord, TransactionType, Wing, ShortWingsInfo } from '../../../../types';
import { RouterModule } from '@angular/router';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { faChartPie, faCheck, faCodeMerge, faPencil, faSave, faTrashCan, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { BankAllocationDialogComponent } from '../bank-allocation-dialog/bank-allocation-dialog.component';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { SortPipe } from '../../../utils/pipes/sort-pipe';
import { BankHistoryDialogComponent } from '../bank-history-dialog/bank-history-dialog.component';
import { HatsService } from '../../../services/hats.service';
import { WingsService } from '../../../services/wings.service';
import { AllocationPickerComponent } from '../allocation-picker/allocation-picker.component';
import { SumPipe } from '../../../utils/pipes/sum-pipe';
import { CustomersService } from '../../../services/customers.service';
import { OrderAdvisorComponent } from "../order-advisor/order-advisor.component";

@Component({
  selector: 'app-customer-banks-table',
  standalone: true,
  imports: [RouterModule, NgFor, FilterPipe, NgIf, FaIconComponent, NgClass,
    DecimalPipe, ConfirmationDialogComponent, BankAllocationDialogComponent,
    BabyEditorDialogComponent, SortPipe, BankHistoryDialogComponent, AllocationPickerComponent, 
    SumPipe, OrderAdvisorComponent],
  templateUrl: './customer-banks-table.component.html',
  styleUrl: './customer-banks-table.component.scss'
})
export class CustomerBanksTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() customer: Customer = {
    id: 0, name: '', business_name: '', email: '', phone: '',  tax_id: '', 
    created_at: new Date(), updated_at: new Date(),  created_by: 0, updated_by: 0, 
    banks: [], banks_baby_allocations: [], babies: []
  };    
  @Input() bank: Customer_Bank = {
    raw_material_name: '',
    id: 0,
    customer_id: 0,
    raw_material_id: 0,
    quantity: 0,
    remaining_quantity: 0,
    raw_material_quantity_units: '',
    transaction_history: []
  };
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Customer_Baby[] = [];

  //Saving the original data in order to be able to reset changes
  unchanged_bank: Customer_Bank = {
    raw_material_name: '', raw_material_quantity_units: '', id: 0,
    customer_id: 0, raw_material_id: 0, quantity: 0, remaining_quantity: 0, transaction_history: []
  };
  unchanged_banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  unchanged_babies: Customer_Baby[] = [];

  @Input() wing_id: number = 0;
  @Input() raw_material_quantity_units: string = "";
  @Input() collapsed_babies_lists: boolean = true;
  @Input() selectable_allocatoin: boolean = false; 
  @Output() bank_changed = new EventEmitter<void>();
  @Output() allocation_selected = new EventEmitter<Customer_Bank_Baby_Allocation>();
  @Output() afterViewInit = new EventEmitter<void>();
  @Input() show_hat_advisor: boolean = true;
  @Input() advisor_show_options_button: boolean = true;
  @ViewChild('delete_allocation_dialog') delete_allocation_dialog!: ConfirmationDialogComponent;
  @ViewChild('not_enough_material') not_enough_material!: ConfirmationDialogComponent;
  @ViewChild('save_before_select') save_before_select!: ConfirmationDialogComponent;
  @ViewChild('allocation_dialog') allocation_dialog!: BankAllocationDialogComponent;
  @ViewChild('babies_picker') babies_picker!: BabyEditorDialogComponent;
  @ViewChild('history_dialog') history_dialog! : BankHistoryDialogComponent;
  @ViewChild('allocation_picker') allocation_picker! : AllocationPickerComponent;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faPencil: IconDefinition = faPencil;
  faTrashCan: IconDefinition = faTrashCan;
  faChartPie: IconDefinition = faChartPie;
  faCodeMerge: IconDefinition = faCodeMerge;
  faCheck: IconDefinition = faCheck;
  faSave: IconDefinition = faSave;
  newAllcoationCounter: number = -1;
  pendingAllocationIdAction: number = -999;
  pendingBabyAppendAllocation: number = -999;
  pendingBabyAppendBaby: number = -999;
  pendingMergedSourceAllocationID: number = -999;
  newAllocationIdCounter = -1;
  unsaved_changes: boolean = false;

  constructor(
      private customerService: CustomersService, private wingsService: WingsService) {
  }
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    /*
    this.hatsService.getHat(1).subscribe(hat => {
      this.hat = hat;
      this.wingsService.getWing(1).subscribe(wing => {
        this.wing = wing;
        if(this.hat) {
          

          let n = this.hatsCalculatorService.AlonsHatCalculator(
            this.hat,
            this.wing,
            [this.bank],
            this.banks_baby_allocations,
            this.babies
          );
          //filter: 'customer_banks_babies_id' : bank_allocation.id
          console.log(n + " hats calculated");
          
        }
      });
    });
    //this.hatsCalculatorService.calculateMaxHatsWithFlexibility()
    */
  }

  undo_changes(){
    //Saving the original data in order to be able to reset changes
    this.bank = (JSON.parse(JSON.stringify(this.unchanged_bank)));
    this.banks_baby_allocations = (JSON.parse(JSON.stringify(this.unchanged_banks_baby_allocations)));
    this.babies = (JSON.parse(JSON.stringify(this.unchanged_babies)));
    this.bank = (JSON.parse(JSON.stringify(this.unchanged_bank)));
    this.unsaved_changes = false;
  }
 
  ngAfterViewInit(): void {
    //Saving the original data in order to be able to reset changes
    this.unchanged_bank = (JSON.parse(JSON.stringify(this.bank)));
    this.unchanged_banks_baby_allocations = (JSON.parse(JSON.stringify(this.banks_baby_allocations)));
    this.unchanged_babies = (JSON.parse(JSON.stringify(this.babies)));
    this.unchanged_bank = (JSON.parse(JSON.stringify(this.bank)));

    this.delete_allocation_dialog.confirm.subscribe((response:any) => {
      if(this.pendingAllocationIdAction != -999) {
        this.delete_allocation_confirmed(this.pendingAllocationIdAction);
        this.pendingAllocationIdAction = -999;
      }
    });
    this.babies_picker.dialogWrapper.modalTitle = "Modify babies in allocation";
    this.babies_picker.dialogWrapper.btnSaveText = "Save";
    this.babies_picker.dialogWrapper.confirm.subscribe((baby: Baby) => { this.babies_dialog_closed(baby); });

    this.allocation_dialog.dialogWrapper.modalTitle = "Manage allocation";
    this.allocation_dialog.dialogWrapper.confirm.subscribe(() => { this.allocation_dialog_closed(this.allocation_dialog.CurrentQuantity); });

    this.allocation_picker.dialogWrapper.confirm.subscribe((target_allocation_id: number) => {
      let babies_to_delete: number[] = [];
      this.babies.filter(b => b.customer_banks_babies_id == this.pendingMergedSourceAllocationID).forEach(soure_baby => {
        // find a baby with the destination allocation id
        // if not exists, just change the current baby allocation id
        // else, append the current quantity to the other baby. add the baby id to the deleted ones
        let destination_baby_with_same_length = this.babies.find(
          target_baby => 
            target_baby.customer_banks_babies_id == target_allocation_id && 
            target_baby.length == soure_baby.length);
        if(destination_baby_with_same_length) {
          destination_baby_with_same_length.quantity += soure_baby.quantity;
          babies_to_delete.push(soure_baby.id);
        }
        else {
          soure_baby.customer_banks_babies_id = target_allocation_id;
        }
      });
      while(babies_to_delete.length > 0){
        let id_to_remove = babies_to_delete.pop();
        let index_of_baby_to_delete = this.babies.findIndex(b => b.id == id_to_remove);
        console.log("poppin " + index_of_baby_to_delete);
        if(index_of_baby_to_delete >= 0){
          this.babies.splice(index_of_baby_to_delete, 1);
        }
      }
      this.pendingMergedSourceAllocationID = -999;
    });
    this.allocation_picker.dialogWrapper.cancel.subscribe(() => { this.pendingMergedSourceAllocationID = -999; });

    this.save_before_select.confirm.subscribe(() => { 
      this.customerService.saveCustomer(this.customer).subscribe(
        {
          next:(data) => { 
            let alloc = this.banks_baby_allocations.find(alloc => alloc.id == this.pendingAllocationIdAction);
            this.pendingAllocationIdAction = -999;
            this.unsaved_changes = false;
            if(alloc){
              this.select_allocation_confirmed(alloc);
            }
          },
          error:(error) => { this.pendingAllocationIdAction = -999; }
        });
    });
    this.afterViewInit.emit();
  }

  delete_allocation(allocationId:number){
    let babiesCount = this.babies.filter(b => b.customer_banks_babies_id == allocationId).length;
    if(babiesCount == 0){
      this.delete_allocation_confirmed(allocationId);
    }
    else {
      this.pendingAllocationIdAction = allocationId;
      this.delete_allocation_dialog.open();
    }
  }

  delete_allocation_confirmed(allocationId:number){
    let deleted = false;
    //delete all babies for this allocation
    let baby_index = 999;
    while (baby_index >= 0){
      baby_index = this.babies.findIndex(b => b.customer_banks_babies_id == allocationId);
      if(baby_index >= 0){
        this.babies.splice(baby_index, 1);
        deleted = true;
      }
    }
    //transaction history: add a "deleted" record, if the allocation is not new (id >= 0)
    //and remove all other history transactions pending (for add/change)
    if(!this.bank.transaction_history) {
      //console.log("!!! RESETTING !!!");
      this.bank.transaction_history = [];
    }

    //Remove its records of other pending transaction actions (added changed allocation)
    let allocation_transaction_index = 0;
    do {
      allocation_transaction_index = this.bank.transaction_history.findIndex(a => a.customer_banks_babies_id == allocationId);
      if(allocation_transaction_index >= 0) {
        this.bank.transaction_history.splice(allocation_transaction_index, 1);
        //console.log("removing transaction record");
      }
      deleted = true;  
    } while (allocation_transaction_index >= 0);

    let allocation_index = this.banks_baby_allocations.findIndex(a => a.id == allocationId);
    if(allocation_index >= 0){
      //if the allocation id is already persisted (id >= 0), push the notification it's deleted
      if(allocationId >= 0) {
        this.bank.transaction_history.push({
          id: 0,
          date: new Date(),
          added_by: 1,
          transaction_quantity: this.banks_baby_allocations[allocation_index].quantity,
          transaction_type: TransactionType.customer_bank_allocation_deleted,
          raw_material_id: this.bank.raw_material_id,
          customer_id: this.bank.customer_id,
          customer_bank_id: this.bank.id,
          customer_banks_babies_id:  this.banks_baby_allocations[allocation_index].id,
          cur_raw_material_quantity: 0,
          cur_customer_bank_quantity: (this.bank.remaining_quantity + this.banks_baby_allocations[allocation_index].quantity),
          cur_banks_babies_allocation_quantity: 0
        });
      }
      this.banks_baby_allocations.splice(allocation_index, 1);
      deleted = true;
    }

    console.dir(this.bank.transaction_history);
    if(deleted) {
      this.bank_changed.emit();
      this.unsaved_changes = true;
    }
  }

  /*
  bank 
    quantity
    remaining
  allocation
    quantity
  */
  open_allocation_dialog(allocation_id: number) {
    let allocation = this.banks_baby_allocations.find(a => a.id == allocation_id);
    if(allocation) {
      this.allocation_dialog.CurrentQuantity = allocation.quantity;
      this.allocation_dialog.MaxQuantity = allocation.quantity + this.bank.remaining_quantity;
    }
    else {
      if(this.bank.remaining_quantity <= 0) {
        this.not_enough_material.open();
        return;
      }
      else {
        this.allocation_dialog.CurrentQuantity = 0;
        this.allocation_dialog.MaxQuantity = this.bank.remaining_quantity;
      }
    }
    this.allocation_dialog.dialogWrapper.modalTitle = (allocation_id == -999)? "Create Allocation" : "Manage Allocation";
    this.allocation_dialog.isNew = (allocation_id == -999);
    this.allocation_dialog.QuantityInBank = this.bank.quantity;
    this.allocation_dialog.RemainingInBank = this.bank.remaining_quantity;
    this.allocation_dialog.QuantityUnits = this.bank.raw_material_quantity_units;
    this.pendingAllocationIdAction = allocation_id;
    //bank.remaining_quantity
    this.allocation_dialog.open();
  }

  allocation_dialog_closed(currentQuantity: number) {
    let other_allocations_sum = this.banks_baby_allocations.filter(alloc => alloc.customer_bank_id == this.bank.id && alloc.id != this.pendingAllocationIdAction)
      .reduce((acc, alloc) => acc + alloc.quantity, 0);
    //console.log("other_allocations_sum " + other_allocations_sum);
    //console.log("remaing: (this.bank.quantity: " + this.bank.quantity +" - other_allocations_sum: " + other_allocations_sum + " - currentQuantity: " + currentQuantity + " = " + 
    //  (this.bank.quantity - other_allocations_sum - currentQuantity))
    let allocation = this.banks_baby_allocations.find(a => a.id == this.pendingAllocationIdAction);
    if(!this.bank.transaction_history) {
      //console.log("!!! RESETTING !!!");
      this.bank.transaction_history = [];
    }
    let pushNewTransationRecord = false;
    let transactionrec = this.bank.transaction_history.find(rec => rec.customer_banks_babies_id == this.pendingAllocationIdAction);
    if(!transactionrec) {
      transactionrec = {
        id: 0,
        date: new Date(),
        added_by: 1,
        transaction_quantity: 0,
        transaction_type: TransactionType.customer_bank_allocate_to_Work,
        raw_material_id: this.bank.raw_material_id,
        customer_id: this.bank.customer_id,
        customer_bank_id: this.bank.id,
        customer_banks_babies_id: 0,
        cur_raw_material_quantity: -1,
        cur_customer_bank_quantity: currentQuantity,
        cur_banks_babies_allocation_quantity: 0
      };
      pushNewTransationRecord = true;
    }
    else {
      console.log("transaction found, to fix");
    }
    if(allocation){
      //let directionFactor = (transactionrec.customer_banks_babies_id  allocation.id);
      //console.log("allocation found, to fix");
      transactionrec.transaction_quantity = (allocation.id < 0) ? allocation.quantity : (currentQuantity - allocation.quantity);
      transactionrec.customer_banks_babies_id = allocation.id;
      allocation.quantity = currentQuantity;
    }
    else {
      this.banks_baby_allocations.push({
        id: this.newAllocationIdCounter,
        customer_bank_id: this.bank.id,
        quantity: currentQuantity,
        remaining_quantity: 0
      });
      transactionrec.transaction_quantity = currentQuantity;
      transactionrec.customer_banks_babies_id = this.newAllocationIdCounter;
      this.newAllocationIdCounter--;
    }
    transactionrec.cur_customer_bank_quantity = (this.bank.quantity - other_allocations_sum - currentQuantity);
    if(pushNewTransationRecord) {
      this.bank.transaction_history.push(transactionrec);
    }
    console.dir(this.bank.transaction_history);
    this.pendingAllocationIdAction = -999;
    this.bank_changed.emit();
    this.unsaved_changes = true;
  }

  delete_baby(baby_id: number) {
    let babyIndex = this.babies.findIndex(b => b.id == baby_id);
    if(babyIndex >= 0)
    {
      this.babies.splice(babyIndex, 1);
    }
    this.bank_changed.emit();
    this.unsaved_changes = true;
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
      quantity_in_pending_orders: 0,
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
    this.unsaved_changes = true;
  }

  openHistoryDialog(){
    this.history_dialog.raw_material_name = this.bank.raw_material_name;
    this.history_dialog.raw_material_id = this.bank.raw_material_id;
    this.history_dialog.open(this.bank.id);
  }

  openAllocationMergeDialog(sourceAllocationId: number){
    this.pendingMergedSourceAllocationID = sourceAllocationId;
    this.allocation_picker.dialogWrapper.modalTitle = "<span class='icon-merge'></span> Merge Allocation";
    this.allocation_picker.dialogWrapper.btnSaveClass = "d-none";
    this.allocation_picker.banks_baby_allocations = this.banks_baby_allocations.filter(a => a.id != sourceAllocationId);
    this.allocation_picker.open(sourceAllocationId);
  }

  select_allocation(allocation: Customer_Bank_Baby_Allocation){
    console.dir(this.bank);
    if(this.unsaved_changes){
      this.pendingAllocationIdAction = allocation.id;
      this.save_before_select.open();
    }
    else {
      this.select_allocation_confirmed(allocation);
    };
  }
  select_allocation_confirmed(allocation: Customer_Bank_Baby_Allocation){
    this.allocation_selected.emit(allocation);
  }

  /*
  getdata() {
    this.wingsService.getAllNonCustomerWingsAndBabies().subscribe({
      next: (data: WingCalculationItem[]) => {
        alert(data);
      }
    });
  }*/
}
