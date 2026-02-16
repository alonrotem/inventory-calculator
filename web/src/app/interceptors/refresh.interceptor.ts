// src/app/auth/refresh.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Injectable()
export class RefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private excludedUrls = ['/users/login', '/users/refresh'];

  constructor(private authService: UsersService, private router: Router) {} // 🎯 Router removed

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("INTERCEPTOR CAUGHT ERROR");
        console.dir(error);
        // Handle 401s, excluding login/refresh to avoid infinite loops
        if (error.status === 401 && !this.excludedUrls.some(url => request.url.includes(url))) {
          return this.handle401Error(request, next);
        }
        if(error.status === 403 && !this.excludedUrls.some(url => request.url.includes(url))) {
          this.router.navigate(['forbidden'], { skipLocationChange: true });
        }
        return throwError(() => error);
      })
    );
  }

// src/app/auth/refresh.interceptor.ts

private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
  if (!this.isRefreshing) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);
    
    return this.authService.refreshAccessToken().pipe(
      switchMap((token) => {
        this.isRefreshing = false;
        if (token) {
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }
        else {
          // 🎯 Use purge() so the state is cleared silently
          this.authService.purge(); 
          return throwError(() => new HttpErrorResponse({ status: 401 }));
        }        
        /*
        // 🎯 REFRESH FAILED: Release the queue with an error
        const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
        this.refreshTokenSubject.error(error); 
        // Reset the subject for the next attempt later
        this.refreshTokenSubject = new BehaviorSubject<string | null>(null); 
        
        this.authService.logout();
        return throwError(() => error);
        */
      }),
      catchError(err => {
        this.isRefreshing = false;
        // 🎯 REFRESH ERRORED: Release the queue with the error
        this.refreshTokenSubject.error(err);
        this.refreshTokenSubject = new BehaviorSubject<string | null>(null);
        
        this.authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    // Queued requests will now either get a token OR an error from the block above
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token!)))
    );
  }
}

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { 'Authorization': `Bearer ${token}` }
    });
  }
}