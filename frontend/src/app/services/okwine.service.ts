import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable, of, Subject, forkJoin } from 'rxjs';
import { delay, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { isOkWineWineDepartment } from '../shared/utils/store.util';
import { VIVINO_BAGE_CLASS, WINE_RESIDUES_CLASS } from '../app.constants';
import { OkWineInternalData } from '../models/okwine';
import { Message } from '../models/message';
import { SettingsService } from './settings.service';
import { WineResiduesQuery } from '../models/wine-residues-query';
import { normalizeWineName } from '../shared/utils/wine-name.util';
import { WineStoreService } from './contract/wine-store-service';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root',
})
export class OkwineService implements WineStoreService {
  private badgeService = inject(BadgeService);
  private settingsService = inject(SettingsService);
  private WINE_ITEM_CONTAINER_SELECTOR = '[data-testid="integrationProductContainer"]';
  private addRatingsUntil$ = new Subject<void>();
  private ratingsObserver: MutationObserver;

  addRating(): void {
    const item = document.querySelector(this.WINE_ITEM_CONTAINER_SELECTOR)?.parentElement;
    if (!item) return;

    this.addRatingsUntil$.next();
    this.addRatings(0, item.className).subscribe();

    this.ratingsObserver?.disconnect();
    this.ratingsObserver = new MutationObserver(() => {
      this.addRatingsUntil$.next();
      this.addRatings(2000, item.className).subscribe();
    });
    this.ratingsObserver.observe(item, { childList: true });
  }

  private addRatings(delayMs: number, tableSelector: string): Observable<void> {
    if (!isOkWineWineDepartment()) return EMPTY;

    const wineItems = this.getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`));

    return of(null).pipe(
      delay(delayMs),
      switchMap(() =>
        forkJoin({
          settings: this.settingsService.get('okwineSettings'),
          winesInternalData: this.getWinesInternalData(tableSelector),
        })
      ),
      switchMap(({ settings, winesInternalData }) => {
        return from(wineItems).pipe(
          map((wineItem) => {
            const wineInternalData = this.getWineItemInternalData(wineItem, winesInternalData);
            return { wineItem, wineInternalData };
          }),
          tap(({ wineItem, wineInternalData }) => {
            this.addRatingBadge(wineItem);
            if (settings?.showResidues) {
              this.addResiduesBadge(wineItem, {
                type: 'okwine',
                data: { cityId: settings.cityId, marketId: settings.marketId, data: wineInternalData },
              });
            }
          }),
          map(() => null),
          takeUntil(this.addRatingsUntil$)
        );
      })
    );
  }

  private getWineItemInternalData(wineItem: Element, data: OkWineInternalData[]): OkWineInternalData {
    const utp = wineItem.querySelector('[data-testid="integrationProductUtp"]').textContent;
    return data.find((d) => d.utp === utp);
  }

  private getWinesInternalData(selector: string): Observable<OkWineInternalData[]> {
    return new Observable((observer) => {
      chrome.runtime.sendMessage<Message>({ type: 'GetOkwineInternalData', selector }, (response: OkWineInternalData[]) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  private getWineListItems(): Element[] {
    return Array.from(document.querySelectorAll(this.WINE_ITEM_CONTAINER_SELECTOR));
  }

  private getWineName(wineItem: Element): string {
    const links = wineItem.querySelectorAll('a');
    let wineTitle = links.item(links.length - 1).firstChild.textContent;
    return normalizeWineName(wineTitle);
  }

  private addRatingBadge(wineItem: Element): void {
    if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
      const wineName = this.getWineName(wineItem);
      const item = wineItem.firstChild.firstChild;
      item.appendChild(
        this.badgeService.createWineRatingBadgeComponent(wineName, {
          position: 'absolute',
          right: '15px',
          bottom: '0px',
          cursor: 'pointer',
        })
      );
    }
  }

  private addResiduesBadge(wineItem: Element, data: WineResiduesQuery): void {
    if (!wineItem.querySelector(`.${WINE_RESIDUES_CLASS}`)) {
      const item = wineItem.firstChild.firstChild;
      item.appendChild(
        this.badgeService.createWineResiduesBadgeComponent(data, {
          position: 'absolute',
          right: '15px',
          bottom: '65px',
          cursor: 'pointer',
          'z-index': '1',
        })
      );
    }
  }
}
