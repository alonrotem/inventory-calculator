import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, RouteConfigLoadEnd, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RefreshInterceptor } from './interceptors/refresh.interceptor';
import { UsersService } from './services/users.service';

function initializeApp(userService: UsersService) {
  // Angular will wait for this Observable to complete before rendering
  return () => userService.checkSignInStatus();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true, // Allows multiple interceptors to be registered for the token
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [UsersService],
      multi: true
    }
  ]
};
