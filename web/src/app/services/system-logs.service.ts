import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { lastValueFrom, Observable, of } from 'rxjs';
import { LogfileListItem,  } from '../../types';
import { environment } from '../../environments/environment';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemLogsService {

  constructor(private apiService: ApiService) { }

  getLogsList = (): Observable<LogfileListItem[]> => {
    return this.apiService.get(`${environment.serverUrl}/systemlogs/`, {
      responseType: 'json'
    });
  };

  downloadLogFile = (filename: string): Observable<HttpResponse<Blob>> => {
    return this.apiService.get_file(`${environment.serverUrl}/systemlogs/getlog/${filename}`);
  };

  getLogFileContent = (filename: string): Observable<string[]> => {
    return this.apiService.get(`${environment.serverUrl}/systemlogs/getlogtail/${filename}`, {});
  };
  
  downloadAllLogs = (): Observable<HttpResponse<Blob>> => {
    return this.apiService.get_file(`${environment.serverUrl}/systemlogs/getall/`);
  };

  deleteAllLogs = (): Observable<LogfileListItem[]> => {
    return this.apiService.delete(`${environment.serverUrl}/systemlogs/`, { });
  };

  deleteLogFile = (filename: string): Observable<LogfileListItem[]> => {
    return this.apiService.delete(`${environment.serverUrl}/systemlogs/${filename}`, { });
  };
}
