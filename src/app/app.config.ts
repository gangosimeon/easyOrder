import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { shopMockInterceptor } from './core/interceptors/shop-mock.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })),
    // ✅ Angular 20 — animations asynchrones (lazy-loaded)
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([shopMockInterceptor])),
  ],
};
