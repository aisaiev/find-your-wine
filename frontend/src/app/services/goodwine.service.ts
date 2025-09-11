import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
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
  private WINES_CONTAINER_SELECTOR = '.gallery-items-33P';
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

  private getWineName(wineItem: Element): string {
    const wineName = wineItem.querySelector('span').textContent ?? '';
    let wineMaker = '';
    const wineItemSpanItems = wineItem.querySelectorAll('span');
    if (wineItemSpanItems.length > 0) {
      const spanAnchors = wineItemSpanItems[wineItemSpanItems.length - 2].querySelectorAll('a');
      if (spanAnchors.length > 0) {
        wineMaker = spanAnchors[spanAnchors.length - 1].textContent.replace('\t', '').replace('/', '').trim();
      }
    }
    return normalizeWineName(wineMaker ? `${wineMaker} ${wineName}` : wineName);
  }

  private addRatingBadge(wineItem: Element): void {
    if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
      const wineName = this.getWineName(wineItem);
      const item = wineItem.querySelector('.item-images-1xN');
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
