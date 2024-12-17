import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Options } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get<T>(url: string, options: Options): Observable<T>{
    return this.httpClient.get<T>(url, options) as Observable<T>;
  }

  get_file(url: string): Observable<HttpResponse<Blob>>{
    return this.httpClient.get(url, { 
      observe: 'response', 
      responseType: 'blob' 
    }) as Observable<HttpResponse<Blob>>;
  }

  post<T>(url: string, body: any, options: Options): Observable<T>{
    return this.httpClient.post<T>(url, body, options) as Observable<T>;
  }

  put<T>(url: string, body: any, options: Options): Observable<T>{
    return this.httpClient.put<T>(url, body, options) as Observable<T>;
  }

  delete<T>(url: string, options: Options): Observable<T>{
    return this.httpClient.delete(url, options) as Observable<T>;
  }
}
