import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SesiItem from '../../components/tentor/SesiItem';
import FormSesiModal from '../../components/tentor/FormSesiModal';
import InputNilaiModal from '../../components/tentor/InputNilaiModal';
import UploadMateriModal from '../../components/tentor/UploadMateriModal';
import ConfirmModal from '../../components/tentor/ConfirmModal';
import {
  dummyKelasTentor,
  dummySiswaPerKelas,
  dummySesiPembelajaran,
  dummyPenilaian,
  dummyMateri,
} from '../../data/dummyJadwalTentor';
import { ArrowLeft, Plus } from 'lucide-react';

export default function DetailKelasTentor() {
  const { kelasId } = useParams();

  // TODO (backend): ganti dengan data kelas dari API setelah endpoint tersedia.
  // Sementara: id dari route dicocokkan ke dummy; jika tidak cocok, pakai kelas pertama.
  const kelas = dummyKelasTentor.find((k) => k.id === kelasId) ?? dummyKelasTentor[0];
  const siswaKelas = dummySiswaPerKelas[kelas.id] ?? [];

  const [semuaSesi, setSemuaSesi] = useState(dummySesiPembelajaran);
  const [penilaian, setPenilaian] = useState(dummyPenilaian);
  const [materi, setMateri] = useState(dummyMateri);
  const [activeMapel, setActiveMapel] = useState(null);
  // modal: null | { tipe: 'form' | 'nilai' | 'materi' | 'hapus', sesi }
  const [modal, setModal] = useState(null);

  const sesiKelas = useMemo(
    () => semuaSesi.filter((s) => s.kelas_id === kelas.id),
    [semuaSesi, kelas.id],
  );

  const mapelList = useMemo(
    () => [...new Set(sesiKelas.map((s) => s.mata_pelajaran))].sort(),
    [sesiKelas],
  );

  const mapelAktif = mapelList.includes(activeMapel) ? activeMapel : mapelList[0] ?? null;

  const sesiTab = useMemo(
    () =>
      sesiKelas
        .filter((s) => s.mata_pelajaran === mapelAktif)
        .sort((a, b) =>
          a.tanggal === b.tanggal
            ? a.jam_mulai.localeCompare(b.jam_mulai)
            : a.tanggal.localeCompare(b.tanggal),
        ),
    [sesiKelas, mapelAktif],
  );

  const jumlahPerMapel = (mapel) => sesiKelas.filter((s) => s.mata_pelajaran === mapel).length;

  // ---------- Aksi (sementara lokal; nanti diganti pemanggilan API) ----------
  const simpanSesi = (data) => {
    if (data.id) {
      setSemuaSesi((prev) => prev.map((s) => (s.id === data.id ? { ...s, ...data } : s)));
    } else {
      const baru = {
        ...data,
        id: `ses-${Date.now()}`,
        kelas_id: kelas.id,
        tentor_id: 'tnt-1',
      };
      setSemuaSesi((prev) => [...prev, baru]);
      setActiveMapel(baru.mata_pelajaran);
    }
    setModal(null);
  };

  const hapusSesi = (sesiId) => {
    setSemuaSesi((prev) => prev.filter((s) => s.id !== sesiId));
    setModal(null);
  };

  const simpanNilai = (sesiId, hasil) => {
    setPenilaian((prev) => ({ ...prev, [sesiId]: hasil }));
    setModal(null);
  };

  const tambahMateri = (sesiId, files) => {
    setMateri((prev) => ({ ...prev, [sesiId]: [...(prev[sesiId] ?? []), ...files] }));
  };

  const hapusMateri = (sesiId, fileId) => {
    setMateri((prev) => ({
      ...prev,
      [sesiId]: (prev[sesiId] ?? []).filter((f) => f.id !== fileId),
    }));
  };

  const handleAksi = (sesi, aksi) => {
    if (aksi === 'nilai') setModal({ tipe: 'nilai', sesi });
    if (aksi === 'materi') setModal({ tipe: 'materi', sesi });
    if (aksi === 'edit') setModal({ tipe: 'form', sesi });
    if (aksi === 'hapus') setModal({ tipe: 'hapus', sesi });
  };

  const tutupModal = () => setModal(null);

  return (
    <DashboardLayout>
      <Link
        to="/tentor"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Kelas
      </Link>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{kelas.nama_kelas}</h1>
          <p className="mt-1 text-gray-500">{kelas.jenjang} · Kelola jadwal dan materi sesi kelas ini.</p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ tipe: 'form', sesi: null })}
          className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
        >
          <Plus className="h-4 w-4" /> Tambah Sesi Baru
        </button>
      </div>

      {mapelList.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Belum ada sesi di kelas ini. Tambahkan sesi pertama untuk memulai.
        </div>
      ) : (
        <>
          {/* Tab mata pelajaran */}
          <div className="mb-6 border-b border-gray-200">
            <div role="tablist" className="-mb-px flex gap-6 overflow-x-auto">
              {mapelList.map((mapel) => {
                const aktif = mapel === mapelAktif;
                return (
                  <button
                    key={mapel}
                    type="button"
                    role="tab"
                    aria-selected={aktif}
                    onClick={() => setActiveMapel(mapel)}
                    className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                      aktif
                        ? 'border-[#1E3A8A] text-[#1E3A8A]'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {mapel}
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {jumlahPerMapel(mapel)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <h2 className="mb-4 text-lg font-bold text-gray-800">Daftar Sesi {mapelAktif}</h2>

          {sesiTab.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              Belum ada sesi untuk mata pelajaran ini.
            </div>
          ) : (
            <div className="space-y-4">
              {sesiTab.map((sesi) => (
                <SesiItem
                  key={sesi.id}
                  sesi={sesi}
                  jumlahSiswa={siswaKelas.length}
                  jumlahNilaiTerisi={Object.keys(penilaian[sesi.id] ?? {}).length}
                  jumlahMateri={(materi[sesi.id] ?? []).length}
                  onAksi={(aksi) => handleAksi(sesi, aksi)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= MODAL ================= */}
      {modal?.tipe === 'form' && (
        <FormSesiModal
          sesi={modal.sesi}
          mapelOptions={mapelList}
          defaultMapel={mapelAktif}
          onSimpan={simpanSesi}
          onClose={tutupModal}
        />
      )}

      {modal?.tipe === 'nilai' && (
        <InputNilaiModal
          sesi={modal.sesi}
          siswaList={siswaKelas}
          penilaianSesi={penilaian[modal.sesi.id]}
          onSimpan={(hasil) => simpanNilai(modal.sesi.id, hasil)}
          onClose={tutupModal}
        />
      )}

      {modal?.tipe === 'materi' && (
        <UploadMateriModal
          sesi={modal.sesi}
          files={materi[modal.sesi.id] ?? []}
          onTambah={(files) => tambahMateri(modal.sesi.id, files)}
          onHapus={(fileId) => hapusMateri(modal.sesi.id, fileId)}
          onClose={tutupModal}
        />
      )}

      {modal?.tipe === 'hapus' && (
        <ConfirmModal
          title="Hapus sesi ini?"
          message={`Sesi "${modal.sesi.materi}" akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
          confirmLabel="Hapus"
          onConfirm={() => hapusSesi(modal.sesi.id)}
          onCancel={tutupModal}
        />
      )}
    </DashboardLayout>
  );
}