import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { AppComponent } from './app.component';
import { CustomRouting } from './custom-routing';

export const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    component: AppComponent,
    canActivate: [CustomRouting],
  },
];
