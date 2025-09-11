import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationRef } from '@angular/core';
import { appConfig } from './app/app.config';
import 'zone.js';

const ROOT_ELEMENT_TAG = 'app-root';
let applicationRef: ApplicationRef;

if (!document.querySelector(ROOT_ELEMENT_TAG)) {
  document.body.appendChild(document.createElement(ROOT_ELEMENT_TAG));
}

bootstrapApplication(AppComponent, appConfig).then((appRef) => {
  applicationRef = appRef;
});

export { applicationRef };
