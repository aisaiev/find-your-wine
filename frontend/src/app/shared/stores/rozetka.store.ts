import { EMPTY, from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, filter, tap } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';
import { getWineRating } from '../service/message.service';
import { createRozetkaWineRatingBadge } from '../utils/badge.util';
import { isRozetkaWineDepartment } from '../utils/store.util';
import { VivinoBadgeRatingClass } from '../../app.constants';

export const addRozetkaWineRating = (): void => {
  if (isRozetkaWineDepartment()) {
    const interval = setInterval(() => {
      const wineListItems = getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VivinoBadgeRatingClass}`));
      if (wineListItems.length > 0) {
        clearInterval(interval);
        from(wineListItems)
          .pipe(
            concatMap((wineItem) => of(wineItem).pipe(delay(100))),
            concatMap((wineItem) => zip(of(wineItem), getRating(wineItem))),
            filter((wineItemRating) => !!wineItemRating[1]),
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
  return [...Array.from(document.querySelectorAll('li[class~="catalog-grid__cell"]'))];
};

const getRating = (wineItem: Element): Observable<IWineRating> => {
  const wineTitle = wineItem.querySelector('span[class~="goods-tile__title"]').textContent;
  const wineName = getWineName(wineTitle as string);
  return wineName ? getWineRating(wineName) : EMPTY;
};

const addRating = (wineItem: Element, wineRating: IWineRating): void => {
  if (!wineItem.querySelector(`.${VivinoBadgeRatingClass}`)) {
    const item = wineItem.querySelector('.goods-tile__picture');
    const wineRatingBadge = createRozetkaWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
};

const getWineName = (wineTitle: string): string => {
  if (!wineTitle) return null;

  wineTitle = wineTitle.toLowerCase();

  if (wineTitle.includes('набор') || wineTitle.includes('набір')) return null;

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
