import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Country, Currency, QuantityHistoryRecord, Stats } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private apiService: ApiService) { }

  countries: Country[] = [];

  getCountries = (): Observable<Country[]> => {
    return this.apiService.get(`${environment.serverUrl}/countries/`, {
      responseType: 'json'
    });
  };

  getCurrencies = (): Observable<Currency[]> => {
    return this.apiService.get(`${environment.serverUrl}/currencies/`, {
      responseType: 'json'
    });
  };

  getStatistics = (): Observable<Stats> => {
    return this.apiService.get(`${environment.serverUrl}/info/stats/`, {
      responseType: 'json'
    });
  };

  getRawMaterialsQuantityHistory = (quantity_units:string): Observable<QuantityHistoryRecord[]> => {
    return this.apiService.get(`${environment.serverUrl}/transaction_history/raw_quantity_history/${quantity_units}`, {
      responseType: 'json'
    });
  };
}
