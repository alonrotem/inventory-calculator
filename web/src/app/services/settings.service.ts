import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private apiService: ApiService) { }

  getSettings = (keys: string[]): Observable<Record<string, string>> => {
    return this.apiService.post(`${environment.serverUrl}/settings/`, keys, { });
  };

  saveSettings(settings: Record<string, string>): Observable<any>{
     return this.apiService.put(`${environment.serverUrl}/settings/`, settings, { });
  }

  async getNumOfItemsPerPage(): Promise<number>{
    const settings: Record<string, string> = await firstValueFrom(this.getSettings([
      "ui_settings_grid_paging", 
      "ui_settings_grid_page_size"
    ]));
    if(!settings["ui_settings_grid_paging"]){
      return 0;
    }
    else {
      if(settings["ui_settings_grid_page_size"]){
        const num_of_items_per_page = parseInt(settings["ui_settings_grid_page_size"]);
        if(!isNaN(num_of_items_per_page)){
          return num_of_items_per_page;
        }
      }
    }    
    return 20;
  }
}
