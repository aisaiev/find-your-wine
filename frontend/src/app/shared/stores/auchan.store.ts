import { from, Observable, of, zip } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';
import { getWineRating } from '../service/message.service';
import { createAuchanWineRatingBadge } from '../utils/badge.util';
import { isAuchanWineDepartment } from '../utils/store.util';
import { VivinoBadgeRatingClass } from '../../app.constants';

export const addAuchanWineRating = (): void => {
  if (isAuchanWineDepartment()) {
    const interval = setInterval(() => {
      const wineListItems = getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VivinoBadgeRatingClass}`));
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
  const wineListItems = document.querySelectorAll('div[class~="ProductsBox__listItem"]') as unknown as Element[];
  return [...wineListItems];
};

const getRating = (wineItem: Element): Observable<IWineRating> => {
  const wineTitle = wineItem.querySelector('span[class~="ProductTile__title"]').textContent;
  const wineName = getWineName(wineTitle as string);
  return getWineRating(wineName);
};

const addRating = (wineItem: Element, wineRating: IWineRating): void => {
  if (!wineItem.querySelector(`.${VivinoBadgeRatingClass}`)) {
    const item = wineItem.querySelector('div[data-testid="productTileWeight"]');
    const wineRatingBadge = createAuchanWineRatingBadge(wineRating);
    item.insertAdjacentElement('afterend', wineRatingBadge);
  }
};

const getWineName = (wineTitle: string): string => {
  wineTitle = wineTitle.toLowerCase();

  wineTitle = wineTitle.replace('вино ', '');
  wineTitle = wineTitle.replace('wine ', '');

  wineTitle = wineTitle.replace('ігристе', '');
  wineTitle = wineTitle.replace('игристое', '');
  wineTitle = wineTitle.replace('sparkling', '');

  wineTitle = wineTitle.replace('червоне', '');
  wineTitle = wineTitle.replace('красное', '');
  wineTitle = wineTitle.replace('red', '');
  wineTitle = wineTitle.replace('біле', '');
  wineTitle = wineTitle.replace('белое', '');
  wineTitle = wineTitle.replace('white', '');
  wineTitle = wineTitle.replace('рожеве', '');
  wineTitle = wineTitle.replace('розовое', '');
  wineTitle = wineTitle.replace('pink', '');

  wineTitle = wineTitle.replace('напівсухе', '');
  wineTitle = wineTitle.replace('полусухое', '');
  wineTitle = wineTitle.replace('semi-dry', '');
  wineTitle = wineTitle.replace('сухе', '');
  wineTitle = wineTitle.replace('сухое', '');
  wineTitle = wineTitle.replace('dry', '');
  wineTitle = wineTitle.replace('напівсолодке', '');
  wineTitle = wineTitle.replace('полусладкое ', '');
  wineTitle = wineTitle.replace('semi-sweet ', '');
  wineTitle = wineTitle.replace('semisweet ', '');
  wineTitle = wineTitle.replace('десертне', '');
  wineTitle = wineTitle.replace('десертное ', '');
  wineTitle = wineTitle.replace('dessert ', '');
  wineTitle = wineTitle.replace('кріплене', '');
  wineTitle = wineTitle.replace('крепленое', '');
  wineTitle = wineTitle.replace('strong', '');

  wineTitle = wineTitle.replace('шираз', 'shiraz');
  wineTitle = wineTitle.replace('olombard', 'colombard');
  wineTitle = wineTitle.replace('шардоне', 'chardonnay');
  wineTitle = wineTitle.replace('каберне', 'cabernet');
  wineTitle = wineTitle.replace('совіньон', 'sauvignon');
  wineTitle = wineTitle.replace('совиньон', 'sauvignon');

  const wineName = wineTitle.trim().match(/([a-z]{2,})|([а-яґєії]{2,})/g);

  return wineName ? wineName.join(' ') : '';
};
