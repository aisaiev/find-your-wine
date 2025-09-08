import { EMPTY, from, interval, Observable, of, Subject, zip } from 'rxjs';
import { concatMap, filter, map, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { WineRating } from '../models/types.model';
import { getWineRating } from '../service/message.service';
import { isRozetkaWineDepartment } from '../utils/store.util';
import { VIVINO_BAGE_CLASS } from '../../app.constants';
import { createComponent } from '@angular/core';
import { WineBadgeComponent } from '../../wine-badge/wine-badge.component';
import { ApplicationRef } from '../../../main';

const WINES_CONTAINER_SELECTOR = 'rz-category-goods';

const addRatingsUntil$ = new Subject<void>();
let ratingsObserver: MutationObserver;

export const addRozetkaWineRating = (): void => {
  addRatingsUntil$.next();
  addRatings().subscribe();

  const item = document.querySelector(WINES_CONTAINER_SELECTOR);
  if (!item) return;
  ratingsObserver?.disconnect();
  ratingsObserver = new MutationObserver(() => {
    addRatingsUntil$.next();
    addRatings().subscribe();
  });
  ratingsObserver.observe(item, { childList: true });
};

const addRatings = (): Observable<void> => {
  if (!isRozetkaWineDepartment()) return EMPTY;
  return interval().pipe(
    map(() => getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`))),
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
  return Array.from(document.querySelector(WINES_CONTAINER_SELECTOR).children);
};

const getRating = (wineItem: Element): Observable<WineRating> => {
  const wineTitle = wineItem.querySelector('a[class="tile-title black-link text-base').textContent;
  const wineName = getWineName(wineTitle as string);
  return wineName ? getWineRating(wineName) : EMPTY;
};

const addRating = (wineItem: Element, wineRating: WineRating): void => {
  if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
    const item = wineItem.querySelector('.tile-image-host');
    item.appendChild(createBadgeComponent(wineRating));
  }
};

const createBadgeComponent = (wineRating: WineRating): HTMLElement => {
  const container = document.createElement('div');
  const componentRef = createComponent(WineBadgeComponent, { hostElement: container, environmentInjector: ApplicationRef.injector });
  componentRef.instance.wineRating.set(wineRating);
  componentRef.instance.styles.set({
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    cursor: 'pointer',
  });
  ApplicationRef.attachView(componentRef.hostView);
  componentRef.changeDetectorRef.detectChanges();
  return container;
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
