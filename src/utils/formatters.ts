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

/**
 * Basic typo-tolerant and multi-language search helper
 * Matches Uzbek, Russian, English, transliterations
 */
export function matchesSearch(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const cleanText = normalizeText(text);
  const cleanQuery = normalizeText(query);

  // Exact substring
  if (cleanText.includes(cleanQuery)) return true;

  // Word-by-word token matching
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);
  const textTokens = cleanText.split(/\s+/).filter(Boolean);

  return queryTokens.every(qToken => {
    return textTokens.some(tToken => {
      if (tToken.includes(qToken) || qToken.includes(tToken)) return true;
      // Simple 1-character typo tolerance for tokens with length >= 4
      if (qToken.length >= 4 && tToken.length >= 4) {
        return levenshteinDistance(qToken, tToken) <= 1;
      }
      return false;
    });
  });
}

function normalizeText(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/['`ʻʼ]/g, '')
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
