import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Hat, HatsList, PaginationParams } from '../../types';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HatsService {

  constructor(private apiService: ApiService) { }

  getHat = (id: number): Observable<Hat> => {
    return this.apiService.get(`${environment.serverUrl}/hats/${id}`, {
      responseType: 'json'
    });
  };

  getHats = (params: PaginationParams): Observable<HatsList> => {
    return this.apiService.get(`${environment.serverUrl}/hats/`, {
      params,
      responseType: 'json'
    });
  };

  saveNewHat = (hat: Hat): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/hats/`, hat, { });
  };

  updateHat = (hat: Hat): Observable<any> => {
    return this.apiService.put(`${environment.serverUrl}/hats/${hat.id}`, hat, { });
  };

  deleteHat = (id: number): Observable<any> => {
    return this.apiService.delete(`${environment.serverUrl}/hats/${id}`, { });
  };

}
