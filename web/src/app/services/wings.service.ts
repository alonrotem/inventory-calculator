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

  getWings = (params: PaginationParams): Observable<WingsList> => {
    return this.apiService.get(`${environment.serverUrl}/wings/`, {
      params,
      responseType: 'json'
    });
  };

  saveNewRawMaterial = (wing: Wing): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/wings/`, wing, { });
  };

  updateRawMaterial = (wing: Wing): Observable<any> => {
    return this.apiService.put(`${environment.serverUrl}/wings/${wing.id}`, wing, { });
  };

  deleteRawMaterial = (id: number): Observable<any> => {
    return this.apiService.delete(`${environment.serverUrl}/wings/${id}`, { });
  };
}
