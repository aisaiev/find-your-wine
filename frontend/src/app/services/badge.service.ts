import { ApplicationRef, createComponent, inject, Injectable } from '@angular/core';
import { WineRatingBadgeComponent } from '../components/wine-rating-badge/wine-rating-badge.component';
import { WineResiduesQuery } from '../models/wine-residues-query';
import { WineResiduesBadgeComponent } from '../components/wine-residues-badge/wine-residues-badge.component';
import type { MarketRatingQuery } from './wine.service';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private applicationRef = inject(ApplicationRef);

  createWineRatingBadgeComponent(query: MarketRatingQuery, styles: Record<string, string>): HTMLElement {
    const container = document.createElement('div');
    const componentRef = createComponent(WineRatingBadgeComponent, { hostElement: container, environmentInjector: this.applicationRef.injector });
    componentRef.instance.query.set(query);
    componentRef.instance.styles.set(styles);
    this.applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    return container;
  }

  createWineResiduesBadgeComponent(data: WineResiduesQuery, styles: Record<string, string>): HTMLElement {
    const container = document.createElement('div');
    const componentRef = createComponent(WineResiduesBadgeComponent, { hostElement: container, environmentInjector: this.applicationRef.injector });
    componentRef.instance.queryData.set(data);
    componentRef.instance.styles.set(styles);
    this.applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    return container;
  }
}
