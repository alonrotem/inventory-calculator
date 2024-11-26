import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Customers, Customer, PaginationParams  } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private apiService: ApiService) { }

  getCustomer = (id: number): Observable<Customer> => {
    return this.apiService.get(`${environment.serverUrl}/customers/single/${id}`, {
      responseType: 'json'
    });
  };

  getCustomers = (params: PaginationParams): Observable<Customers> => {
    return this.apiService.get(`${environment.serverUrl}/customers/`, {
      params,
      responseType: 'json'
    });
  };

  getCustomerNames = (): Observable<string[]> => {
    return this.apiService.get(`${environment.serverUrl}/customers/names/`, {
      responseType: 'json'
    });
  };

  /*
  saveNewCustomer = (customer: Customer): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/customers/`, customer, { });
  };
  */

  saveCustomer = (customer: Customer): Observable<any> => {
    return this.apiService.put(`${environment.serverUrl}/customers/`, customer, { });
  };

  deleteCustomer = (id: number): Observable<any> => {
    return this.apiService.delete(`${environment.serverUrl}/customers/${id}`, { });
  };
}
