import { EMPTY, from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, filter, tap } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';
import { getWineRating } from '../service/message.service';
import { createOkWineWineRatingBadge } from '../utils/badge.util';
import { isOkWineWineDepartment } from '../utils/store.util';
import { VivinoBadgeRatingClass } from '../../app.constants';

export const addOkWineWineRating = (): void => {
  if (isOkWineWineDepartment()) {
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
  return [...Array.from(document.querySelectorAll('[data-testid="integrationProductContainer"]'))];
};

const getRating = (wineItem: Element): Observable<IWineRating> => {
  const links = wineItem.querySelectorAll('a');
  const wineTitle = links.item(links.length - 1).firstChild.textContent;
  const wineName = getWineName(wineTitle as string);
  return wineName ? getWineRating(wineName) : EMPTY;
};

const addRating = (wineItem: Element, wineRating: IWineRating): void => {
  if (!wineItem.querySelector(`.${VivinoBadgeRatingClass}`)) {
    const item = wineItem.firstChild.firstChild;
    const wineRatingBadge = createOkWineWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
};

const getWineName = (wineTitle: string): string => {
  if (!wineTitle) return null;

  const tempWineTitle = wineTitle.split(' / ')[1];
  if (tempWineTitle) wineTitle = tempWineTitle;

  wineTitle = wineTitle
    .toLowerCase()
    .replace('вино', '')
    .replace('ігристе', '')
    .replace('игристое', '')
    .replace('sparkling', '')
    .replace('червоне', '')
    .replace('червоний', '')
    .replace('красное', '')
    .replace('біле', '')
    .replace('білий', '')
    .replace('рожеве', '')
    .replace('рожеве', '')
    .replace('рожевий', '')
    .replace('розовое', '')
    .replace('коричневий', '')
    .replace('напівсухе', '')
    .replace('полусухое', 'semi-dry')
    .replace('сухе', '')
    .replace('сухое', '')
    .replace('напівсолодке', '')
    .replace('полусладкое ', '')
    .replace('солодкий', '')
    .replace('десертне', '')
    .replace('десертное ', '')
    .replace('кріплене', '')
    .replace('крепленое', '')
    .replace('брют', '')
    .replace('екстра', '')
    .replace('шираз', 'shiraz')
    .replace('шардоне', 'chardonnay')
    .replace('каберне', 'cabernet')
    .replace('совіньон', 'sauvignon')
    .replace('совиньон', 'sauvignon')
    .replace('пино', 'pinot')
    .replace('піно', 'pinot')
    .replace('гри', 'grigio')
    .replace('грі', 'grigio');

  const wineName = wineTitle.trim().match(/([a-z]{2,})|([а-яґєії]{2,})/g);

  return wineName ? wineName.join(' ') : null;
};
