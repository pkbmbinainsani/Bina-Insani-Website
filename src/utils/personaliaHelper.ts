import { PersonaliaCategory, PersonaliaMember } from '../types';

/**
 * Returns the rank of personalia category groups:
 * 1. Pendiri
 * 2. Pengelola (Pengurus Yayasan & Tenaga Kependidikan / Pengelola Administrasi)
 * 3. Tutor (Pendidik & Tutor Kesetaraan)
 */
export const getCategoryGroupRank = (category: PersonaliaCategory): number => {
  switch (category) {
    case 'pendiri':
      return 1; // 1. Pendiri & Dewan Pembina
    case 'yayasan':
      return 2; // 2. Pengelola (Pengurus Yayasan)
    case 'tendik':
      return 3; // 2. Pengelola (Tenaga Kependidikan / Tata Usaha & Operasional)
    case 'pendidik':
      return 4; // 3. Tutor & Pendidik Kesetaraan
    default:
      return 5;
  }
};

/**
 * Extracts the employee ID (Nomor ID Pegawai / NUPTK / NIP / ID Unik) for sorting.
 * Prioritizes nuptkOrNip, then order, then id.
 */
export const getEmployeeIdSortValue = (member: PersonaliaMember): string => {
  if (member.nuptkOrNip && member.nuptkOrNip.trim()) {
    return member.nuptkOrNip.trim();
  }
  if (member.order !== undefined && member.order !== null) {
    return String(member.order).padStart(6, '0');
  }
  return member.id || '';
};

/**
 * Sorts personalia members by:
 * 1. Urutan: Pendiri -> Pengelola (Yayasan & Tendik) -> Tutor (Pendidik)
 * 2. Pada masing-masing urutan ditentukan berdasarkan nomor ID pegawai (natural comparison)
 */
export const sortPersonaliaMembers = (members: PersonaliaMember[]): PersonaliaMember[] => {
  return [...members].sort((a, b) => {
    // 1. Prioritas kelompok kategori
    const rankA = getCategoryGroupRank(a.category);
    const rankB = getCategoryGroupRank(b.category);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // 2. Nomor ID Pegawai (Natural alphanumeric comparison, misal 001 < 002, PEG-1 < PEG-2 < PEG-10)
    const idA = getEmployeeIdSortValue(a);
    const idB = getEmployeeIdSortValue(b);

    const compId = idA.localeCompare(idB, 'id-ID', { numeric: true, sensitivity: 'base' });
    if (compId !== 0) {
      return compId;
    }

    // 3. Fallback ke nama jika nomor ID persis sama
    return a.name.localeCompare(b.name, 'id-ID');
  });
};

/**
 * Creates direct link hash for a personalia member
 */
export const getPersonaliaDirectHash = (memberId: string): string => {
  return `#personalia?id=${encodeURIComponent(memberId)}`;
};

/**
 * Parses target personalia member ID / NIP from current window URL hash or search params
 */
export const parsePersonaliaTargetFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash || '';
  if (hash.includes('personalia')) {
    // Check query params inside hash: #personalia?id=... or #personalia?nip=... or #personalia?member=...
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      const searchParams = new URLSearchParams(hash.slice(qIndex + 1));
      const target =
        searchParams.get('id') ||
        searchParams.get('member') ||
        searchParams.get('nip') ||
        searchParams.get('pegawai');
      if (target) return decodeURIComponent(target).trim();
    }

    // Check path inside hash: #personalia/person-123
    const slashParts = hash.split('/');
    if (slashParts.length > 1 && slashParts[1]) {
      const cleanSlash = slashParts[1].split('?')[0];
      if (cleanSlash) return decodeURIComponent(cleanSlash).trim();
    }
  }

  // Check window.location.search (?personalia=... or ?personId=...)
  const queryParams = new URLSearchParams(window.location.search);
  const searchTarget =
    queryParams.get('personalia') ||
    queryParams.get('personId') ||
    queryParams.get('member') ||
    queryParams.get('nip');
  if (searchTarget) return decodeURIComponent(searchTarget).trim();

  return null;
};
