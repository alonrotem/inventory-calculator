import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PaginationParams, RawMaterials } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialsService {

  constructor(private apiService: ApiService) { }

  getRawMaterials = (url:string, params: PaginationParams): Observable<RawMaterials> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json'
    });
  };

  addRawMaterial = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, { });
  };

  editRawMaterial = (url: string, body: any): Observable<any> => {
    return this.apiService.put(url, body, { });
  };

  deleteRawMaterial = (url: string): Observable<any> => {
    return this.apiService.delete(url, { });
  };
}
