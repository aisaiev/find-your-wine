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

export const normalizeWineName = (wineTitle: string): string => {
  if (!wineTitle) return '';

  const [, secondPart] = wineTitle.split(' / ');
  const titleToNormalize = secondPart || wineTitle;

  const replaced = applyWineReplacements(titleToNormalize);

  const matches = replaced
    .trim()
    .match(/([a-z]{2,})|([а-яґєії]{2,})/gi);

  return matches ? matches.join(' ').trim() : '';
};