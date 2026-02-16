import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private usersService: UsersService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = this.usersService.getAccessToken();
    if(accessToken){
       // 1. Clone the request and add the Authorization header
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(clonedRequest);
    }
    
    // 2. If no token in memory, proceed with original request (may lead to 401)
    return next.handle(request);
  }
}