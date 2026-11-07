// Data dummy modul Jadwal & Materi serta Input Nilai (sisi tentor).
// Nama field sengaja mengikuti tabel database (sesi_pembelajaran, penilaian_siswa)
// agar nanti tinggal diganti dengan respons API.

const pad = (n) => String(n).padStart(2, '0');

// Tanggal relatif terhadap hari ini supaya dummy selalu tampak "selesai" atau "mendatang".
export const tanggalRelatif = (selisihHari) => {
  const d = new Date();
  d.setDate(d.getDate() + selisihHari);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const dummyKelasTentor = [
  { id: 'kls-6a', nama_kelas: 'Kelas 6A', jenjang: 'SD' },
  { id: 'kls-5c', nama_kelas: 'Kelas 5C', jenjang: 'SD' },
];

export const dummySiswaPerKelas = {
  'kls-6a': [
    { id: 'sis-01', nama: 'Asaki Aktam Nijananda' },
    { id: 'sis-02', nama: 'Raka Mahesa' },
    { id: 'sis-03', nama: 'Shafira Maharani' },
    { id: 'sis-04', nama: 'Gibran Ahmad Iqbal' },
  ],
  'kls-5c': [
    { id: 'sis-05', nama: 'Lyvia Ayuning Larasati' },
    { id: 'sis-06', nama: 'Jaidil Rachmad Ladam' },
  ],
};

// Mirip sesi_pembelajaran: materi = topik sesi, link_materi = tautan (opsional)
export const dummySesiPembelajaran = [
  { id: 'ses-1', kelas_id: 'kls-6a', tentor_id: 'tnt-1', mata_pelajaran: 'Matematika', materi: 'Aljabar Linear & Persamaan Dasar', tanggal: tanggalRelatif(-7), jam_mulai: '10:30', jam_selesai: '11:15', link_materi: null },
  { id: 'ses-2', kelas_id: 'kls-6a', tentor_id: 'tnt-1', mata_pelajaran: 'Matematika', materi: 'Pecahan Campuran', tanggal: tanggalRelatif(0), jam_mulai: '10:30', jam_selesai: '11:15', link_materi: null },
  { id: 'ses-3', kelas_id: 'kls-6a', tentor_id: 'tnt-1', mata_pelajaran: 'Matematika', materi: 'Operasi Hitung Desimal', tanggal: tanggalRelatif(7), jam_mulai: '08:00', jam_selesai: '09:00', link_materi: null },
  { id: 'ses-4', kelas_id: 'kls-6a', tentor_id: 'tnt-1', mata_pelajaran: 'IPA', materi: 'Sistem Peredaran Darah', tanggal: tanggalRelatif(-5), jam_mulai: '13:00', jam_selesai: '14:00', link_materi: null },
  { id: 'ses-5', kelas_id: 'kls-6a', tentor_id: 'tnt-1', mata_pelajaran: 'IPA', materi: 'Ekosistem & Bioma', tanggal: tanggalRelatif(2), jam_mulai: '13:00', jam_selesai: '14:00', link_materi: null },
  { id: 'ses-6', kelas_id: 'kls-5c', tentor_id: 'tnt-1', mata_pelajaran: 'Fisika', materi: 'Hukum Newton & Gaya Gravitasi', tanggal: tanggalRelatif(1), jam_mulai: '08:00', jam_selesai: '09:00', link_materi: null },
  { id: 'ses-7', kelas_id: 'kls-5c', tentor_id: 'tnt-1', mata_pelajaran: 'Biologi', materi: 'Struktur Sel Tumbuhan', tanggal: tanggalRelatif(4), jam_mulai: '13:00', jam_selesai: '14:30', link_materi: null },
];

// Penilaian per sesi: { [sesiId]: { [siswaId]: { nilai, keterangan } } }
export const dummyPenilaian = {
  'ses-1': {
    'sis-01': { nilai: 90, keterangan: 'Sangat aktif di kelas' },
    'sis-02': { nilai: 75, keterangan: 'Perlu latihan ulang soal nomor 3' },
  },
};

// Materi per sesi: { [sesiId]: [{ id, nama_file, ukuran }] }
export const dummyMateri = {
  'ses-1': [
    { id: 'mat-1', nama_file: 'Latihan-Aljabar-Linear.pdf', ukuran: 245760 },
  ],
};