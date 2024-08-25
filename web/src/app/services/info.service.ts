import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Country, Currency, Stats } from '../../types';

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
}
