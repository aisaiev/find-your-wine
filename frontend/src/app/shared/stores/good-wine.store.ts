import { from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { createGoodWineWineRatingBadge } from '../utils/badge.util';
import { isGoodWineWineDepartment } from '../utils/store.util';
import { VIVINO_BAGE_CLASS } from '../../app.constants';
import { WineService } from '../service/wine.service';
import { WineRating } from '../../models/wine-rating.model';

const wineService = new WineService();

export const addGoodWineWineRating = (): void => {
  if (isGoodWineWineDepartment()) {
    const interval = setInterval(() => {
      const wineListItems = getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`));
      if (wineListItems.length > 0) {
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
  }
};

const getWineListItems = (): Element[] => {
  return [...Array.from(document.querySelectorAll('.item-root-ER-'))];
};

const getRating = (wineItem: Element): Observable<WineRating> => {
  const wineName = wineItem.querySelector('span').textContent ?? '';
  let wineMaker = '';
  const wineItemSpanItems = wineItem.querySelectorAll('span');
  if (wineItemSpanItems.length > 0) {
    const spanAnchors = wineItemSpanItems[wineItemSpanItems.length - 2].querySelectorAll('a');
    if (spanAnchors.length > 0) {
      wineMaker = spanAnchors[spanAnchors.length - 1].textContent.replace('\t', '').replace('/', '').trim();
    }
  }
  return wineService.getWineRating(wineMaker ? `${wineMaker} ${wineName}` : wineName);
};

const addRating = (wineItem: Element, wineRating: WineRating): void => {
  if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
    const item = wineItem.querySelector('.item-images-1xN');
    const wineRatingBadge = createGoodWineWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
};
