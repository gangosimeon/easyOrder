import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

if (environment.production) {
  console.log   = () => {};
  console.warn  = () => {};
  console.info  = () => {};
  console.debug = () => {};
  console.error = () => {};
}

bootstrapApplication(AppComponent, appConfig).catch(() => {});
