import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { TransactionHistoryService } from '../../../services/transaction-history.service';
import { HistoryReportRecord, RawMaterial, TransactionType } from '../../../../types';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { faArrowsRotate, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-bank-history-dialog',
  standalone: true,
  imports: [ ModalDialogComponent, NgFor, NgSwitch, NgSwitchCase, NgIf, DateStrPipe, FaIconComponent, FontAwesomeModule, RouterModule ],
  templateUrl: './bank-history-dialog.component.html',
  styleUrl: './bank-history-dialog.component.scss'
})
export class BankHistoryDialogComponent {
  @ViewChild('dialog') dialog!: ModalDialogComponent;
  history_records: HistoryReportRecord[] = [];
  raw_material_name: string ="";
  raw_material_id: number =-1;
  raw_material_units: string = "";
  loading: boolean = true;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  Math = Math;

  constructor(private transactionHistoryService: TransactionHistoryService, private excelService: ExcelService) {
  }

  open(bank_id: number) {
    //console.log("loading history for " + bank_id);
    this.loading = true;
    this.transactionHistoryService.get_history_for_customer_bank(bank_id).subscribe((records: HistoryReportRecord[])=> {
      //console.log("received " + records.length)
      this.history_records = records;
      this.loading = false;
    });
    this.dialog.open();
  }

  ExportToExcel (){
    let d = new Date();
    let dateStr = d.getFullYear() + "-" + 
      (d.getMonth()+1).toString().padStart(2, '0') + "-" +
      d.getDate().toString().padStart(2, '0') + 
      "_" + d.getHours().toString().padStart(2, '0') + 
      "-" + d.getMinutes().toString().padStart(2, '0');
    let filename = dateStr + "-" + this.raw_material_name.toLowerCase().replace(" ","-") + "-history";
   this.excelService.generateExcel(this.history_records, filename); 
  }
}
