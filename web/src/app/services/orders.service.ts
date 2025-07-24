import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CustomerHat, Order, OrderDetails, OrderListItem, OrdersList, PaginationParams } from '../../types';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private apiService: ApiService) { }

  createOrder = (customerHat: CustomerHat): Observable<any> => {
    return this.apiService.put(`${environment.serverUrl}/orders/`, customerHat, { });
  };

  getOrders = (params: PaginationParams, customer_id: number): Observable<OrdersList> => {
    if(customer_id > 0)
      params["customer_id"] = customer_id;
    
    return this.apiService.get(`${environment.serverUrl}/orders/`, {
      params,
      responseType: 'json'
    });
  };

  getOrder = (order_id: number): Observable<OrderDetails> => {
    return this.apiService.get(`${environment.serverUrl}/orders/${order_id}`, {
      responseType: 'json'
    });
  };

  updateOrderProperty(order_id: number, property: string, value: string):Observable<any> {
    console.log("updateOrderProperty(order_id: "+order_id+", property: "+property+", value: "+value+")" );
    return this.apiService.post(`${environment.serverUrl}/orders/property/`, { order_id, property, value }, { });
  }
}
