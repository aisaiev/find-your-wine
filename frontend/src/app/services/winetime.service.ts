import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { isWineTimeWineDepartment } from '../shared/utils/store.util';
import { VIVINO_BAGE_CLASS } from '../app.constants';
import { normalizeWineName } from '../shared/utils/wine-name.util';
import { createComponent } from '@angular/core';
import { WineRatingBadgeComponent } from '../components/wine-rating-badge/wine-rating-badge.component';
import { WineStoreService } from './contract/wine-store-service';
import { applicationRef } from '../../main';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root',
})
export class WinetimeService implements WineStoreService {
  private badgeService = inject(BadgeService);
  private WINES_CONTAINER_SELECTOR = '.products-column > div:nth-child(3)';
  private addRatingsUntil$ = new Subject<void>();
  private ratingsObserver: MutationObserver;

  addRating(): void {
    const item = document.querySelector(this.WINES_CONTAINER_SELECTOR);
    if (!item) return;

    this.addRatingsUntil$.next();
    this.addRatings().subscribe();

    this.ratingsObserver?.disconnect();
    this.ratingsObserver = new MutationObserver(() => {
      this.addRatingsUntil$.next();
      this.addRatings().subscribe();
    });
    this.ratingsObserver.observe(item, { childList: true });
  }

  private addRatings(): Observable<void> {
    if (!isWineTimeWineDepartment()) return EMPTY;

    const wineItems = this.getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`));

    return from(wineItems).pipe(
      tap((wineItem) => this.addRatingBadge(wineItem)),
      map(() => null),
      takeUntil(this.addRatingsUntil$)
    );
  }

  private getWineListItems(): Element[] {
    return Array.from(document.querySelector(this.WINES_CONTAINER_SELECTOR).children);
  }

  private getWineName(wineItem: Element): string {
    const wineTitle = wineItem.querySelector('.product-micro--title').textContent;
    return normalizeWineName(wineTitle);
  }

  private addRatingBadge(wineItem: Element): void {
    if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
      const wineName = this.getWineName(wineItem);
      const item = wineItem.querySelector('.product-micro--image');
      item.appendChild(
        this.badgeService.createWineRatingBadgeComponent(wineName, {
          position: 'absolute',
          right: '10px',
          top: '170px',
          cursor: 'pointer',
        })
      );
    }
  }
}
