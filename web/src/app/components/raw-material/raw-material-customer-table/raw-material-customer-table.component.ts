import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoneyCheckDollar, faPencil, faTrashAlt, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { RawMaterial, RawMaterialCustomerBank } from '../../../../types';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { RouterModule } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { RawMaterialCustomerDialogComponent } from "../raw-material-customer-dialog/raw-material-customer-dialog.component";
import { RawMaterialQuantityDialogComponent } from '../raw-material-quantity-dialog/raw-material-quantity-dialog.component';

@Component({
  selector: 'app-raw-material-customer-table',
  standalone: true,
  imports: [
    FaIconComponent, DateStrPipe, RouterModule, NgIf, NgFor, 
    ConfirmationDialogComponent, ModalDialogComponent, 
    RawMaterialCustomerDialogComponent, RawMaterialQuantityDialogComponent, DecimalPipe],
  templateUrl: './raw-material-customer-table.component.html',
  styleUrl: './raw-material-customer-table.component.scss'
})
export class RawMaterialCustomerTableComponent implements AfterViewInit, OnChanges {

  faMoneyCheckDollar: IconDefinition = faMoneyCheckDollar;
  faTrashAlt: IconDefinition = faTrashAlt;
  faTrashCan: IconDefinition = faTrashCan;
  faPencil: IconDefinition = faPencil;
  pending_delete_index:number = -1;
  banks_summary_string = "";
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild("bank_editor") bank_editor!: RawMaterialCustomerDialogComponent;
  @ViewChild("top_up_dialog") top_up_dialog! :RawMaterialQuantityDialogComponent;
  @Input() banks: RawMaterialCustomerBank[] = [];
  @Input() parent_raw_material: RawMaterial | null = null;
  @Output() banksChanged: EventEmitter<void> = new EventEmitter();
  banks_loaded_quantities: any[] = [];

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
    });
    this.delete_confirmation.cancel.subscribe(() => {
      this.pending_delete_index = -1;
    });
    this.bank_editor.dialogWrapper.confirm.subscribe((b: RawMaterialCustomerBank)=>{ 
      console.log("confirm caught with " + b);
      this.closedCustomerEditor(b); });
  }
  //check how much the quantity was raised from initial quantity
  //if more than material remaining: error
  //if less than remaining quantity: error

  ngOnChanges(changes: SimpleChanges): void {
    this.recalculateSums();
    this.banksChanged.emit();

    if(this.banks_loaded_quantities.length == 0 && this.banks.length > 0){
      this.banks_loaded_quantities = this.banks.map((b => ({  
        bank_id: b.id, 
        initial_bank_quantity: b.quantity, 
        initial_bank_remaining: b.remaining_quantity  
      })));
      console.log(this.banks_loaded_quantities);
    }
    else {
      console.log("initial banks already loaded...");
    }
  }

  recalculateSums(){
    this.banks_summary_string = "";
    let totalQuantity = this.banks.reduce((acc, cur) => acc + cur.quantity, 0);
    if(totalQuantity > 0) {
      this.banks_summary_string = totalQuantity + " " + this.parent_raw_material?.quantity_units;
    }
    this.banks_summary_string = (this.banks_summary_string=="")? "": (" (" + this.banks_summary_string + ")");
  }

  openCustomerEditor(bank: RawMaterialCustomerBank | null){
    //let bank_dialog = (this.bank_editor.dialog_content_component as RawMaterialCustomerDialogComponent);
    if(bank) {
      this.bank_editor.dialogWrapper.modalTitle = "Edit customer bank";
      this.bank_editor.editedObject = bank;
      let initialBankInfo = this.banks_loaded_quantities.find(b => b.bank_id == bank.id);
      if(initialBankInfo){
        this.bank_editor.initialBankQuantity = initialBankInfo.initial_bank_quantity;
        this.bank_editor.initialBankRemainingQuantity = initialBankInfo.initial_bank_remaining;
      }
    }
    else {
      this.bank_editor.dialogWrapper.modalTitle = "Create customer bank";
      this.bank_editor.editedObject = {
        id: 0,
        name: '',
        business_name: '',
        raw_material_id: (this.parent_raw_material)? this.parent_raw_material.id : 0,
        customer_id: 0,
        quantity: 0,
        remaining_quantity: 0,
        quantity_units: (this.parent_raw_material)? this.parent_raw_material.quantity_units : '',
        transaction_record: null
      };
      this.bank_editor.initialBankQuantity = -1;
      this.bank_editor.initialBankRemainingQuantity = -1;
    }
    this.bank_editor.remainingMaterialQuantity = (this.parent_raw_material?.remaining_quantity)? this.parent_raw_material?.remaining_quantity : -1;
    this.bank_editor.dialogWrapper.open();
  }

  closedCustomerEditor(bank: RawMaterialCustomerBank){
    //1. check if there is a bank with that customer name, no matter the customer id
    let bankWithSameCustomerName = this.banks.find(b => b.name.toUpperCase() == bank.name.toUpperCase());
    if(bankWithSameCustomerName) {
      // copy properties of the updated bank to the existing bank
      bankWithSameCustomerName.customer_id = (bank.customer_id != 0)? bank.customer_id : bankWithSameCustomerName.customer_id;
      bankWithSameCustomerName.id = (bank.id != 0)? bank.id : bankWithSameCustomerName.id;
      bankWithSameCustomerName.business_name = bank.business_name;
      bankWithSameCustomerName.raw_material_id = bank.raw_material_id;
      bankWithSameCustomerName.remaining_quantity = (bank.id == 0)? bankWithSameCustomerName.quantity : -1;
      //bankWithSameCustomerName.weight = bank.weight;
      //bankWithSameCustomerName.units = bank.units;
    }
    else {
      bank.remaining_quantity = bank.quantity;
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
  }

  top_up() {
    this.top_up_dialog.open();
  }
}
