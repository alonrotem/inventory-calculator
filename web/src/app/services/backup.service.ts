import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  constructor(private apiService: ApiService) { }

  getBackup = (zipped: boolean, keep_existing_records: boolean): Observable<HttpResponse<Blob>> => {
    const baclup_fetch_url = "/backup/" + (zipped? "zip/": "");
    return this.apiService.get_file(`${environment.serverUrl}${baclup_fetch_url}?keep_existing_records=${keep_existing_records}`);
  };

  uploadBackup = (formData: FormData): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/backup/`, formData, { });
  }

  extractFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    
    const filenameRegex = /filename="?([^"]+)"?/;
    const match = contentDisposition.match(filenameRegex);
    return match ? match[1] : null;
  }
}
