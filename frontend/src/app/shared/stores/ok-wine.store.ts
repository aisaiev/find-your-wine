import { EMPTY, from, interval, Observable, of, Subject, zip } from 'rxjs';
import { concatMap, filter, map, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { WineRating } from '../models/types.model';
import { getWineRating } from '../service/message.service';
import { createOkWineWineRatingBadge } from '../utils/badge.util';
import { isOkWineWineDepartment } from '../utils/store.util';
import { VivinoBadgeRatingClass } from '../../app.constants';

const WINE_ITEM_CONTAINER_SELECTOR = '[data-testid="integrationProductContainer"]';

const addRatingsUntil$ = new Subject<void>();
let ratingsObserver: MutationObserver;

export const addOkWineWineRating = (): void => {
  addRatingsUntil$.next();
  addRatings().subscribe();

  const item = document.querySelector(WINE_ITEM_CONTAINER_SELECTOR)?.parentNode;
  if (!item) return;
  ratingsObserver?.disconnect();
  ratingsObserver = new MutationObserver(() => {
    addRatingsUntil$.next();
    addRatings().subscribe();
  });
  ratingsObserver.observe(item, { childList: true });
};

const addRatings = (): Observable<void> => {
  if (!isOkWineWineDepartment()) return EMPTY;
  return interval().pipe(
    map(() => getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VivinoBadgeRatingClass}`))),
    takeWhile((wineListItems) => wineListItems.length === 0, true),
    switchMap((wineListItems) => from(wineListItems)),
    concatMap((wineItem) => zip(of(wineItem), getRating(wineItem))),
    filter(([, wineRating]) => !!wineRating),
    map(([wineItem, wineRating]) => {
      addRating(wineItem, wineRating);
      return undefined;
    }),
    takeUntil(addRatingsUntil$)
  );
};

const getWineListItems = (): Element[] => {
  return Array.from(document.querySelectorAll(WINE_ITEM_CONTAINER_SELECTOR));
};

const getRating = (wineItem: Element): Observable<WineRating> => {
  const links = wineItem.querySelectorAll('a');
  const wineTitle = links.item(links.length - 1).firstChild.textContent;
  const wineName = getWineName(wineTitle as string);
  return wineName ? getWineRating(wineName) : EMPTY;
};

const addRating = (wineItem: Element, wineRating: WineRating): void => {
  if (!wineItem.querySelector(`.${VivinoBadgeRatingClass}`)) {
    const item = wineItem.firstChild.firstChild;
    const wineRatingBadge = createOkWineWineRatingBadge(wineRating);
    item.appendChild(wineRatingBadge);
  }
};

const wineReplacements: { from: string; to: string }[] = [
  { from: 'вино', to: '' },
  { from: 'ігристе', to: '' },
  { from: 'игристое', to: '' },
  { from: 'sparkling', to: '' },
  { from: 'червоне', to: '' },
  { from: 'червоний', to: '' },
  { from: 'красное', to: '' },
  { from: 'біле', to: '' },
  { from: 'білий', to: '' },
  { from: 'рожеве', to: '' },
  { from: 'рожевий', to: '' },
  { from: 'розовое', to: '' },
  { from: 'коричневий', to: '' },
  { from: 'бурштинове', to: '' },
  { from: 'напівсухе', to: '' },
  { from: 'полусухое', to: 'semi-dry' },
  { from: 'сухе', to: '' },
  { from: 'сухое', to: '' },
  { from: 'напівсолодке', to: '' },
  { from: 'полусладкое ', to: '' },
  { from: 'солодкий', to: '' },
  { from: 'солодке', to: '' },
  { from: 'десертне', to: '' },
  { from: 'десертное ', to: '' },
  { from: 'кріплене', to: '' },
  { from: 'крепленое', to: '' },
  { from: 'брют', to: '' },
  { from: 'екстра', to: '' },
  { from: 'шираз', to: 'shiraz' },
  { from: 'шардоне', to: 'chardonnay' },
  { from: 'каберне', to: 'cabernet' },
  { from: 'совіньон', to: 'sauvignon' },
  { from: 'совиньон', to: 'sauvignon' },
  { from: 'пино', to: 'pinot' },
  { from: 'піно', to: 'pinot' },
  { from: 'гри', to: 'grigio' },
  { from: 'грі', to: 'grigio' },
];

const applyWineReplacements = (title: string): string => {
  let result = title.toLowerCase();
  wineReplacements.forEach(({ from, to }) => {
    result = result.replaceAll(from, to);
  });
  return result;
};

const getWineName = (wineTitle: string): string | null => {
  if (!wineTitle) return null;

  const tempWineTitle = wineTitle.split(' / ')[1];
  if (tempWineTitle) wineTitle = tempWineTitle;

  wineTitle = applyWineReplacements(wineTitle);

  const wineName = wineTitle.trim().match(/([a-z]{2,})|([а-яґєії]{2,})/g);

  return wineName ? wineName.join(' ') : null;
};
