import { NewsItem } from '../types';

/**
 * Parses various date formats into timestamp (milliseconds):
 * - Indonesian text: e.g. "28 Agustus 2026", "10 September 2026", "05 Mei 2026"
 * - ISO string: "2026-09-15" or "2026-09-15T10:30:00.000Z"
 * - Numeric formats: "15/09/2026", "15-09-2026", "2026/09/15"
 * - English text: "September 10, 2026", "10 Sep 2026"
 */
export function parsePublishDate(dateStr?: string): number {
  if (!dateStr || typeof dateStr !== 'string') return 0;
  const trimmed = dateStr.trim();
  if (!trimmed) return 0;

  // 1. Indonesian month names dictionary
  const indonesianMonths: { [key: string]: number } = {
    januari: 0, jan: 0,
    februari: 1, feb: 1, pebruari: 1,
    maret: 2, mar: 2,
    april: 3, apr: 3,
    mei: 4,
    juni: 5, jun: 5,
    juli: 6, jul: 6,
    agustus: 7, agu: 7, ags: 7,
    september: 8, sep: 8, sept: 8,
    oktober: 9, okt: 9,
    november: 10, nov: 10,
    desember: 11, des: 11
  };

  // Indonesian date regex: e.g. "28 Agustus 2026" or "28 Agustus 2026 14:00"
  const indoMatch = trimmed.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})(?:\s*[, ]\s*(\d{1,2}):(\d{2}))?/);
  if (indoMatch) {
    const day = parseInt(indoMatch[1], 10);
    const monthName = indoMatch[2].toLowerCase();
    const year = parseInt(indoMatch[3], 10);
    const hours = indoMatch[4] ? parseInt(indoMatch[4], 10) : 0;
    const minutes = indoMatch[5] ? parseInt(indoMatch[5], 10) : 0;

    if (indonesianMonths[monthName] !== undefined) {
      return new Date(year, indonesianMonths[monthName], day, hours, minutes).getTime();
    }
  }

  // 2. Day-Month-Year e.g. "15/09/2026" or "15-09-2026"
  const dmyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    return new Date(year, month, day).getTime();
  }

  // 3. Year-Month-Day e.g. "2026-09-15"
  const ymdMatch = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    return new Date(year, month, day).getTime();
  }

  // 4. Native JS Date parsing fallback (handles ISO8601, RFC2822, etc.)
  const nativeTime = Date.parse(trimmed);
  if (!isNaN(nativeTime)) {
    return nativeTime;
  }

  return 0;
}

/**
 * Sorts an array of news items by publication date in descending order (newest first).
 */
export function sortNewsByDateDesc(newsList: NewsItem[]): NewsItem[] {
  return [...newsList].sort((a, b) => {
    const timeA = parsePublishDate(a.date);
    const timeB = parsePublishDate(b.date);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    return 0;
  });
}
