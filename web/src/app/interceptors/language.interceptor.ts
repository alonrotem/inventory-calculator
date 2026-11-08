import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/** Tells the server the app's language, so the messages it sends (errors, emails) come in it. */
@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // only our own server; the language is set on <html> by TranslationService
    if (!request.url.startsWith(environment.serverUrl)) {
      return next.handle(request);
    }
    return next.handle(request.clone({ setHeaders: { 'Accept-Language': document.documentElement.lang || 'en' } }));
  }
}
