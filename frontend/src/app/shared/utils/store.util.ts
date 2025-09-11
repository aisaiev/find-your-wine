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
  const element = document.querySelector(`.${selector.split(' ').join('.')}`);
  const reactFiber = Object.keys(element).find((key) => key.startsWith('__reactFiber'));
  const domFiber = element[reactFiber];
  const data = domFiber.memoizedProps.children[0].map((child) => {
    const id = child.props.product.id;
    const pr_id = child.props.product.pr_id;
    const utp = child.props.product.utp;
    return { id, pr_id, utp };
  });
  return data;
};
