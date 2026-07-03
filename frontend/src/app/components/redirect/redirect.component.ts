import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  template: '',
})
export class RedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const page = this.route.snapshot.queryParams['app-page'];
    if (page) {
      this.router.navigate([`/${page}`]);
    }
  }
}
