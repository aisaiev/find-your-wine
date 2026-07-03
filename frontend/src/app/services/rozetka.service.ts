import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable, of, Subject } from 'rxjs';
import { delay, map, takeUntil, tap } from 'rxjs/operators';
import { isRozetkaWineDepartment } from '../shared/utils/store.util';
import { VIVINO_BAGE_CLASS, WineStore } from '../app.constants';
import { normalizeWineName } from '../shared/utils/wine-name.util';
import { WineStoreService } from './contract/wine-store-service';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root',
})
export class RozetkaService implements WineStoreService {
  private badgeService = inject(BadgeService);
  private WINES_CONTAINER_SELECTOR = 'rz-catalog-goods';
  private addRatingsUntil$ = new Subject<void>();
  private ratingsObserver: MutationObserver;

  addRating(): void {
    const item = document.querySelector(this.WINES_CONTAINER_SELECTOR);
    if (!item) return;

    this.addRatingsUntil$.next();
    of(null).pipe(delay(1000), tap(() => this.addRatings().subscribe())).subscribe();

    this.ratingsObserver?.disconnect();
    this.ratingsObserver = new MutationObserver(() => {
      this.addRatingsUntil$.next();
      of(null).pipe(delay(2000), tap(() => this.addRatings().subscribe())).subscribe();
    });
    this.ratingsObserver.observe(item, { childList: true, subtree: true });
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

  private getProductId(wineItem: Element): string {
    return wineItem.querySelector('.g-id')?.textContent?.trim() ?? '';
  }

  private getRawWineName(wineItem: Element): string {
    return wineItem.querySelector('a[class="tile-title black-link text-base"]')?.textContent?.trim() ?? '';
  }

  private addRatingBadge(wineItem: Element): void {
    if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
      const productId = this.getProductId(wineItem);
      const rawName = this.getRawWineName(wineItem);
      const wineName = normalizeWineName(rawName);
      if (!wineName) return;
      const item = wineItem.querySelector('.tile-image-host');
      item.appendChild(
        this.badgeService.createWineRatingBadgeComponent({ market: 'rozetka', productId, name: wineName }, {
          position: 'absolute',
          right: '0px',
          bottom: '0px',
          cursor: 'pointer',
        })
      );
    }
  }
}
