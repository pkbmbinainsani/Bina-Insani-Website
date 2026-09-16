import { VideoPlatform } from '../types';

/**
 * Mendeteksi platform penyedia video berdasarkan URL link
 */
export function detectVideoPlatform(url: string): VideoPlatform {
  if (!url || typeof url !== 'string') return 'other';
  const cleanUrl = url.trim().toLowerCase();

  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch') || cleanUrl.includes('fb.com')) {
    return 'facebook';
  }
  if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
    return 'instagram';
  }
  if (cleanUrl.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (cleanUrl.includes('vimeo.com')) {
    return 'vimeo';
  }
  if (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.includes('.mp4?') ||
    cleanUrl.startsWith('data:video/') ||
    cleanUrl.startsWith('blob:')
  ) {
    return 'direct';
  }

  return 'other';
}

/**
 * Ekstraksi ID Video YouTube dari berbagai format URL
 * Format yang didukung:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.trim().match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Ekstraksi Shortcode Instagram (Reels, Post, IGTV)
 */
export function getInstagramMediaCode(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i;
  const match = url.trim().match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Ekstraksi Vimeo Video ID
 */
export function getVimeoVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i;
  const match = url.trim().match(regExp);
  return match && (match[3] || match[2] || match[1]) ? match[3] || match[2] || match[1] : null;
}

/**
 * Menghasilkan URL Embed untuk iframe pemutar video
 */
export function getVideoEmbedUrl(url: string, platformInput?: VideoPlatform): string | null {
  if (!url) return null;
  const platform = platformInput || detectVideoPlatform(url);

  if (platform === 'youtube') {
    const ytId = getYouTubeVideoId(url);
    if (ytId) {
      return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
    }
  }

  if (platform === 'facebook') {
    // Facebook official embedded video player plugin
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.trim())}&show_text=0&autoplay=1`;
  }

  if (platform === 'instagram') {
    const igCode = getInstagramMediaCode(url);
    if (igCode) {
      return `https://www.instagram.com/p/${igCode}/embed`;
    }
  }

  if (platform === 'vimeo') {
    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    }
  }

  // Direct MP4 / online video tidak memerlukan embed URL khusus
  if (platform === 'direct') {
    return url.trim();
  }

  return url.trim();
}

/**
 * Menghasilkan URL Thumbnail video
 * Jika customThumbnail disediakan, maka akan diprioritaskan.
 * Untuk YouTube, thumbnail otomatis diambil dari server YouTube (hqdefault).
 * Untuk Facebook, Instagram, dsb, menggunakan thumbnail bawaan yang representatif.
 */
export function getVideoThumbnail(url: string, platformInput?: VideoPlatform, customThumbnail?: string): string {
  if (customThumbnail && customThumbnail.trim() !== '') {
    return customThumbnail.trim();
  }

  const platform = platformInput || detectVideoPlatform(url);

  if (platform === 'youtube') {
    const ytId = getYouTubeVideoId(url);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  // Placeholder tematik berkualitas tinggi sesuai kategori dan platform
  if (platform === 'facebook') {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  }

  if (platform === 'instagram') {
    return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80';
  }

  if (platform === 'tiktok') {
    return 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=80';
  }

  // Direct video or general online video fallback
  return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
}

/**
 * Informasi UI Lencana Platform Video
 */
export function getVideoPlatformInfo(platform: VideoPlatform) {
  switch (platform) {
    case 'youtube':
      return {
        label: 'YouTube',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        badgeColor: 'bg-red-600 text-white',
        desc: 'YouTube Video / Shorts'
      };
    case 'facebook':
      return {
        label: 'Facebook',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        badgeColor: 'bg-blue-600 text-white',
        desc: 'Facebook Watch / Reel'
      };
    case 'instagram':
      return {
        label: 'Instagram',
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200',
        badgeColor: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white',
        desc: 'Instagram Reel / Video'
      };
    case 'tiktok':
      return {
        label: 'TikTok',
        color: 'text-slate-900',
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-300',
        badgeColor: 'bg-slate-950 text-white',
        desc: 'TikTok Video'
      };
    case 'vimeo':
      return {
        label: 'Vimeo',
        color: 'text-sky-600',
        bgColor: 'bg-sky-50',
        borderColor: 'border-sky-200',
        badgeColor: 'bg-sky-600 text-white',
        desc: 'Vimeo Player'
      };
    case 'direct':
      return {
        label: 'Video MP4/Stream',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        badgeColor: 'bg-emerald-600 text-white',
        desc: 'Berkas Video Online Langsung'
      };
    case 'other':
    default:
      return {
        label: 'Video Online',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        badgeColor: 'bg-amber-600 text-white',
        desc: 'Tautan Video Daring'
      };
  }
}
