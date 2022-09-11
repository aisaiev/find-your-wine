import { HOST } from 'src/app/app.constants';

export const isAuchanWineDepartment = (): boolean => {
  return window.location.host.includes(HOST.AUCHAN) && window.location.pathname.includes('wine');
};

export const isWineTimeWineDepartment = (): boolean => {
  return window.location.host.includes(HOST.WINE_TIME)
    && (window.location.pathname.includes('wine/')
    || window.location.pathname.includes('wine')
    || window.location.pathname.includes('wines')
    || window.location.pathname.includes('-wine')
    || window.location.pathname.includes('lambrusko.htm')
    || window.location.pathname.includes('asti.htm')
    || window.location.pathname.includes('prosecco.htm')
    || window.location.pathname.includes('cava.htm')
    || window.location.pathname.includes('grenache.htm')
    || window.location.pathname.includes('cabernet-sauvignon.htm')
    || window.location.pathname.includes('karmener.htm')
    || window.location.pathname.includes('malbec.htm')
    || window.location.pathname.includes('merlot.htm')
    || window.location.pathname.includes('nebbiolo.htm')
    || window.location.pathname.includes('pinot-noir.htm')
    || window.location.pathname.includes('sangiovese.htm')
    || window.location.pathname.includes('gewurztraminer.htm')
    || window.location.pathname.includes('chardonnay.htm')
    || window.location.pathname.includes('sauvignon-blanc.htm')
    || window.location.pathname.includes('riesling.htm')
    || window.location.pathname.includes('muscat.htm'));
};

export const isGoodWineWineDepartment = (): boolean => {
  return window.location.host.includes(HOST.GOOD_WINE)
    && (window.location.pathname.includes('vino')
    || window.location.pathname.includes('igristye'));
};

export const isRozetkaWineDepartment = (): boolean => {
  return window.location.host.includes(HOST.ROZETKA)
    && window.location.pathname.includes('vino');
};