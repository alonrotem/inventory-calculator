import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, RouteConfigLoadEnd, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RefreshInterceptor } from './interceptors/refresh.interceptor';
import { UsersService } from './services/users.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { TranslationService } from './i18n/translation.service';
import { initialLocaleId } from './i18n/language';

function initializeApp(userService: UsersService) {
  // Angular will wait for this Observable to complete before rendering
  return () => userService.checkSignInStatus();
}

function initializeTranslations(translation: TranslationService) {
  // the translations are loaded before the first page is shown
  return () => translation.init();
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
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [TranslationService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [UsersService],
      multi: true
    },
    // number and date formats of Angular's pipes
    { provide: LOCALE_ID, useFactory: initialLocaleId },
    provideAnimations()
  ]
};
