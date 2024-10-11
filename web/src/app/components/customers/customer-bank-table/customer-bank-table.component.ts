import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Customer_Bank, Customer_Baby, Baby } from '../../../../types';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { FirstPipe } from '../../../utils/pipes/first-pipe';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoneyCheckDollar, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { BabyEditorDialogComponent } from '../../babies/baby-editor-dialog/baby-editor-dialog.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

enum DialogMode {
  Add,
  Edit
  
};

@Component({
  selector: 'app-customer-bank-table',
  standalone: true,
  imports: [ NgFor, NgIf, FilterPipe, FirstPipe, DecimalPipe, DateStrPipe, FaIconComponent, RouterModule, ModalDialogComponent, BabyEditorDialogComponent, ConfirmationDialogComponent ],
  templateUrl: './customer-bank-table.component.html',
  styleUrl: './customer-bank-table.component.scss'
})
export class CustomerBankTableComponent implements AfterViewInit, OnChanges {


  @Input() banks: Customer_Bank[] = [];   //all the banks
  @Input() babies: Customer_Baby[] = [];  //all the babies
  @Input() bank_id: number = -1;          //filtering one bank id for this table
  faTrashCan:IconDefinition = faTrashCan;
  faMoneyCheckDollar:IconDefinition = faMoneyCheckDollar;
  bank_info: string = "";
  @ViewChild("baby_editor") babyEditorDialog!: ModalDialogComponent;
  dialogMode: DialogMode = DialogMode.Add;

  bank: Customer_Bank = {
    bank_id: 0,
    customer_id: 0,
    raw_material_id: 0,
    weight: 0,
    units: 0,
    raw_material_name: '',
    customer_name: ''
  };
  
  constructor() {    
  }

  reload_bank_details() {
    let bank_with_given_id = this.banks.find(b => b.bank_id == this.bank_id);
    if(bank_with_given_id){
      this.bank = bank_with_given_id;
    }

    this.bank_info = "";
    if(this.bank.units > 0) {
      this.bank_info = this.bank.units + " units";
    }
    if(this.bank.weight > 0) {
      this.bank_info += ((this.bank.units > 0)? ", ": "") + this.bank.weight.toFixed(1) + " kg";
    }
  }

  ngAfterViewInit(): void { 
    this.reload_bank_details();

    this.babyEditorDialog.confirm.subscribe((baby:Baby) => {
      if(this.dialogMode == DialogMode.Add)
        {
          console.log(baby);
          console.log(this.babies);
          let matchingBabyLength = this.babies.find(b => b.length === baby.length && b.customer_bank_id == this.bank_id);
          if(matchingBabyLength) {
            matchingBabyLength.quantity += baby.quantity;
          }
          else {
            console.log("else");
            this.babies.push({
              id: 0,
              customer_bank_id: this.bank_id,
              length: baby.length,
              quantity: baby.quantity,
              created_at: new Date(),
              updated_at: new Date(),
              created_by: 1,
              updated_by: 1,
              customer_id: this.bank.customer_id,
              material_name: this.bank.raw_material_name,
              customer_name: this.bank.customer_name
            });
            //this.babies.push(baby);
          }
        }
        //this.recalculateTotalsOnClient();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reload_bank_details();
  }

  openBabyDialog(baby: Customer_Baby | null = null){
    if(baby == null) {
      this.dialogMode = DialogMode.Add;
      this.babyEditorDialog.dialog_content_component.editedObject = {
        id: 0, raw_material_parent_id: 0,  raw_material: '',
        length: 0, quantity: 0,
        created_at: new Date(), updated_at: new Date(),
        created_by: 1, updated_by: 1
      };
      this.babyEditorDialog.modalTitle = "<span class='icon-baby'></span> Add new babies";
    }
    else {
      this.dialogMode = DialogMode.Edit;
      this.babyEditorDialog.modalTitle = "<span class='icon-baby'></span> Edit babies";
      this.babyEditorDialog.dialog_content_component.editedObject = baby;
    }
    this.babyEditorDialog.open();  
  }

  deleteBaby(baby: Customer_Baby){
    let babyIndex = this.babies.findIndex(b => b.id == baby.id);
    if(babyIndex >= 0)
    {
      this.babies.splice(babyIndex, 1);
    }
    //this.recalculateTotalsOnClient();
  }

}
