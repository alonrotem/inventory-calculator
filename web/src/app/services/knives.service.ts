import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Knife, KnivesList, PaginationParams } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnivesService {

  constructor(private apiService: ApiService) { }

  getKnife = (id: number): Observable<Knife> => {
    return this.apiService.get(`${environment.serverUrl}/knives/single/${id}`, {
      responseType: 'json'
    });
  };

  getKnives = (params: PaginationParams): Observable<KnivesList> => {
    return this.apiService.get(`${environment.serverUrl}/knives/`, {
      params,
      responseType: 'json'
    });
  };

  //save: update or create
  save = (knife: Knife): Observable<any> => {
    return this.apiService.put(`${environment.serverUrl}/knives/`, knife, { });
  };

  deleteKnife = (id: number): Observable<any> => {
    return this.apiService.delete(`${environment.serverUrl}/knives/${id}`, { });
  };
}
