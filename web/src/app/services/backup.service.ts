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

  getBackup = (): Observable<HttpResponse<Blob>> => {
    return this.apiService.get_file(`${environment.serverUrl}/backup/`);
  };

  extractFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    
    const filenameRegex = /filename="?([^"]+)"?/;
    const match = contentDisposition.match(filenameRegex);
    return match ? match[1] : null;
  }
}
