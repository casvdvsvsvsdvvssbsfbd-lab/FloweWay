/**
 * Format currency in Uzbek Som (so'm / UZS)
 * Example: 340000 -> "340 000 so'm"
 */
export function formatUZS(amount: number): string {
  if (isNaN(amount)) return '0 so\'m';
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} so'm`;
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}, ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  } catch {
    return isoString;
  }
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '',
  'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': 'o', 'ғ': 'g',
  'қ': 'q', 'ҳ': 'h',
};

/**
 * Typo-tolerant, multi-script search helper
 * Matches Uzbek Latin, Cyrillic, transliterations, and handles apostrophes (' ` ʻ ʼ)
 */
export function matchesSearch(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const cleanText = normalizeText(text);
  const cleanQuery = normalizeText(query);

  // Exact or contains substring
  if (cleanText.includes(cleanQuery) || cleanQuery.includes(cleanText)) return true;

  // Word-by-word token matching
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);
  const textTokens = cleanText.split(/\s+/).filter(Boolean);

  return queryTokens.every(qToken => {
    return textTokens.some(tToken => {
      if (tToken.includes(qToken) || qToken.includes(tToken)) return true;
      // 1-character typo tolerance for tokens with length >= 4
      if (qToken.length >= 4 && tToken.length >= 4) {
        return levenshteinDistance(qToken, tToken) <= 1;
      }
      return false;
    });
  });
}

export function normalizeText(str?: string | null): string {
  if (!str) return '';
  let lowered = str.toLowerCase();

  // Transliterate cyrillic characters
  let transliterated = '';
  for (const char of lowered) {
    transliterated += CYRILLIC_TO_LATIN[char] !== undefined ? CYRILLIC_TO_LATIN[char] : char;
  }

  return transliterated
    .replace(/['`ʻʼ’‘]/g, '')
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
