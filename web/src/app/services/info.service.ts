import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Country, Currency, QuantityHistoryRecord, Stats } from '../../types';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private apiService: ApiService) { }

  countries_cache: Country[] = [];
  currencies_cache: Currency[] = [];

  getCountries = (): Observable<Country[]> => {
    if(this.countries_cache.length == 0) {
      let request_observable = this.apiService.get(`${environment.serverUrl}/countries/`, { responseType: 'json' }) as Observable<Country[]>;
      request_observable.subscribe(
      {
        next: (data: Country[]) => {
          this.countries_cache = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
      return request_observable;
    }
    else {
      return of(this.countries_cache);
    }
  };

  getCurrencies = (): Observable<Currency[]> => {
    if(this.currencies_cache.length == 0) {
      let request_observable = this.apiService.get(`${environment.serverUrl}/currencies/`, { responseType: 'json' }) as Observable<Currency[]>;
      request_observable.subscribe(
      {
        next: (data: Currency[]) => {
          this.currencies_cache = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
      return request_observable;
    }
    else {
      return of(this.currencies_cache);
    }
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
