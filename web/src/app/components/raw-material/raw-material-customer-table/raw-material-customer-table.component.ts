import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoneyCheckDollar, faPencil, faTrashAlt, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { RawMaterialCustomerBank } from '../../../../types';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { RouterModule } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { RawMaterialCustomerDialogComponent } from "../raw-material-customer-dialog/raw-material-customer-dialog.component";

@Component({
  selector: 'app-raw-material-customer-table',
  standalone: true,
  imports: [FaIconComponent, DateStrPipe, RouterModule, NgIf, NgFor, ConfirmationDialogComponent, ModalDialogComponent, RawMaterialCustomerDialogComponent, DecimalPipe],
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
  @ViewChild("bank_editor") bank_editor!: ModalDialogComponent;
  @Input() banks: RawMaterialCustomerBank[] = [];

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
    });
    this.delete_confirmation.cancel.subscribe(() => {
      this.pending_delete_index = -1;
    });
    this.bank_editor.confirm.subscribe((b: RawMaterialCustomerBank)=>{ this.closedCustomerEditor(b); });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.recalculateSums();
  }

  recalculateSums(){
    this.banks_summary_string = "";
    var sumUnits = this.banks.reduce((acc, cur) => acc + cur.units, 0);
    var sumWeight = this.banks.reduce((acc, cur) => acc + cur.weight, 0);
    if(sumUnits > 0) {
      this.banks_summary_string = sumUnits + " units";
    }
    if(sumWeight>0) {
      this.banks_summary_string += ((sumUnits > 0)? ", ": "") + sumWeight.toFixed(1) + " kg";
    }
    this.banks_summary_string = (this.banks_summary_string=="")? "": (" (" + this.banks_summary_string + ")");
  }

  openCustomerEditor(bank: RawMaterialCustomerBank | null){
    if(bank) {
      this.bank_editor.modalTitle = "Edit customer bank";
      this.bank_editor.dialog_content_component.editedObject = bank;
    }
    else {
      this.bank_editor.modalTitle = "Create customer bank";
      this.bank_editor.dialog_content_component.editedObject = {
        id: 0,
        name: '',
        business_name: '',
        raw_material_id: 0,
        customer_id: 0,
        weight: 0,
        units: 0
      };
    }
    this.bank_editor.open();
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
      bankWithSameCustomerName.weight = bank.weight;
      bankWithSameCustomerName.units = bank.units;
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
  }
}
