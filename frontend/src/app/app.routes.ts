import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { RedirectComponent } from './components/redirect/redirect.component';

export const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    component: RedirectComponent,
  },
];
