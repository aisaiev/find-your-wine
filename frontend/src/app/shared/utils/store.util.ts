import { Host } from '../../app.constants';

export const isAuchanWineDepartment = (): boolean => {
  return window.location.host.includes(Host.Auchan) && window.location.pathname.includes('wine');
};

export const isWineTimeWineDepartment = (): boolean => {
  return (
    window.location.host.includes(Host.WineTime) &&
    (window.location.pathname.includes('wine/') ||
      window.location.pathname.includes('wine') ||
      window.location.pathname.includes('wines') ||
      window.location.pathname.includes('-wine') ||
      window.location.pathname.includes('lambrusko.htm') ||
      window.location.pathname.includes('asti.htm') ||
      window.location.pathname.includes('prosecco.htm') ||
      window.location.pathname.includes('cava.htm') ||
      window.location.pathname.includes('grenache.htm') ||
      window.location.pathname.includes('cabernet-sauvignon.htm') ||
      window.location.pathname.includes('karmener.htm') ||
      window.location.pathname.includes('malbec.htm') ||
      window.location.pathname.includes('merlot.htm') ||
      window.location.pathname.includes('nebbiolo.htm') ||
      window.location.pathname.includes('pinot-noir.htm') ||
      window.location.pathname.includes('sangiovese.htm') ||
      window.location.pathname.includes('gewurztraminer.htm') ||
      window.location.pathname.includes('chardonnay.htm') ||
      window.location.pathname.includes('sauvignon-blanc.htm') ||
      window.location.pathname.includes('riesling.htm') ||
      window.location.pathname.includes('muscat.htm'))
  );
};

export const isGoodWineWineDepartment = (): boolean => {
  return (
    window.location.host.includes(Host.GoodWine) &&
    (window.location.pathname === '/' || window.location.pathname.includes('vino') || window.location.pathname.includes('igristye'))
  );
};

export const isOkWineWineDepartment = (): boolean => {
  return (
    window.location.host.includes(Host.OkWine) &&
    (window.location.pathname.includes('vina') ||
      window.location.pathname.includes('vino') ||
      window.location.pathname.includes('liker') ||
      window.location.pathname.includes('-wine'))
  );
};

export const isRozetkaWineDepartment = (): boolean => {
  return window.location.host.includes(Host.Rozetka) && window.location.pathname.includes('vino');
};
