import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoneyCheckDollar, faPencil, faTrashAlt, faTrashCan, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { RawMaterial, RawMaterialCustomerBank } from '../../../../types';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { RouterModule } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { RawMaterialCustomerDialogComponent } from "../raw-material-customer-dialog/raw-material-customer-dialog.component";
import { RawMaterialQuantityDialogComponent } from '../raw-material-quantity-dialog/raw-material-quantity-dialog.component';

@Component({
  selector: 'app-raw-material-customer-table',
  standalone: true,
  imports: [
    FaIconComponent, RouterModule, NgFor, NgIf,
    ConfirmationDialogComponent, 
    RawMaterialCustomerDialogComponent, RawMaterialQuantityDialogComponent, DecimalPipe ],
  templateUrl: './raw-material-customer-table.component.html',
  styleUrl: './raw-material-customer-table.component.scss'
})
export class RawMaterialCustomerTableComponent implements AfterViewInit, OnChanges {

  faMoneyCheckDollar: IconDefinition = faMoneyCheckDollar;
  faTrashAlt: IconDefinition = faTrashAlt;
  faTrashCan: IconDefinition = faTrashCan;
  faPencil: IconDefinition = faPencil;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild("bank_editor") bank_editor!: RawMaterialCustomerDialogComponent;
  @ViewChild("top_up_dialog") top_up_dialog! :RawMaterialQuantityDialogComponent;
  @ViewChild("not_enough_material") not_enough_material! :RawMaterialQuantityDialogComponent;

  @Input() banks: RawMaterialCustomerBank[] = [];
  @Input() parent_raw_material: RawMaterial | null = null;
  @Output() banksChanged: EventEmitter<void> = new EventEmitter();
  @Output() unsaved_changes: boolean = false;

  pending_delete_index:number = -1;
  banks_summary_string = "";
  banks_loaded_quantities: any[] = [];
  topped_up_bank : RawMaterialCustomerBank | null = null;

  deleteBank(index:number, bank: RawMaterialCustomerBank){
    this.delete_confirmation.modalText = `Are you sure you want to delete this bank for customer <strong>${bank.name}</strong>?`;
    this.delete_confirmation.open();
    this.pending_delete_index = index;
  }

  ngAfterViewInit(): void {
    this.delete_confirmation.confirm.subscribe((value: Boolean) => {
      if(this.pending_delete_index >= 0){
        this.banks.splice(this.pending_delete_index, 1);
      }
      this.pending_delete_index = -1;
      this.recalculateSums();
      this.banksChanged.emit();
      this.unsaved_changes = true;
    });

    this.delete_confirmation.cancel.subscribe(() => {
      this.pending_delete_index = -1;
    });

    this.bank_editor.dialogWrapper.confirm.subscribe((b: RawMaterialCustomerBank)=>{ 
      this.closedCustomerEditor(b); 
    });

    this.top_up_dialog.dialogWrapper.confirm.subscribe(() => {
      if(this.topped_up_bank){
        let top_up = this.top_up_dialog.editedObject.top_up_quantity;
        if(top_up > 0) {
          this.topped_up_bank.quantity += top_up;
          this.topped_up_bank.quantity_in_kg += this.top_up_dialog.editedObject.current_quantity_kg;
          this.topped_up_bank.remaining_quantity += top_up;
        }  
      }
      this.topped_up_bank = null;
      this.recalculateSums();
      this.banksChanged.emit();
      this.unsaved_changes = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.recalculateSums();
    this.banksChanged.emit();

    if(this.banks_loaded_quantities.length == 0 && this.banks.length > 0){
      this.banks_loaded_quantities = this.banks.map((b => ({  
        bank_id: b.id, 
        initial_bank_quantity: b.quantity, 
        initial_bank_remaining: b.remaining_quantity,
        bank_in_use: (b.quantity - b.remaining_quantity)
      })));
    }
    else {
      //console.log("initial banks already loaded...");
    }
  }

  recalculateSums(){
    this.banks_summary_string = "";
    let totalQuantity = this.banks.reduce((acc, cur) => acc + cur.quantity, 0);
    let totalQuantity_kg = this.banks.reduce((acc, cur) => acc + cur.quantity_in_kg, 0);
    if(totalQuantity > 0) {
      this.banks_summary_string = totalQuantity.toLocaleString('en-US', { minimumFractionDigits:0, maximumFractionDigits:0 }) + " units" + 
      ((this.parent_raw_material?.quantity_units=="kg")? " (" + totalQuantity_kg.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 }) + " kg)" : "" ) + 
      " of material, used in " + this.banks.length + " customer " + ((this.banks.length == 1)? "bank":"banks");
    }
    else {
      this.banks_summary_string = "No material used by customer banks."
    }
  }

  openCustomerEditor(bank: RawMaterialCustomerBank | null){
    this.bank_editor.rawMaterialQuantityUnits = this.parent_raw_material!.quantity_units;
    this.bank_editor.rawMaterialUnitsPerKg = this.parent_raw_material!.units_per_kg;
    if(bank) {
      this.bank_editor.dialogWrapper.modalTitle = "Edit customer bank";
      this.bank_editor.editMode = true;
      this.bank_editor.editedObject = bank;
    }
    else {
      this.bank_editor.dialogWrapper.modalTitle = "Create customer bank";
      this.bank_editor.editMode = false;
      this.bank_editor.editedObject = {
        id: 0,
        name: '',
        business_name: '',
        raw_material_id: (this.parent_raw_material)? this.parent_raw_material.id : 0,
        customer_id: 0,
        quantity: 0,
        remaining_quantity: 0,
        quantity_units: 'units',
        quantity_in_kg: 0,
        transaction_record: null
      };
    }
    this.bank_editor.currentRawMaterialRemainingQuantity = (this.parent_raw_material?.remaining_quantity)? this.parent_raw_material?.remaining_quantity : 0;
    this.bank_editor.banks = this.banks;
    this.bank_editor.dialogWrapper.open();
  }

  closedCustomerEditor(bank: RawMaterialCustomerBank){
    //console.log("closedCustomerEditor bank -> ");
    //console.dir(bank);
    //1. check if there is a bank with that customer name, no matter the customer id
    let bankWithSameCustomerName = this.banks.find(b => b.name.toUpperCase() == bank.name.toUpperCase());
    let bankInitialData = this.banks_loaded_quantities.find(b => b.bank_id == bank.id);
    let toopped_by = (bankInitialData)? (bank.quantity - bankInitialData.initial_bank_quantity) : 0;

    if(bankWithSameCustomerName) {
      bankWithSameCustomerName.customer_id = (bank.customer_id != 0)? bank.customer_id : bankWithSameCustomerName.customer_id;
      bankWithSameCustomerName.id = (bank.id != 0)? bank.id : bankWithSameCustomerName.id;
      bankWithSameCustomerName.business_name = bank.business_name;
      bankWithSameCustomerName.raw_material_id = bank.raw_material_id;
      bankWithSameCustomerName.remaining_quantity = bank.remaining_quantity;
      bankWithSameCustomerName.quantity = bank.quantity;
      bankWithSameCustomerName.quantity_in_kg = bank.quantity_in_kg;
    }
    else {   
      this.banks.push(bank);
    }

    if(bank.id == 0){
      if(bank.customer_id != 0){
        let bank_with_this_Customer_id = this.banks.find(b => b.customer_id == bank.customer_id);
        if(bank_with_this_Customer_id){
          bank.id = bank_with_this_Customer_id.id;
        }
      }
    }
    this.banks.sort((a, b) => { return (a.name.toUpperCase() < b.name.toUpperCase())?-1:1; });
    this.recalculateSums();
    this.banksChanged.emit();
    this.unsaved_changes = true;
  }

  top_up(bank :RawMaterialCustomerBank) {
    if(this.parent_raw_material && this.parent_raw_material.remaining_quantity > 0){
      this.top_up_dialog.dialogWrapper.modalTitle = "+ Top up customer bank";
      this.top_up_dialog.show_units_to_kg_adjustment = (this.parent_raw_material.quantity_units == "kg");
      this.top_up_dialog.rawMaterialQuantityUnits = this.parent_raw_material.quantity_units;
      this.top_up_dialog.rawMaterialUnitsPerKg = this.parent_raw_material.units_per_kg;
      this.top_up_dialog.editedObject = {
        top_up_quantity: 0,
        current_quantity: bank.quantity,
        current_quantity_kg: bank.quantity_in_kg,
        remaining_quantity: bank.remaining_quantity,
        quantity_units: bank.quantity_units,
        max_topping: this.parent_raw_material!.remaining_quantity
      };
      this.top_up_dialog.rawMaterial_quantity_units = this.parent_raw_material.quantity_units;
      this.topped_up_bank = bank;
      this.top_up_dialog.open();
    }
    else {
      this.not_enough_material.open();
    }
  }
}
