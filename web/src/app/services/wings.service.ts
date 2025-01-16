import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PaginationParams, Wing, WingsList,  } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WingsService {

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
    return this.apiService.put(`${environment.serverUrl}/wings/`, wing, { });
  };

  deleteWing = (id: number): Observable<any> => {
    return this.apiService.delete(`${environment.serverUrl}/wings/${id}`, { });
  };
}
