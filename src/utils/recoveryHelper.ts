import { NewsItem, GalleryItem, DetectedLocalStorageBackup } from '../types';
import { sortNewsByDateDesc } from './dateHelper';

const DUMMY_NEWS_IDS = new Set(['news-prestasi-1', 'news-akademik-1']);

/**
 * Checks if a news dataset only contains the default dummy template articles
 */
export function isDummyNewsOnly(items: NewsItem[]): boolean {
  if (!items || !Array.isArray(items) || items.length === 0) return true;
  if (items.length > 2) return false;
  return items.every((item) => DUMMY_NEWS_IDS.has(item.id));
}

/**
 * Scans browser localStorage for any previously saved news, gallery, or export backups
 */
export function scanLocalStorageForRecoverableData(): {
  newsBackups: DetectedLocalStorageBackup[];
  galleryBackups: DetectedLocalStorageBackup[];
  fullBackups: DetectedLocalStorageBackup[];
} {
  const newsBackups: DetectedLocalStorageBackup[] = [];
  const galleryBackups: DetectedLocalStorageBackup[] = [];
  const fullBackups: DetectedLocalStorageBackup[] = [];

  if (typeof window === 'undefined' || !window.localStorage) {
    return { newsBackups, galleryBackups, fullBackups };
  }

  const seenKeys = new Set<string>();

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || seenKeys.has(key)) continue;
    seenKeys.add(key);

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw || raw.length < 5) continue;

      const parsed = JSON.parse(raw);

      // 1. Check if it's a full export backup
      if (parsed && typeof parsed === 'object' && (parsed.news || parsed.gallery || parsed.exportedAt)) {
        const nItems = Array.isArray(parsed.news) ? parsed.news.length : 0;
        const gItems = Array.isArray(parsed.gallery) ? parsed.gallery.length : 0;
        if (nItems > 0 || gItems > 0) {
          fullBackups.push({
            key,
            type: 'general',
            itemCount: nItems + gItems,
            sampleTitles: [
              ...(Array.isArray(parsed.news) ? parsed.news.slice(0, 3).map((n: any) => n.title || 'Tanpa Judul') : []),
              ...(Array.isArray(parsed.gallery) ? parsed.gallery.slice(0, 2).map((g: any) => g.title || 'Foto Galeri') : [])
            ],
            data: parsed,
            dateDetected: parsed.exportedAt || 'Tidak tercatat'
          });
        }
      }

      // 2. Check for News arrays
      if (Array.isArray(parsed) && (key.includes('news') || key.includes('berita'))) {
        const validNews = parsed.filter((it: any) => it && (it.title || it.slug));
        if (validNews.length > 0) {
          const isDummy = isDummyNewsOnly(validNews);
          newsBackups.push({
            key,
            type: 'news',
            itemCount: validNews.length,
            sampleTitles: validNews.slice(0, 3).map((n: any) => n.title || 'Tanpa Judul'),
            data: validNews,
            dateDetected: isDummy ? 'Template Dummy Default' : 'Data Kustom Pengguna'
          });
        }
      }

      // 3. Check for Gallery arrays
      if (Array.isArray(parsed) && (key.includes('gallery') || key.includes('galeri'))) {
        const validGallery = parsed.filter((it: any) => it && (it.image || it.title));
        if (validGallery.length > 0) {
          galleryBackups.push({
            key,
            type: 'gallery',
            itemCount: validGallery.length,
            sampleTitles: validGallery.slice(0, 3).map((g: any) => g.title || 'Foto Kegiatan'),
            data: validGallery,
            dateDetected: 'Data Galeri Tersimpan'
          });
        }
      }
    } catch {
      // Ignore non-JSON entries
    }
  }

  return { newsBackups, galleryBackups, fullBackups };
}

/**
 * Searches historical storage keys to auto-recover legitimate news items if current state is dummy
 */
export function findBestHistoricalNews(): NewsItem[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  const candidateKeys = [
    'pkbm_sumowono_news_v4',
    'pkbm_sumowono_news_v3',
    'pkbm_sumowono_news_v2',
    'pkbm_sumowono_news_v1',
    'pkbm_sumowono_news',
    'pkbm_news',
    'pkbm_berita'
  ];

  for (const key of candidateKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0 && !isDummyNewsOnly(parsed)) {
          return sortNewsByDateDesc(parsed);
        }
      }
    } catch {}
  }

  // Scan all keys in localStorage
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.includes('news')) continue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0 && !isDummyNewsOnly(parsed)) {
          return sortNewsByDateDesc(parsed);
        }
      }
    } catch {}
  }

  return null;
}

/**
 * Searches historical storage keys to auto-recover legitimate gallery items if current state is empty
 */
export function findBestHistoricalGallery(): GalleryItem[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  const candidateKeys = [
    'pkbm_sumowono_gallery_v4',
    'pkbm_sumowono_gallery_v3',
    'pkbm_sumowono_gallery_v2',
    'pkbm_sumowono_gallery_v1',
    'pkbm_sumowono_gallery',
    'pkbm_gallery',
    'pkbm_galeri'
  ];

  for (const key of candidateKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }

  // Scan all keys in localStorage
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.includes('gallery')) continue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }

  return null;
}
