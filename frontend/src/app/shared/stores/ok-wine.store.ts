import { EMPTY, from, merge, Observable, of, Subject } from 'rxjs';
import { delay, filter, map, mergeMap, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { isOkWineWineDepartment } from '../utils/store.util';
import { MessageType, VIVINO_BAGE_CLASS, WINE_RESUIDUES_CLASS } from '../../app.constants';
import { createComponent } from '@angular/core';
import { WineRatingBadgeComponent } from '../../wine-rating-badge/wine-rating-badge.component';
import { ApplicationRef } from '../../../main';
import { WineService } from '../service/wine.service';
import { WineResiduesBadgeComponent } from '../../wine-residues-badge/wine-residues-badge.component';
import { OkWineInternalData } from '../../models/okwine.model';
import { Message } from '../../models/message.model';
import { WineRating } from '../../models/wine-rating.model';
import { WineResidues } from '../../models/wine-residues.model';
import { StorageUtil } from '../utils/storage.util';
import { forkJoin } from 'rxjs';

const WINE_ITEM_CONTAINER_SELECTOR = '[data-testid="integrationProductContainer"]';

const addRatingsUntil$ = new Subject<void>();
let ratingsObserver: MutationObserver;
const wineService = new WineService();

type WineBadgeData =
  | { type: 'rating'; wineItem: Element; wineRating: WineRating }
  | { type: 'residues'; wineItem: Element; wineResidues: WineResidues };

export const addOkWineRating = (): void => {
  const item = document.querySelector(WINE_ITEM_CONTAINER_SELECTOR)?.parentElement;
  if (!item) return;

  addRatingsUntil$.next();
  addRatings(0, item.className).subscribe();

  ratingsObserver?.disconnect();
  ratingsObserver = new MutationObserver(() => {
    addRatingsUntil$.next();
    addRatings(2000, item.className).subscribe();
  });
  ratingsObserver.observe(item, { childList: true });
};

const addRatings = (delayMs: number, tableSelector: string) => {
  if (!isOkWineWineDepartment()) return EMPTY;
  const wineListItems = getWineListItems().filter((wineItem) => !wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`));
  return of(null).pipe(
    delay(delayMs),
    switchMap(() => forkJoin({ settings: StorageUtil.getSettings('okwineSettings'), winesInternalData: getWinesInternalData(tableSelector) })),
    switchMap(({ settings, winesInternalData }) =>
      of(wineListItems).pipe(
        takeWhile((wineItems) => wineItems.length === 0, true),
        switchMap((wineItems) => from(wineItems)),
        map((wineItem) => {
          const utp = wineItem.querySelector('[data-testid="integrationProductUtp"]').textContent;
          const wineData = winesInternalData.find((data) => data.utp === utp);
          return { wineItem, wineData };
        }),
        mergeMap(({ wineItem, wineData }) => {
          const observables: Observable<WineBadgeData>[] = [
            getRating(wineItem).pipe(
              filter((wineRating) => !!wineRating),
              map((wineRating) => ({ type: 'rating', wineItem, wineRating }))
            ),
          ];
          if (settings?.showResidues) {
            observables.push(
              wineService.getWineResidues(settings.cityId, settings.marketId, wineData).pipe(
                filter((wineResidues) => !!wineResidues),
                map((wineResidues) => ({
                  type: 'residues',
                  wineItem,
                  wineResidues: { ...wineResidues, city: settings?.city, marketAddress: settings?.marketAddress },
                }))
              )
            );
          }
          return merge(...observables);
        }),
        map((result) => {
          if (result.type === 'rating') {
            addRating(result.wineItem, result.wineRating);
          } else if (result.type === 'residues') {
            addResidues(result.wineItem, result.wineResidues);
          }
        }),
        takeUntil(addRatingsUntil$)
      )
    )
  );
};

const getWinesInternalData = (tableSelector: string): Observable<OkWineInternalData[]> => {
  return new Observable((observer) => {
    chrome.runtime.sendMessage<Message>({ type: MessageType.GetOkWineInternalData, selector: tableSelector }, (response: OkWineInternalData[]) => {
      observer.next(response);
      observer.complete();
    });
  });
};

const getWineListItems = (): Element[] => {
  return Array.from(document.querySelectorAll(WINE_ITEM_CONTAINER_SELECTOR));
};

const getRating = (wineItem: Element): Observable<WineRating | null> => {
  const links = wineItem.querySelectorAll('a');
  const wineTitle = links.item(links.length - 1).firstChild.textContent;
  const wineName = getWineName(wineTitle as string);
  return wineService.getWineRating(wineName);
};

const addRating = (wineItem: Element, wineRating: WineRating): void => {
  if (!wineItem.querySelector(`.${VIVINO_BAGE_CLASS}`)) {
    const item = wineItem.firstChild.firstChild;
    item.appendChild(createWineRatingBadgeComponent(wineRating));
  }
};

const addResidues = (wineItem: Element, wineResidues: WineResidues): void => {
  if (!wineItem.querySelector(`.${WINE_RESUIDUES_CLASS}`)) {
    const item = wineItem.firstChild.firstChild;
    item.appendChild(createWineResiduesBadgeComponent(wineResidues));
  }
};

const createWineRatingBadgeComponent = (wineRating: WineRating): HTMLElement => {
  const container = document.createElement('div');
  const componentRef = createComponent(WineRatingBadgeComponent, { hostElement: container, environmentInjector: ApplicationRef.injector });
  componentRef.instance.wineRating.set(wineRating);
  componentRef.instance.styles.set({
    position: 'absolute',
    right: '15px',
    bottom: '0px',
    cursor: 'pointer',
  });
  ApplicationRef.attachView(componentRef.hostView);
  componentRef.changeDetectorRef.detectChanges();
  return container;
};

const createWineResiduesBadgeComponent = (wineResidues: WineResidues): HTMLElement => {
  const container = document.createElement('div');
  const componentRef = createComponent(WineResiduesBadgeComponent, { hostElement: container, environmentInjector: ApplicationRef.injector });
  componentRef.instance.wineResidues.set(wineResidues);
  componentRef.instance.styles.set({
    position: 'absolute',
    right: '15px',
    bottom: '65px',
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
