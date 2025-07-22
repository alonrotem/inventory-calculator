import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, viewChild, ViewChild, ViewChildren } from '@angular/core';
import { Baby, Customer, Allocation_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, HistoryReportRecord, TransactionRecord, TransactionType, Wing, ShortWingsInfo, Bank_Allocation_Type } from '../../../../types';
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
import { WingsService } from '../../../services/wings.service';
import { AllocationPickerComponent } from '../allocation-picker/allocation-picker.component';
import { SumPipe } from '../../../utils/pipes/sum-pipe';
import { CustomersService } from '../../../services/customers.service';
import { OrderAdvisorComponent } from "../order-advisor/order-advisor.component";
import { aggregated_babies } from '../../../services/hats-calculator.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { MiscUtils } from '../../../utils/misc-utils';

@Component({
  selector: 'app-customer-banks-table',
  standalone: true,
  imports: [RouterModule, NgFor, FilterPipe, NgIf, FaIconComponent, NgClass,
    DecimalPipe, ConfirmationDialogComponent, BankAllocationDialogComponent,
    BabyEditorDialogComponent, SortPipe, BankHistoryDialogComponent, AllocationPickerComponent,
    SumPipe, OrderAdvisorComponent, FormsModule],
  templateUrl: './customer-banks-table.component.html',
  styleUrl: './customer-banks-table.component.scss'
})
export class CustomerBanksTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() customer: Customer = {
    id: 0, name: '', business_name: '', email: '', phone: '', tax_id: '',
    created_at: new Date(), updated_at: new Date(), created_by: 0, updated_by: 0,
    banks: [], banks_baby_allocations: [], babies: [],
    customer_code: '', order_seq_number: 0
  };    
  @Input() bank: Customer_Bank = {
    raw_material_name: '',
    id: 0,
    pre_save_id: 0,
    customer_id: 0,
    raw_material_id: 0,
    quantity: 0,
    remaining_quantity: 0,
    raw_material_quantity_units: '',
    transaction_history: [],
    raw_material_color: '',
    allow_shortening_babies_in_pairs: false
  };
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Allocation_Baby[] = [];
  tails_allocation_in_this_bank: Customer_Bank_Baby_Allocation | undefined = undefined;
  @Input() banks_baby_allocation_type_filter: Bank_Allocation_Type | null = null;
  Bank_Allocation_Type = Bank_Allocation_Type; //for the template

  //Saving the original data in order to be able to reset changes
  unchanged_bank: Customer_Bank = {
    raw_material_name: '', raw_material_quantity_units: '', id: 0, pre_save_id: 0,
    customer_id: 0, raw_material_id: 0, quantity: 0, remaining_quantity: 0, transaction_history: [],
    raw_material_color: '',
    allow_shortening_babies_in_pairs: false
  };
  unchanged_banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  unchanged_babies: Allocation_Baby[] = [];

  @Input() wing_id: number = 0;
  @Input() raw_material_quantity_units: string = "";
  @Input() collapsed_babies_lists: boolean = true;
  @Input() selectable_allocatoin: boolean = false; 
  @Output() bank_changed = new EventEmitter<void>();
  @Output() allocation_selected = new EventEmitter<Customer_Bank_Baby_Allocation>();
  @Output() babies_picker_open = new EventEmitter<void>();
  @Output() babies_picker_closed = new EventEmitter<void>();
  @Output() afterViewInit = new EventEmitter<void>();
  @Output() babies_updated = new EventEmitter<any>();
  @Output() customer_updated = new EventEmitter<Customer>();
  @Input() show_hat_advisor: boolean = true;
  @Input() advisor_show_options_button: boolean = true;
  @ViewChild('delete_allocation_dialog') delete_allocation_dialog!: ConfirmationDialogComponent;
  @ViewChild('not_enough_material') not_enough_material!: ConfirmationDialogComponent;
  @ViewChild('save_before_select') save_before_select!: ConfirmationDialogComponent;
  @ViewChild('allocation_dialog') allocation_dialog!: BankAllocationDialogComponent;
  @ViewChild('babies_picker') babies_picker!: BabyEditorDialogComponent;
  @ViewChild('history_dialog') history_dialog! : BankHistoryDialogComponent;
  @ViewChild('allocation_picker') allocation_picker! : AllocationPickerComponent;
  @ViewChildren('order_advisor') order_advisors!: QueryList<OrderAdvisorComponent>;
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
      private customerService: CustomersService, private wingsService: WingsService, private toastService: ToastService) {
  }
  ngOnInit(): void {
    if(this.banks_baby_allocation_type_filter == Bank_Allocation_Type.babies){}
  }

  ngOnChanges(changes: SimpleChanges): void {
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

    //does this bank have an allocation for tails?
    //if so, pass it to the order calculator (in the querystring), when opened
    this.tails_allocation_in_this_bank = this.banks_baby_allocations.find(alloc => alloc.allocation_type == Bank_Allocation_Type.tails && alloc.customer_bank_id == this.bank.id);

    this.delete_allocation_dialog.confirm.subscribe((response:any) => {
      if(this.pendingAllocationIdAction != -999) {
        this.delete_allocation_confirmed(this.pendingAllocationIdAction);
        this.pendingAllocationIdAction = -999;
      }
    });
    this.babies_picker.appendBaby.subscribe((baby_info: { length: number; quantity: number }) => { this.append_baby(baby_info) });
    this.babies_picker.dialogWrapper.close.subscribe(() => { this.babies_picker_closed.emit(); });
    this.babies_picker.dialogWrapper.cancel.subscribe(() => { this.babies_picker_closed.emit(); });

    this.allocation_dialog.dialogWrapper.modalTitle = "Manage allocation";

    //test
    
    this.allocation_dialog.dialogWrapper.confirm.subscribe(() => { 
      const allocationType = this.allocation_dialog.allocation_type;
      //console.log("CLOSED WITH " + this.allocation_dialog.allocation_type); console.dir(x); 
      this.allocation_dialog_closed(this.allocation_dialog.CurrentQuantity, allocationType);
    });

    this.allocation_picker.dialogWrapper.confirm.subscribe((target_allocation_id: number) => {
      let babies_to_delete: number[] = [];
      this.babies.filter(b => b.allocation_id == this.pendingMergedSourceAllocationID).forEach(soure_baby => {
        // find a baby with the destination allocation id
        // if not exists, just change the current baby allocation id
        // else, append the current quantity to the other baby. add the baby id to the deleted ones
        let destination_baby_with_same_length = this.babies.find(
          target_baby => 
            target_baby.allocation_id == target_allocation_id && 
            target_baby.length == soure_baby.length);
        if(destination_baby_with_same_length) {
          destination_baby_with_same_length.quantity += soure_baby.quantity;
          babies_to_delete.push(soure_baby.id);
        }
        else {
          soure_baby.allocation_id = target_allocation_id;
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
            console.log("SAVED CUSTOMER !!"); console.dir(data["customer"]);
            //let alloc = this.banks_baby_allocations.find(alloc => alloc.id == this.pendingAllocationIdAction);
            //let pre_selected_allocation_id = 
            this.customer = { ...data["customer"] };
            this.banks_baby_allocations = [...data["customer"]["banks_baby_allocations"]];
            this.babies = [... data["customer"]["babies"]];
            this.unsaved_changes = false;
            this.customer_updated.emit(this.customer);
            let alloc = this.banks_baby_allocations.find(saved_alloc => saved_alloc.pre_save_id == this.pendingAllocationIdAction);

            this.pendingAllocationIdAction = -999;
            if(alloc){
              this.select_allocation_confirmed(alloc);
            }
            this.toastService.showSuccess("Allocation saved successfully");
            this.allocation_picker.dialogWrapper.onCancel();
          },
          error:(error) => { 
            this.pendingAllocationIdAction = -999; 
            this.toastService.showError("Failed to save allocation");
            console.dir(error);
          }
        });
    });
    /*
    this.order_advisors.forEach(advisor => {
      advisor.triggerSaveChanges.subscribe(() => {
        console.log(this.customer);
      });
    });
    */
    
    this.afterViewInit.emit();
  }

  save_customer(){
      this.customerService.saveCustomer(this.customer).subscribe(
        {
          next:(data) => { 
            console.log("SAVED!!!"); console.dir(data["customer"]);
            this.customer = { ...data["customer"] };
            this.banks_baby_allocations = [...data["customer"]["banks_baby_allocations"]];
            this.babies = [... data["customer"]["babies"]];
            this.unsaved_changes = false;
            this.toastService.showSuccess("Saved successfully");
            this.customer_updated.emit(this.customer);
          },
          error:(error) => { this.toastService.showError("Error saving pending changes"); }
        });        

  }

  delete_allocation(allocationId:number){
    let babiesCount = this.babies.filter(b => b.allocation_id == allocationId).length;
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
      baby_index = this.babies.findIndex(b => b.allocation_id == allocationId);
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
      allocation_transaction_index = this.bank.transaction_history.findIndex(a => a.allocation_id == allocationId);
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
          allocation_id:  this.banks_baby_allocations[allocation_index].id,
          cur_raw_material_quantity: 0,
          cur_customer_bank_quantity: (this.bank.remaining_quantity + this.banks_baby_allocations[allocation_index].quantity),
          cur_banks_babies_allocation_quantity: 0
        });
      }
      //deleting
      this.banks_baby_allocations.splice(allocation_index, 1);
      if(this.tails_allocation_in_this_bank && allocationId == this.tails_allocation_in_this_bank.id){
        this.tails_allocation_in_this_bank = this.banks_baby_allocations.find(alloc => alloc.allocation_type == Bank_Allocation_Type.tails  && alloc.customer_bank_id == this.bank.id);
      }
      deleted = true;
    }

    //console.dir(this.bank.transaction_history);
    if(deleted) {
      this.bank_changed.emit();
      this.recalculateBank();
      this.unsaved_changes = true;
    }
  }

recalculateBank(){
  this.bank.remaining_quantity = this.bank.quantity;
  let allocated = this.customer.banks_baby_allocations.filter(alloc => alloc.customer_bank_id == this.bank.id).reduce((acc, cur) => acc + cur.quantity, 0);
  this.bank.remaining_quantity -= allocated;
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
    if(this.banks_baby_allocation_type_filter){
      this.allocation_dialog.allocation_type = this.banks_baby_allocation_type_filter; //Object.keys(Bank_Allocation_Type)[Object.values(Bank_Allocation_Type).indexOf(this.banks_baby_allocation_type_filter)]

      //a.allocation_type==Object.keys(Bank_Allocation_Type)[Object.values(Bank_Allocation_Type).indexOf(Bank_Allocation_Type.tails)]
      this.allocation_dialog.LockAllocationType = true;
    }
    //bank.remaining_quantity
    this.allocation_dialog.open();
  }

  allocation_dialog_closed(currentQuantity: number, allocationType: Bank_Allocation_Type) {
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
    let transactionrec = this.bank.transaction_history.find(rec => rec.allocation_id == this.pendingAllocationIdAction);
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
        allocation_id: 0,
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

      //let directionFactor = (transactionrec.allocation_id  allocation.id);
      //console.log("allocation found, to fix");
      transactionrec.transaction_quantity = (allocation.id < 0) ? allocation.quantity : (currentQuantity - allocation.quantity);
      transactionrec.allocation_id = allocation.id;
      allocation.quantity = currentQuantity;
      allocation.allocation_type =  allocationType;
      allocation.allocation_type = allocationType;
    }
    else {
      this.banks_baby_allocations.push({
        id: this.newAllocationIdCounter,
        pre_save_id: 0,
        customer_bank_id: this.bank.id,
        quantity: currentQuantity,
        remaining_quantity: 0,
        allocation_type: allocationType,
        tails_quantity: 0,
        tails_in_orders: 0
      });
      transactionrec.transaction_quantity = currentQuantity;
      transactionrec.allocation_id = this.newAllocationIdCounter;
      this.newAllocationIdCounter--;
    }
    transactionrec.cur_customer_bank_quantity = (this.bank.quantity - other_allocations_sum - currentQuantity);
    if(pushNewTransationRecord) {
      this.bank.transaction_history.push(transactionrec);
    }
    //console.dir(this.bank.transaction_history);
    this.pendingAllocationIdAction = -999;
    this.bank_changed.emit();
    this.recalculateBank();
    this.unsaved_changes = true;
  }

  delete_baby(baby_id: number) {
    let babyIndex = this.babies.findIndex(b => b.id == baby_id);
    if(babyIndex >= 0)
    {
      let allocation_id = this.babies[babyIndex].allocation_id;
      this.babies.splice(babyIndex, 1);
      this.update_advisor_babies(allocation_id);
    }
    this.bank_changed.emit();
    this.recalculateBank();
    this.unsaved_changes = true;
  }

  expand_allocation_table(bank_allocation_id: number){
    let button = document.getElementById("allocation_collapse_Button" + bank_allocation_id);
    let table = document.getElementById("allocation_table" + bank_allocation_id);
    if(button && table){
      button.classList.remove("collapsed");
      button.setAttribute("aria-expanded", "true");
      table.classList.add("show");
    }
  }

  tails_quantity_changed(bank_allocation_id: number){
    this.unsaved_changes = true;
  }

  open_babies_dialog(bank_allocation_id: number, baby_length: number) {
    this.expand_allocation_table(bank_allocation_id);

    this.pendingBabyAppendAllocation = bank_allocation_id;
    const curr_baby = this.babies.find(b => 
      b.allocation_id == bank_allocation_id && b.length == baby_length
    );
    let babiesToEdit: { length: number; quantity: number }[] = [];
    this.babies_picker.dialogWrapper.btnSaveClass = "d-none";
      this.babies_picker.dialogWrapper.btnCancelText = "(Esc to close)";
    //if(baby_length > 0) {
      babiesToEdit = this.babies
        .filter(b => b.allocation_id == bank_allocation_id)
        .map(b => ({ length: b.length, quantity: b.quantity }));
      this.babies_picker.babyEditMode = true;
      this.babies_picker.dialogWrapper.modalTitle = "Edit babies";
    //}
    //else {
    //  this.babies_picker.babyEditMode = false;
    //this.babies_picker.dialogWrapper.modalTitle = "Add / Top-up babies";
    //}
    this.babies_picker.babies_to_edit = babiesToEdit;
    this.babies_picker.highlighted_baby_length = baby_length;
    this.babies_picker.highlighted_baby_quantity = (curr_baby)? curr_baby.quantity : 0;

    this.babies_picker.dialogWrapper.open();
    this.babies_picker_open.emit();
  }

  append_baby(baby_info: { length: number; quantity: number }){
    console.log("append_baby:"); console.dir(baby_info);
    let baby_to_modify = this.babies.find(b => b.allocation_id == this.pendingBabyAppendAllocation && b.length == baby_info.length);

    //edit mode:
    // find the baby
    // if found -> 
    //  if quantity is 0, and in_orders is 0 -> splice out
    //  if quantity is > 0 -> update the quanitty
    // if not found && quantity > 0->
    //    append new with quantity    
    if(this.babies_picker.babyEditMode){
      if(baby_to_modify){
        if(baby_info.quantity <= 0 && baby_to_modify.quantity_in_pending_orders <= 0) {
          let baby_index = this.babies.findIndex(b => b.allocation_id == this.pendingBabyAppendAllocation && b.length == baby_info.length);
          if(baby_index >= 0){
            this.babies.splice(baby_index, 1);
          }
        }
        else {
          baby_to_modify.quantity = baby_info.quantity;
        }
      }
      else {
        this.babies.push({
          id: 0,
          allocation_id: this.pendingBabyAppendAllocation,
          length: baby_info.length,
          quantity: baby_info.quantity,
          quantity_in_pending_orders: 0
        });
      }
    }

    //append mode
    else {
      //add mode
      // find the baby
      // if found -> 
      //  top up quantity
      // if not found
      //  append new with quantity
      if(baby_to_modify){
        baby_to_modify.quantity += baby_info.quantity;
      }
      else {
        this.babies.push({
          id: 0,
          allocation_id: this.pendingBabyAppendAllocation,
          length: baby_info.length,
          quantity: baby_info.quantity,
          quantity_in_pending_orders: 0
        });
      }      
    }
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

  update_advisor_babies(allocation_id:number){
    let origin_advisor = this.order_advisors.find((advisor: OrderAdvisorComponent) => {
      return advisor.wall_allocation?.id == allocation_id;
    });
    if(origin_advisor) {
      console.log("updating the advisor");
      console.dir(this.babies);
      origin_advisor.updateBabies(this.babies, this.babies);
    }
  }

  assistant_auto_add_babies(aggregatedBabies: any){
    console.dir(aggregatedBabies);
    let changes_made = false;
    (aggregatedBabies.hat as aggregated_babies[]).forEach(baby_to_append => {
      if(baby_to_append.remaining > 0){  
        let wall_baby_with_same_length = this.babies.find(
          baby_in_customer_bank => 
            baby_in_customer_bank.length == baby_to_append.length && baby_in_customer_bank.allocation_id == aggregatedBabies.hat_alloc_id
        );
        if(wall_baby_with_same_length){
          wall_baby_with_same_length.quantity += baby_to_append.remaining;
          this.babies = this.babies.map(baby => baby.id == wall_baby_with_same_length.id? { ...baby, ...wall_baby_with_same_length}: baby)
        }
        else {
          this.babies = [...this.babies, {
            id: 0,
            allocation_id: aggregatedBabies.hat_alloc_id,
            length: baby_to_append.length,
            quantity: baby_to_append.remaining,
            quantity_in_pending_orders: 0
          }];
        }
        this.customer = {...this.customer, babies: [...this.babies]};
        changes_made = true;
      }
    });

   if(changes_made) {
      this.update_advisor_babies(aggregatedBabies.hat_alloc_id);
      this.bank_changed.emit();
      this.recalculateBank();
      this.babies_updated.emit(this.babies);
      this.unsaved_changes = true;  
    }
  }
}
