import { Component, ViewChild } from '@angular/core';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { TransactionHistoryService } from '../../../services/transaction-history.service';
import { FlowKind, HistoryReportRecord, RawMaterial } from '../../../../types';
import { NgFor, NgIf } from '@angular/common';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { faArrowsRotate, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExcelService } from '../../../services/excel.service';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { TranslationService } from '../../../i18n/translation.service';
import { TranslationKey } from '../../../i18n/translation-keys';

/**
 * The flow of material, depending on where it is opened from:
 *   raw material  all its purchases: bought / removed, and to / from customer banks
 *   purchase      bought / removed, and to / from its customer banks
 *   bank          to / from its purchase, and to / from its allocations
 *   allocation    to / from its bank, and to / from the orders (babies and tails)
 */
@Component({
  selector: 'app-raw-material-history-dialog',
  standalone: true,
  imports: [TranslatePipe, ModalDialogComponent, NgFor, NgIf, DateStrPipe, FaIconComponent, FontAwesomeModule],
  templateUrl: './raw-material-history-dialog.component.html',
  styleUrl: './raw-material-history-dialog.component.scss'
})
export class RawMaterialHistoryDialogComponent {
  @ViewChild('dialog') dialog!: ModalDialogComponent;
  history_records: HistoryReportRecord[] = [];
  kind: FlowKind = 'raw_material';
  raw_material_name: string = "";
  entity_label: string = "";
  loading: boolean = true;
  faArrowsRotate: IconProp = faArrowsRotate;
  faTriangleExclamation: IconProp = faTriangleExclamation;

  constructor(
    private transactionHistoryService: TransactionHistoryService,
    private excelService: ExcelService,
    private translation: TranslationService) {
  }

  /** The history of a raw material (all its purchases) */
  open(raw_material: RawMaterial) {
    this.open_flow('raw_material', raw_material.id, raw_material.name, raw_material.name);
  }

  /**
   * The history of a purchase, a customer bank or an allocation.
   * name: the raw material name; label: what is shown as the opened item (e.g. its customer name or its number)
   */
  open_flow(kind: FlowKind, id: number, name: string, label: string = '') {
    this.kind = kind;
    this.loading = true;
    this.history_records = [];
    this.raw_material_name = name;
    this.entity_label = label;
    this.transactionHistoryService.get_flow(kind, id).subscribe({
      next: (records: HistoryReportRecord[]) => {
        this.history_records = records;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.dialog.open();
  }

  /** What was done */
  action_label(record: HistoryReportRecord): string {
    return this.translation.t(('raw_materials:history.events.' + record.transaction_type) as TranslationKey);
  }

  /** Who is on the other side of the movement: where the material came from (in) or went to (out) */
  other_label(record: HistoryReportRecord): string {
    const id = record.other_id;
    switch (record.other_type) {
      case 'external':
        return this.translation.t(record.direction == 'in' ? 'raw_materials:history.place.external_in' : 'raw_materials:history.place.external_out');
      case 'purchase':
        return this.translation.t('raw_materials:history.place.purchase', { id });
      case 'bank':
        return record.customer_name
          ? this.translation.t('raw_materials:history.place.bank_named', { id, name: record.customer_name })
          : this.translation.t('raw_materials:history.place.bank', { id });
      case 'allocation':
        return this.translation.t('raw_materials:history.place.allocation', { id });
      case 'hat_order':
        return this.translation.t('raw_materials:history.place.hat_order', { id });
    }
    return '';
  }

  /** The quantity: material in its units, or the number of babies / tails */
  quantity_label(record: HistoryReportRecord, quantity: number | null = record.transaction_quantity): string {
    if (quantity === null || quantity === undefined) return '';
    if (record.quantity_units == 'babies' || record.quantity_units == 'tails') {
      return this.translation.t(('raw_materials:history.' + record.quantity_units) as TranslationKey, { count: Number(quantity) });
    }
    return this.translation.quantity(Number(quantity), record.quantity_units);
  }

  /** The babies of an order: "12 cm x 4, 11 cm x 2" */
  detail_label(record: HistoryReportRecord): string {
    const detail = (typeof (record.detail as unknown) == 'string') ? this.parse(record.detail as unknown as string) : record.detail;
    const babies = detail?.babies;
    if (!babies || babies.length == 0) return '';
    return babies.map(b => this.translation.t('common:units.cm_1', { value: b.length }) + ' x ' + b.count).join(', ');
  }

  private parse(text: string): NonNullable<HistoryReportRecord['detail']> | null {
    try { return JSON.parse(text); } catch { return null; }
  }

  ExportToExcel (){
    let d = new Date();
    let dateStr = d.getFullYear() + "-" + 
      (d.getMonth()+1).toString().padStart(2, '0') + "-" +
      d.getDate().toString().padStart(2, '0') + 
      "_" + d.getHours().toString().padStart(2, '0') + 
      "-" + d.getMinutes().toString().padStart(2, '0');
    let filename = dateStr + "-" + this.raw_material_name.toLowerCase().replace(" ","-") + "-history";
    const rows = this.history_records.map(record => ({
      id: record.id,
      date: record.date,
      action: this.action_label(record),
      direction: record.direction,
      other_side: this.other_label(record),
      quantity: record.transaction_quantity,
      units: record.quantity_units,
      balance_after: record.balance_after,
      details: this.detail_label(record),
      note: record.note,
      user: record.added_by_name,
      customer: record.customer_name,
      raw_material: record.raw_material_name
    }));
    this.excelService.generateExcel(rows, filename);
  }
}
