import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { FlowKind, HistoryReportRecord } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  constructor(private apiService: ApiService) { }

  /**
   * The movements of material of a raw material (all its purchases), a purchase, a customer bank or an allocation.
   * The records are written by the server, when the material changes: this only reads them.
   */
  get_flow(kind: FlowKind, id: number): Observable<HistoryReportRecord[]> {
    return this.apiService.get(`${environment.serverUrl}/transaction_history/flow/${kind}/${id}`, {
      responseType: 'json'
    });
  }

  get_history_for_raw_material(raw_material_id: number): Observable<HistoryReportRecord[]> {
    return this.get_flow('raw_material', raw_material_id);
  }

  get_history_for_purchase(purchase_id: number): Observable<HistoryReportRecord[]> {
    return this.get_flow('purchase', purchase_id);
  }

  get_history_for_customer_bank(bank_id: number): Observable<HistoryReportRecord[]> {
    return this.get_flow('bank', bank_id);
  }

  get_history_for_allocation(allocation_id: number): Observable<HistoryReportRecord[]> {
    return this.get_flow('allocation', allocation_id);
  }
}
