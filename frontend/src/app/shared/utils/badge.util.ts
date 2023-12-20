import { VivinoBadgeRatingClass } from '../../app.constants';
import { IWineRating } from '../model/wine-rating.model';

const getBadgePercentage = (score: number): number => {
  return +((score * 100) / 5).toFixed(2);
};

const getBadgeColor = (score: number): string => {
  return score >= 0 && score < 3 ? '#FFAB00' : '#00C853';
};

const getBadgeHtml = (wineRating: IWineRating): string => {
  return `
  <svg viewBox="0 0 36 36" style="height: 30px; width: 30px; stroke: ${getBadgeColor(wineRating.score)};">
    <path style="fill: none; stroke: #eee; stroke-width: 3.8;"
      d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"></path>
    <path style="fill: none; stroke-width: 2.8; stroke-linecap: round;"
      stroke-dasharray="${getBadgePercentage(wineRating.score)}, 100"
      d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"></path>
    <text x="18" y="23" style="font-size: 14px; stroke: #312A29; text-anchor: middle;">${wineRating.score}</text>
  </svg>`;
};

export const createAuchanWineRatingBadge = (wineRating: IWineRating): Element => {
  const badge = document.createElement('div');
  badge.title = `${wineRating.reviewsCount} reviews in Vivino`;
  badge.classList.add(VivinoBadgeRatingClass);
  badge.style.position = 'absolute';
  badge.style.right = '0px';
  badge.style.bottom = '0px';
  badge.style.height = '30px';
  badge.style.cursor = 'pointer';
  badge.innerHTML = getBadgeHtml(wineRating);
  badge.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(wineRating.link, '_blank');
  });
  return badge;
};

export const createWineTimeWineRatingBadge = (wineRating: IWineRating): Element => {
  const badge = document.createElement('div');
  badge.title = `${wineRating.reviewsCount} reviews in Vivino`;
  badge.classList.add(VivinoBadgeRatingClass);
  badge.style.position = 'absolute';
  badge.style.right = '0px';
  badge.style.bottom = '0px';
  badge.style.height = '30px';
  badge.style.cursor = 'pointer';
  badge.innerHTML = getBadgeHtml(wineRating);
  badge.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(wineRating.link, '_blank');
  });
  return badge;
};

export const createGoodWineWineRatingBadge = (wineRating: IWineRating): Element => {
  const badge = document.createElement('div');
  badge.title = `${wineRating.reviewsCount} reviews in Vivino`;
  badge.classList.add(VivinoBadgeRatingClass);
  badge.style.position = 'absolute';
  badge.style.right = '0px';
  badge.style.top = '0px';
  badge.style.height = '30px';
  badge.style.cursor = 'pointer';
  badge.innerHTML = getBadgeHtml(wineRating);
  badge.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(wineRating.link, '_blank');
  });
  return badge;
};

export const createOkWineWineRatingBadge = (wineRating: IWineRating): Element => {
  const badge = document.createElement('div');
  badge.title = `${wineRating.reviewsCount} reviews in Vivino`;
  badge.classList.add(VivinoBadgeRatingClass);
  badge.style.position = 'absolute';
  badge.style.right = '15px';
  badge.style.bottom = '0px';
  badge.style.height = '30px';
  badge.style.cursor = 'pointer';
  badge.innerHTML = getBadgeHtml(wineRating);
  badge.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(wineRating.link, '_blank');
  });
  return badge;
};

export const createRozetkaWineRatingBadge = (wineRating: IWineRating): Element => {
  const badge = document.createElement('div');
  badge.title = `${wineRating.reviewsCount} reviews in Vivino`;
  badge.classList.add(VivinoBadgeRatingClass);
  badge.style.marginTop = '10px';
  badge.style.height = '30px';
  badge.style.cursor = 'pointer';
  badge.innerHTML = getBadgeHtml(wineRating);
  badge.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(wineRating.link, '_blank');
  });
  return badge;
};
