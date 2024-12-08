import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { HistoryReportRecord } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  constructor(private apiService: ApiService) { }

  get_history_for_raw_material(raw_material_id:number): Observable<HistoryReportRecord[]> {
    return this.apiService.get(`${environment.serverUrl}/transaction_history/raw_material/${raw_material_id}`, {
      responseType: 'json'
    });
  }

  get_history_for_customer_bank(bank_id:number): Observable<HistoryReportRecord[]> {
    return this.apiService.get(`${environment.serverUrl}/transaction_history/customer_bank/${bank_id}`, {
      responseType: 'json'
    });
  }
}
