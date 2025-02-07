import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Hat, HatBasicInfo, HatsList, nameIdPair, PaginationParams } from '../../types';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HatsService {

  constructor(private apiService: ApiService) { }

  getHat = (id: number): Observable<Hat> => {
    return this.apiService.get(`${environment.serverUrl}/hats/single/${id}`, {
      responseType: 'json'
    });
  };

  getHats = (params: PaginationParams): Observable<HatsList> => {
    return this.apiService.get(`${environment.serverUrl}/hats/`, {
      params,
      responseType: 'json'
    });
  };

  getHatsNames = (): Observable<nameIdPair[]> => {
    return this.apiService.get(`${environment.serverUrl}/hats/names`, {
      responseType: 'json'
    });
  };

  getHatsBasicInfo = (): Observable<HatBasicInfo[]> => {
    return this.apiService.get(`${environment.serverUrl}/hats/basic`, {
      responseType: 'json'
    });
  };

/*
  saveNewHat = (hat: Hat): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/hats/`, hat, { });
  };
*/
  saveHat = (hat: Hat, hatPhoto: File | null = null): Observable<any> => {
    const hatData = new FormData();
    hatData.append('data', JSON.stringify(hat));
    if (hatPhoto) {
      hatData.append('photo', hatPhoto);
    }
    return this.apiService.put(`${environment.serverUrl}/hats/`, hatData, { });
  };

  deleteHat = (id: number): Observable<any> => {
    return this.apiService.delete(`${environment.serverUrl}/hats/${id}`, { });
  };

}
