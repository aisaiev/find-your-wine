import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomRouting } from './core//custom-routing';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'index.html', component: AppComponent, canActivate: [CustomRouting]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
