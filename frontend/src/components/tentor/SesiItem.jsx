import { useEffect, useRef, useState } from 'react';
import {
  Calendar, Clock, ChevronDown, ClipboardList, Pencil, Paperclip, Trash2, Upload, Users,
} from 'lucide-react';
import {
  formatTanggal, getStatusSesi, hitungDurasi,
} from '../../utils/sesiTentor';

const AKSI = [
  { key: 'nilai', label: 'Input Nilai', icon: ClipboardList },
  { key: 'materi', label: 'Upload Materi', icon: Upload },
  { key: 'edit', label: 'Edit Sesi', icon: Pencil },
  { key: 'hapus', label: 'Hapus Sesi', icon: Trash2, danger: true },
];

export default function SesiItem({
  sesi,
  jumlahSiswa,
  jumlahNilaiTerisi,
  jumlahMateri,
  onAksi,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const status = getStatusSesi(sesi.tanggal);
  const tanggal = new Date(`${sesi.tanggal}T00:00:00`);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKlikLuar = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleKlikLuar);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleKlikLuar);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-blue-50 py-2 text-blue-700">
        <span className="text-2xl font-bold leading-none">{tanggal.getDate()}</span>
        <span className="mt-1 text-xs font-semibold uppercase">
          {tanggal.toLocaleDateString('id-ID', { month: 'short' })}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
          {status.label}
        </span>
        <h3 className="mt-1.5 truncate text-base font-bold text-gray-900">{sesi.materi}</h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {formatTanggal(sesi.tanggal)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {sesi.jam_mulai} - {sesi.jam_selesai} · {hitungDurasi(sesi.jam_mulai, sesi.jam_selesai)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
          <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
            <Users className="h-3.5 w-3.5" /> {jumlahSiswa} siswa
          </span>
          <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
            <ClipboardList className="h-3.5 w-3.5" /> Nilai {jumlahNilaiTerisi}/{jumlahSiswa}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
            <Paperclip className="h-3.5 w-3.5" /> {jumlahMateri} materi
          </span>
        </div>
      </div>

      <div className="relative self-start sm:self-center" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Aksi
          <ChevronDown className={`h-4 w-4 transition ${menuOpen ? 'rotate-180' : ''}`} />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          >
            {AKSI.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onAksi(item.key);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition hover:bg-gray-50 ${
                    item.danger ? 'mt-1 border-t border-gray-100 text-red-600' : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}