import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable, of, Subject } from 'rxjs';
import { delay, map, takeUntil, tap } from 'rxjs/operators';
import { isGoodWineWineDepartment } from '../shared/utils/store.util';
import { VIVINO_BAGE_CLASS } from '../app.constants';
import { normalizeWineName } from '../shared/utils/wine-name.util';
import { WineStoreService } from './contract/wine-store-service';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root',
})
export class GoodwineService implements WineStoreService {
  private badgeService = inject(BadgeService);
  private WINES_CONTAINER_SELECTOR = 'ul.products-items';
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
    if (!isGoodWineWineDepartment()) return EMPTY;

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
    return wineItem.querySelector('form[data-product-id]')?.getAttribute('data-product-id') ?? '';
  }

  private getRawWineName(wineItem: Element): string {
    const nameEl = wineItem.querySelector('.product-item-link');
    const wineName = nameEl?.textContent?.trim() ?? '';
    const producerSpans = wineItem.querySelectorAll('.text-xsm span');
    let producer = '';
    for (const span of producerSpans) {
      const text = span.textContent?.trim();
      if (text && text !== '·' && text !== ',') {
        producer = text;
      }
    }
    return producer ? `${producer} ${wineName}` : wineName;
  }

  private addRatingBadge(wineItem: Element): void {
    if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
      const productId = this.getProductId(wineItem);
      const rawName = this.getRawWineName(wineItem);
      const wineName = normalizeWineName(rawName);
      if (!wineName) return;
      const item = wineItem.querySelector('.product-info');
      if (!item) return;
      item.appendChild(
        this.badgeService.createWineRatingBadgeComponent({ market: 'goodwine', productId, name: wineName }, {
          position: 'absolute',
          right: '0px',
          cursor: 'pointer',
        })
      );
    }
  }
}
