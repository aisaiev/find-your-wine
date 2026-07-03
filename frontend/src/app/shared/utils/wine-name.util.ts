const cyrillicToLatin: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie',
  ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l',
  м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
  ю: 'iu', я: 'ia',
  ё: 'e', ъ: '', э: 'e', ы: 'y',
};

const transliterate = (text: string): string => {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => cyrillicToLatin[ch] ?? ch)
    .join('');
};

const descriptorSet = new Set([
  'вино', 'ігристе', 'игристое', 'sparkling',
  'червоне', 'червоний', 'красное',
  'біле', 'білий',
  'рожеве', 'рожевий', 'розовое',
  'коричневий', 'бурштинове',
  'напівсухе', 'полусухое', 'напівсолодке', 'полусладкое',
  'сухе', 'сухое', 'солодкий', 'солодке',
  'десертне', 'десертное', 'кріплене', 'крепленое',
  'брют', 'екстра',
]);

const stripDescriptors = (tokens: string[]): string[] => {
  return tokens.filter((t) => !descriptorSet.has(t));
};

export const normalizeWineName = (wineTitle: string): string => {
  if (!wineTitle) return '';

  const parts = wineTitle.split(' / ');
  const titleToNormalize = parts.length > 1 ? pickBestPart(parts) : wineTitle;

  const cleaned = titleToNormalize
    .toLowerCase()
    .replace(/[°%@()«»"',.\-\\/]/g, ' ')
    .replace(/\d+\s*[лм%]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned.split(/\s+/).filter((t) => t.length >= 2);
  const filtered = stripDescriptors(tokens);

  if (!filtered.length) return '';

  const latinTokens: string[] = [];
  const cyrillicTokens: string[] = [];

  for (const token of filtered) {
    if (/^[a-z]+$/.test(token)) {
      latinTokens.push(token);
    } else if (/^[а-яґєії]+$/.test(token)) {
      cyrillicTokens.push(token);
    }
  }

  if (!latinTokens.length && cyrillicTokens.length) {
    return cyrillicTokens.map(transliterate).join(' ');
  }

  if (cyrillicTokens.length) {
    const transliterated = cyrillicTokens.map(transliterate);
    return [...latinTokens, ...transliterated].join(' ');
  }

  return latinTokens.join(' ');
};

const pickBestPart = (parts: string[]): string => {
  const latinCounts = parts.map((p) => {
    const cleaned = p.toLowerCase().replace(/[°%@()«»"',.\-\\/]/g, ' ');
    const tokens = cleaned.split(/\s+/);
    return tokens.filter((t) => /^[a-z]+$/.test(t) && t.length >= 2).length;
  });
  const maxIdx = latinCounts.indexOf(Math.max(...latinCounts));
  return parts[maxIdx];
};