import { PersonaliaCategory, PersonaliaMember } from '../types';

export interface ParsedPersonaliaRow {
  name: string;
  role: string;
  category: PersonaliaCategory;
  education: string;
  specialization: string;
  nuptkOrNip?: string;
  bio: string;
  photo?: string;
  phone?: string;
  email?: string;
  order?: number;
  // Validation status
  isValid: boolean;
  errors: string[];
  rawRowIndex: number;
}

export const DEFAULT_AVATARS: Record<PersonaliaCategory, string> = {
  pendiri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  yayasan: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  pendidik: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  tendik: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
};

/**
 * Detects CSV delimiter: comma, semicolon, or tab.
 */
export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r\n|\n|\r/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount > tabCount) return ';';
  if (tabCount > commaCount && tabCount > semicolonCount) return '\t';
  return ',';
}

/**
 * Splits a CSV line into cells, taking quoted values into account.
 */
export function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Normalize and map category string to valid PersonaliaCategory
 */
export function mapToPersonaliaCategory(rawCategory: string): PersonaliaCategory {
  const cleaned = (rawCategory || '').toLowerCase().trim();

  if (cleaned.includes('pendiri') || cleaned.includes('pembina') || cleaned.includes('founder')) {
    return 'pendiri';
  }
  if (cleaned.includes('yayasan') || cleaned.includes('pengurus')) {
    return 'yayasan';
  }
  if (cleaned.includes('tendik') || cleaned.includes('tata usaha') || cleaned.includes('staff') || cleaned.includes('staf') || cleaned.includes('operator') || cleaned.includes('admin')) {
    return 'tendik';
  }
  if (cleaned.includes('pendidik') || cleaned.includes('guru') || cleaned.includes('tutor') || cleaned.includes('instruktur') || cleaned.includes('pengajar')) {
    return 'pendidik';
  }

  // Exact fallback
  if (cleaned === 'pendiri') return 'pendiri';
  if (cleaned === 'yayasan') return 'yayasan';
  if (cleaned === 'tendik') return 'tendik';
  return 'pendidik';
}

/**
 * Parse CSV text into validated Personalia rows
 */
export function parsePersonaliaCSV(csvText: string): {
  rows: ParsedPersonaliaRow[];
  totalLines: number;
  validCount: number;
  invalidCount: number;
  delimiterUsed: string;
} {
  const delimiter = detectDelimiter(csvText);
  const rawLines = csvText.split(/\r\n|\n|\r/).filter((line) => line.trim().length > 0);

  if (rawLines.length === 0) {
    return { rows: [], totalLines: 0, validCount: 0, invalidCount: 0, delimiterUsed: delimiter };
  }

  // Header parsing
  const headerCells = parseCSVLine(rawLines[0], delimiter).map((h) => h.toLowerCase().replace(/[\s_/-]+/g, ''));

  // Column index mapper
  const getColIndex = (aliases: string[]) => {
    return headerCells.findIndex((h) => aliases.some((alias) => h === alias || h.includes(alias)));
  };

  const nameIdx = getColIndex(['nama', 'namalengkap', 'name', 'fullname']);
  const roleIdx = getColIndex(['jabatan', 'role', 'posisi', 'tugas', 'peran']);
  const categoryIdx = getColIndex(['kategori', 'category', 'divisi', 'jenis']);
  const educationIdx = getColIndex(['pendidikan', 'education', 'lulusan', 'pendidikanterakhir']);
  const specIdx = getColIndex(['bidang', 'keahlian', 'matapelajaran', 'mapel', 'spesialisasi', 'specialization']);
  const nuptkIdx = getColIndex(['nuptk', 'nip', 'nuptknip', 'nopegawai']);
  const bioIdx = getColIndex(['bio', 'biografi', 'keterangan', 'deskripsi', 'profil']);
  const phoneIdx = getColIndex(['telepon', 'phone', 'hp', 'nohp', 'whatsapp', 'wa', 'kontak']);
  const emailIdx = getColIndex(['email', 'surel']);
  const photoIdx = getColIndex(['foto', 'photo', 'urlfoto', 'gambar', 'image']);
  const orderIdx = getColIndex(['urutan', 'order', 'no']);

  const parsedRows: ParsedPersonaliaRow[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i];
    const cells = parseCSVLine(line, delimiter);

    // If whole line is empty, skip
    if (cells.every((c) => c === '')) continue;

    const name = nameIdx !== -1 && cells[nameIdx] ? cells[nameIdx] : (cells[0] || '');
    const role = roleIdx !== -1 && cells[roleIdx] ? cells[roleIdx] : (cells[1] || '');
    const rawCategory = categoryIdx !== -1 && cells[categoryIdx] ? cells[categoryIdx] : (cells[2] || 'pendidik');
    const category = mapToPersonaliaCategory(rawCategory);

    const education = educationIdx !== -1 && cells[educationIdx] ? cells[educationIdx] : '';
    const specialization = specIdx !== -1 && cells[specIdx] ? cells[specIdx] : '';
    const nuptkOrNip = nuptkIdx !== -1 && cells[nuptkIdx] ? cells[nuptkIdx] : '';
    const bio = bioIdx !== -1 && cells[bioIdx] ? cells[bioIdx] : '';
    const phone = phoneIdx !== -1 && cells[phoneIdx] ? cells[phoneIdx] : '';
    const email = emailIdx !== -1 && cells[emailIdx] ? cells[emailIdx] : '';
    const photo = (photoIdx !== -1 && cells[photoIdx]) ? cells[photoIdx] : DEFAULT_AVATARS[category];
    const order = (orderIdx !== -1 && cells[orderIdx]) ? parseInt(cells[orderIdx], 10) || (i) : i;

    const errors: string[] = [];
    if (!name.trim()) errors.push('Nama lengkap belum diisi');
    if (!role.trim()) errors.push('Jabatan belum diisi');

    parsedRows.push({
      name: name.trim(),
      role: role.trim(),
      category,
      education: education.trim(),
      specialization: specialization.trim(),
      nuptkOrNip: nuptkOrNip.trim() || undefined,
      bio: bio.trim(),
      photo: photo.trim() || DEFAULT_AVATARS[category],
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      order,
      isValid: errors.length === 0,
      errors,
      rawRowIndex: i + 1
    });
  }

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return {
    rows: parsedRows,
    totalLines: parsedRows.length,
    validCount,
    invalidCount,
    delimiterUsed: delimiter
  };
}

/**
 * Generates sample CSV template content with standard headers and sample Indonesian rows.
 */
export function generatePersonaliaTemplateCSV(): string {
  const headers = [
    'nama',
    'jabatan',
    'kategori',
    'pendidikan',
    'bidang_keahlian',
    'nuptk_nip',
    'bio',
    'telepon',
    'email',
    'foto'
  ];

  const sampleRows = [
    [
      'Drs. H. Ahmad Sudirman, M.Pd.',
      'Ketua Dewan Pembina',
      'pendiri',
      'S2 Manajemen Pendidikan UNNES',
      'Kepemimpinan & Kebijakan Pendidikan',
      '196504121990031002',
      'Pendiri dan perintis pendidikan kesetaraan PKBM Bina Insani sejak tahun 2012.',
      '081234567890',
      'pembina@pkbmsumowono.sch.id',
      ''
    ],
    [
      'Hj. Siti Rahmawati, S.Sos.',
      'Ketua Yayasan Bina Insani',
      'yayasan',
      'S1 Ilmu Komunikasi UNDIP',
      'Manajemen Kelembagaan & Kemitraan',
      '',
      'Memimpin operasional dan kemitraan strategis lembaga dengan instansi pemerintah.',
      '081398765432',
      'yayasan@pkbmsumowono.sch.id',
      ''
    ],
    [
      'Budi Santoso, S.Pd.',
      'Tutor Pengajar Matematika',
      'pendidik',
      'S1 Pendidikan Matematika UNNES',
      'Matematika & Numerasi Paket B & C',
      '8452763665200002',
      'Tutor berdedikasi dengan pendekatan pembelajaran kontekstual menyenangkan.',
      '085612345678',
      'budi.santoso@pkbmsumowono.sch.id',
      ''
    ],
    [
      'Nurul Aini, S.Kom.',
      'Tenaga Kependidikan & Operator Dapodik',
      'tendik',
      'S1 Sistem Informasi UDINUS',
      'Administrasi Digital, Dapodik & Arsip',
      '',
      'Mengelola sistem data pokok pendidikan (Dapodikmas) dan administrasi warga belajar.',
      '087812345678',
      'operator@pkbmsumowono.sch.id',
      ''
    ]
  ];

  const csvLines = [
    headers.join(','),
    ...sampleRows.map((row) =>
      row
        .map((cell) => {
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(',')
    )
  ];

  return csvLines.join('\n');
}

/**
 * Triggers client-side download of CSV template file
 */
export function downloadCSVTemplate(filename = 'template_import_personalia_pkbm.csv') {
  const content = generatePersonaliaTemplateCSV();
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
