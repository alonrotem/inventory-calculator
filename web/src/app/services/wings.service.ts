import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { lastValueFrom, Observable, of } from 'rxjs';
import { PaginationParams, Wing, ShortWingsInfo, WingsList, WingsListItem,  } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WingsService {

  allWingsAndBabiesCache: ShortWingsInfo[] = [];

  constructor(private apiService: ApiService) { }

  getWing = (id: number): Observable<Wing> => {
    return this.apiService.get(`${environment.serverUrl}/wings/${id}`, {
      responseType: 'json'
    });
  };

  getWingByName = (name: string): Observable<Wing> => {
    return this.apiService.get(`${environment.serverUrl}/wings/names/${name}`, {
      responseType: 'json'
    });
  };

  getWings = (params: PaginationParams): Observable<WingsList> => {
    return this.apiService.get(`${environment.serverUrl}/wings/`, {
      params,
      responseType: 'json'
    });
  };

  getWings_for_customer = (customerID: number): Observable<WingsList> => {
    return this.apiService.get(`${environment.serverUrl}/wings/customer/${customerID}`, {
      responseType: 'json'
    });
  };
/*
  getWingPositions = (): Observable<WingPosition[]> => {
    return this.apiService.get(`${environment.serverUrl}/wings/positions`, {
      responseType: 'json'
    });
  };
*/  getWingsNames = (): Observable<string[]> => {
      return this.apiService.get(`${environment.serverUrl}/wings/names`, {
        responseType: 'json'
      });
    };
/*
  saveNewWing = (wing: Wing): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/wings/`, wing, { });
  };
*/
  saveWing = (wing: Wing): Observable<any> => {
    this.invalidateWingsCache();
    return this.apiService.put(`${environment.serverUrl}/wings/`, wing, { });
  };

  deleteWing = (id: number): Observable<any> => {
    this.invalidateWingsCache();
    return this.apiService.delete(`${environment.serverUrl}/wings/${id}`, { });
  };

   getAllNonCustomerWingsAndBabies = (): Observable<ShortWingsInfo[]> => {
    if(this.allWingsAndBabiesCache.length == 0) {
      let request_observable = this.apiService.get(`${environment.serverUrl}/wings/allwingsandbabies`, { responseType: 'json' }) as Observable<ShortWingsInfo[]>;
      request_observable.subscribe(
      {
        next: (data: ShortWingsInfo[]) => {
          this.allWingsAndBabiesCache = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
      return request_observable;
    }
    else {
      return of(this.allWingsAndBabiesCache);
    }
  }

  invalidateWingsCache() {
    this.allWingsAndBabiesCache = [];
  }
}
