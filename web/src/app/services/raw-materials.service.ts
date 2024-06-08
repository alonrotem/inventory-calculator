import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Pagination, RawMaterials } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialsService {

  constructor(private apiService: ApiService) { }

  getRawMaterials = (url:string, params: Pagination): Observable<RawMaterials> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json'
    });
  }
}
