import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationRef } from '@angular/core';
import 'zone.js';

const ROOT_ELEMENT_TAG = 'app-root';
let applicationRef: ApplicationRef;

if (!document.querySelector(ROOT_ELEMENT_TAG)) {
  document.body.appendChild(document.createElement(ROOT_ELEMENT_TAG));
}

bootstrapApplication(AppComponent).then((appRef) => {
  applicationRef = appRef;
});

export { applicationRef as ApplicationRef };
