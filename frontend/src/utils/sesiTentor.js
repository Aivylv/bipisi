const pad = (n) => String(n).padStart(2, '0');

export const EKSTENSI_MATERI = ['pdf', 'docx', 'pptx', 'jpg', 'jpeg', 'png'];
export const ACCEPT_MATERI = EKSTENSI_MATERI.map((e) => `.${e}`).join(',');
export const MAX_UKURAN_MATERI = 10 * 1024 * 1024; // 10 MB

export function getTodayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatTanggal(tanggal) {
  return new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function hitungDurasi(mulai, selesai) {
  const [jamA, menitA] = mulai.split(':').map(Number);
  const [jamB, menitB] = selesai.split(':').map(Number);
  const total = jamB * 60 + menitB - (jamA * 60 + menitA);
  if (total <= 0) return '-';
  const jam = Math.floor(total / 60);
  const menit = total % 60;
  return [jam && `${jam} jam`, menit && `${menit} menit`].filter(Boolean).join(' ');
}

export function getStatusSesi(tanggal) {
  const today = getTodayIso();
  if (tanggal < today) return { label: 'Selesai', className: 'bg-gray-100 text-gray-600' };
  if (tanggal === today) return { label: 'Hari ini', className: 'bg-red-100 text-red-600' };
  return { label: 'Mendatang', className: 'bg-blue-100 text-blue-600' };
}

export function formatUkuran(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Mengembalikan pesan error, atau null jika berkas valid
export function validasiBerkasMateri(file) {
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
  if (!EKSTENSI_MATERI.includes(ext)) return 'Format tidak didukung (PDF, DOCX, PPTX, JPG, PNG).';
  if (file.size > MAX_UKURAN_MATERI) return 'Ukuran melebihi 10 MB.';
  return null;
}