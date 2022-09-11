import { from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';
import { getWineRating } from '../service/message.service';
import { createWineTimeWineRatingBadge } from '../utils/badge.util';
import { isWineTimeWineDepartment } from '../utils/store.util';
import { debounce } from 'lodash';

export const addWineTimeWineRating = (): void => {
  if (isWineTimeWineDepartment()) {
    const interval = setInterval(() => {
      const wineListItems = getWineListItems().filter(wineItem => !wineItem.querySelector('.vivino-rating'));
      if (wineListItems.length > 0) {
        clearInterval(interval);
        from(wineListItems).pipe(
          concatMap(wineItem => of(wineItem).pipe(delay(250))),
          concatMap(wineItem => zip(of(wineItem), getRating(wineItem))),
          tap(wineItemRating => {
            const [wineItem, wineRating] = wineItemRating;
            if (wineRating) {
              addRating(wineItem, wineRating);
            }
          })
        ).subscribe();
      }
    }, 500);

    document.removeEventListener('scroll', loadingWinesListener);
    document.addEventListener('scroll', loadingWinesListener);
  }
};

const loadingWinesListener = debounce(() => {
  addWineTimeWineRating();
}, 2000);

function getWineListItems(): Element[] {
  return [...document.querySelectorAll('.products-main-slider-item')];
}

function getRating(wineItem: Element): Observable<IWineRating> {
  const wineName = wineItem.querySelector('.p-title').textContent;
  return getWineRating(wineName);
}

function addRating(wineItem: Element, wineRating: IWineRating): void {
  if (!wineItem.querySelector('.vivino-rating')) {
    const item = wineItem.querySelector('.products-main-slider-item-wrapper .p-main-slider-item-top');
    const wineRatingBadge = createWineTimeWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
}
