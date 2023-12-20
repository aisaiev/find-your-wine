import { from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';
import { getWineRating } from '../service/message.service';
import { createWineTimeWineRatingBadge } from '../utils/badge.util';
import { isWineTimeWineDepartment } from '../utils/store.util';
import { VivinoBadgeRatingClass } from '../../app.constants';

export const addWineTimeWineRating = (): void => {
  if (isWineTimeWineDepartment()) {
    addRatings();
    const observer = new MutationObserver((mutations) => mutations.forEach(() => addRatings()));
    observer.observe(document.querySelector('.catalog-list-wrapper'), { childList: true });
  }
};

const addRatings = (): void => {
  const interval = setInterval(() => {
    const wineListItems = getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VivinoBadgeRatingClass}`));
    if (wineListItems.length) {
      clearInterval(interval);
      from(wineListItems)
        .pipe(
          concatMap((wineItem) => of(wineItem).pipe(delay(100))),
          concatMap((wineItem) => zip(of(wineItem), getRating(wineItem))),
          tap((wineItemRating) => {
            const [wineItem, wineRating] = wineItemRating;
            if (wineRating) {
              addRating(wineItem, wineRating);
            }
          }),
        )
        .subscribe();
    }
  });
};

const getWineListItems = (): Element[] => {
  return [...Array.from(document.querySelectorAll('.products-main-slider-item'))];
};

const getRating = (wineItem: Element): Observable<IWineRating> => {
  const wineName = wineItem.querySelector('.p-title').textContent;
  return getWineRating(wineName as string);
};

const addRating = (wineItem: Element, wineRating: IWineRating): void => {
  if (!wineItem.querySelector(`.${VivinoBadgeRatingClass}`)) {
    const item = wineItem.querySelector('.products-main-slider-item-wrapper .p-main-slider-item-top');
    const wineRatingBadge = createWineTimeWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
};
