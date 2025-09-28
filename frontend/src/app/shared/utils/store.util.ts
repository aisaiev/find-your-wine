import { Host } from '../../app.constants';
import { OkWineInternalData } from '../../models/okwine';

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
  if (!window.location.host.includes(Host.OkWine)) return false;

  const winePaths = ['vina', 'vino', '-wine'];
  return winePaths.some((path) => window.location.pathname.includes(path));
};

export const isRozetkaWineDepartment = (): boolean => {
  return window.location.host.includes(Host.Rozetka) && window.location.pathname.includes('vino');
};

export const getOkwineInternalData = (selector: string): OkWineInternalData[] => {
  const classSelector = `.${selector.trim().split(/\s+/).join('.')}`;
  const element = document.querySelector(classSelector);
  if (!element) return [];

  const reactFiberKey = Object.keys(element).find((key) => key.startsWith('__reactFiber'));
  if (!reactFiberKey) return [];

  const domFiber = element[reactFiberKey];
  if (!domFiber?.memoizedProps?.children || !Array.isArray(domFiber.memoizedProps.children)) return [];

  return domFiber.memoizedProps.children
    .map((child: any) => child?.props?.product)
    .filter((product: any) => product && product.id && product.pr_id && product.utp)
    .map((product: any) => ({
      id: product.id,
      pr_id: product.pr_id,
      utp: product.utp,
    }));
};
