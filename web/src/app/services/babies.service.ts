import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Babies, PaginationParams } from '../../types';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BabiesService {

  constructor(private apiService: ApiService) { }

  getBabiesForRawMaterial = (params: PaginationParams): Observable<Babies> => {
    return this.apiService.get(`${environment.serverUrl}/babies`, {
      params,
      responseType: 'json'
    });
  };
}
