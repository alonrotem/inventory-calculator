import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private apiService: ApiService) { }

  getSettings = (keys: string[]): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/settings/`, keys, { });
  };
}
