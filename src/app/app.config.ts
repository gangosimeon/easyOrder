import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor }        from './core/interceptors/auth.interceptor';
import { apiResponseInterceptor } from './core/interceptors/api-response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiResponseInterceptor, authInterceptor])
    ),
  ],
};
