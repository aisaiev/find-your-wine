import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { isRozetkaWineDepartment } from '../shared/utils/store.util';
import { VIVINO_BAGE_CLASS } from '../app.constants';
import { normalizeWineName } from '../shared/utils/wine-name.util';
import { WineStoreService } from './contract/wine-store-service';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root',
})
export class RozetkaService implements WineStoreService {
  private badgeService = inject(BadgeService);
  private WINES_CONTAINER_SELECTOR = 'rz-category-goods';
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
    if (!isRozetkaWineDepartment()) return EMPTY;

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
    const wineTitle = wineItem.querySelector('a[class="tile-title black-link text-base').textContent;
    return normalizeWineName(wineTitle);
  }

  private addRatingBadge(wineItem: Element): void {
    if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
      const wineName = this.getWineName(wineItem);
      const item = wineItem.querySelector('.tile-image-host');
      item.appendChild(
        this.badgeService.createWineRatingBadgeComponent(wineName, {
          position: 'absolute',
          right: '0px',
          bottom: '0px',
          cursor: 'pointer',
        })
      );
    }
  }
}
