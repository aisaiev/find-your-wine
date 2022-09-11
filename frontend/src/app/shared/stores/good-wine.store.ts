import { from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';
import { getWineRating } from '../service/message.service';
import { createGoodWineWineRatingBadge } from '../utils/badge.util';
import { isGoodWineWineDepartment } from '../utils/store.util';
import { debounce } from 'lodash';

export const addGoodWineWineRating = (): void => {
  if (isGoodWineWineDepartment()) {
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
  addGoodWineWineRating();
}, 2000);

function getWineListItems(): Element[] {
  return [...document.querySelectorAll('.default.clearfix')];
}

function getRating(wineItem: Element): Observable<IWineRating> {
  const wineName = wineItem.querySelector('span').textContent;
  let wineMaker: string;
  const wineItemSpanItems = wineItem.querySelectorAll('span');
  if (wineItemSpanItems.length > 0) {
    const spanAnchors = wineItemSpanItems[wineItemSpanItems.length - 2].querySelectorAll('a');
    if (spanAnchors.length > 0) {
      wineMaker = spanAnchors[spanAnchors.length - 1].textContent.replace('\t', '').replace('/', '').trim();
    }
  }
  return getWineRating(wineMaker ? `${wineMaker} ${wineName}` : wineName);
}

function addRating(wineItem: Element, wineRating: IWineRating): void {
  if (!wineItem.querySelector('.vivino-rating')) {
    const item = wineItem.querySelector('.imgBlock');
    const wineRatingBadge = createGoodWineWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
}
