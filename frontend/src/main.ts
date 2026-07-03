import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const ROOT_ELEMENT_TAG = 'app-root';

if (!document.querySelector(ROOT_ELEMENT_TAG)) {
  document.body.appendChild(document.createElement(ROOT_ELEMENT_TAG));
}

bootstrapApplication(AppComponent, appConfig);
