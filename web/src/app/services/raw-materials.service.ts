import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PaginationParams, RawMaterial, RawMaterials } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialsService {

  constructor(private apiService: ApiService) { }

  getRawMaterial = (id: number): Observable<RawMaterial> => {
    return this.apiService.get(`${environment.serverUrl}/raw_materials/${id}`, {
      responseType: 'json'
    });
  };

  getRawMaterials = (params: PaginationParams): Observable<RawMaterials> => {
    return this.apiService.get(`${environment.serverUrl}/raw_materials/`, {
      params,
      responseType: 'json'
    });
  };

  saveNewRawMaterial = (material: RawMaterial): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/raw_materials/`, material, { });
  };

  updateRawMaterial = (material: RawMaterial): Observable<any> => {
    return this.apiService.put(`${environment.serverUrl}/raw_materials/${material.id}`, material, { });
  };

  deleteRawMaterial = (id: number): Observable<any> => {
    return this.apiService.delete(`${environment.serverUrl}/raw_materials/${id}`, { });
  };
}
