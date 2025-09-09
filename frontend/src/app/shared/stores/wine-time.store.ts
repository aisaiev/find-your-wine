import { EMPTY, from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { createWineTimeWineRatingBadge } from '../utils/badge.util';
import { isWineTimeWineDepartment } from '../utils/store.util';
import { VIVINO_BAGE_CLASS } from '../../app.constants';
import { WineService } from '../service/wine.service';
import { WineRating } from '../../models/wine-rating.model';

const wineService = new WineService();

export const addWineTimeWineRating = (): void => {
  if (isWineTimeWineDepartment()) {
    addRatings();
    const observer = new MutationObserver((mutations) => mutations.forEach(() => addRatings()));
    observer.observe(document.querySelector('.j-fx-row-xs.j-wrap-xs.j-mt-20-xs.j-gap-4-xs'), { childList: true });
  }
};

const addRatings = (): void => {
  const interval = setInterval(() => {
    const wineListItems = getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`));
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
  return [...Array.from(document.querySelectorAll('.j-col-12-xs.j-col-6-sm.j-col-4-md.j-col-3-bg'))];
};

const getRating = (wineItem: Element): Observable<WineRating> => {
  const wineTitle = wineItem.querySelector('.product-micro--title').textContent;
  const wineName = getWineName(wineTitle as string);
  return wineName ? wineService.getWineRating(wineName) : EMPTY;
};

const addRating = (wineItem: Element, wineRating: WineRating): void => {
  if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
    const item = wineItem.querySelector('.product-micro--image');
    const wineRatingBadge = createWineTimeWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
};

const getWineName = (wineTitle: string): string => {
  if (!wineTitle) return null;

  const tempWineTitle = wineTitle.split(' / ')[1];
  if (tempWineTitle) wineTitle = tempWineTitle;

  wineTitle = wineTitle.toLowerCase();

  wineTitle = wineTitle.replace('вино', '');

  wineTitle = wineTitle.replace('ігристе', '');
  wineTitle = wineTitle.replace('игристое', '');
  wineTitle = wineTitle.replace('sparkling', '');

  wineTitle = wineTitle.replace('червоне', '');
  wineTitle = wineTitle.replace('червоний', '');
  wineTitle = wineTitle.replace('красное', '');
  wineTitle = wineTitle.replace('біле', '');
  wineTitle = wineTitle.replace('білий', '');
  wineTitle = wineTitle.replace('рожеве', '');
  wineTitle = wineTitle.replace('рожеве', '');
  wineTitle = wineTitle.replace('рожевий', '');
  wineTitle = wineTitle.replace('розовое', '');
  wineTitle = wineTitle.replace('коричневий', '');

  wineTitle = wineTitle.replace('напівсухе', '');
  wineTitle = wineTitle.replace('полусухое', 'semi-dry');
  wineTitle = wineTitle.replace('сухе', '');
  wineTitle = wineTitle.replace('сухое', '');
  wineTitle = wineTitle.replace('напівсолодке', '');
  wineTitle = wineTitle.replace('полусладкое ', '');
  wineTitle = wineTitle.replace('солодкий', '');
  wineTitle = wineTitle.replace('десертне', '');
  wineTitle = wineTitle.replace('десертное ', '');
  wineTitle = wineTitle.replace('кріплене', '');
  wineTitle = wineTitle.replace('крепленое', '');
  wineTitle = wineTitle.replace('брют', '');
  wineTitle = wineTitle.replace('екстра', '');

  wineTitle = wineTitle.replace('шираз', 'shiraz');
  wineTitle = wineTitle.replace('шардоне', 'chardonnay');
  wineTitle = wineTitle.replace('каберне', 'cabernet');
  wineTitle = wineTitle.replace('совіньон', 'sauvignon');
  wineTitle = wineTitle.replace('совиньон', 'sauvignon');
  wineTitle = wineTitle.replace('пино', 'pinot');
  wineTitle = wineTitle.replace('піно', 'pinot');
  wineTitle = wineTitle.replace('гри', 'grigio');
  wineTitle = wineTitle.replace('грі', 'grigio');

  const wineName = wineTitle.trim().match(/([a-z]{2,})|([а-яґєії]{2,})/g);

  return wineName ? wineName.join(' ') : null;
};