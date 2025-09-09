import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CustomRouting implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const page = route.queryParams['page'];
    if (page) {
      this.router.navigate([`/${page}`]);
    }
    return true;
  }
}
