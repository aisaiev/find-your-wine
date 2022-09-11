import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class CustomRouting implements CanActivate {

  constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const page = route.queryParams.page;
        if (page) {
            this.router.navigate(['/' + page]);
        }
        return true;
    }
}
