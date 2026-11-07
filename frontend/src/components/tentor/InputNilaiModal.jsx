import { useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import ModalShell from './ModalShell';

export default function InputNilaiModal({
  sesi,
  siswaList,
  penilaianSesi,
  onSimpan,
  onClose,
}) {
  const [rows, setRows] = useState(() =>
    siswaList.map((siswa) => ({
      siswa_id: siswa.id,
      nama: siswa.nama,
      nilai: penilaianSesi?.[siswa.id]?.nilai ?? '',
      keterangan: penilaianSesi?.[siswa.id]?.keterangan ?? '',
    })),
  );
  const [error, setError] = useState('');

  const ringkasan = useMemo(() => {
    const terisi = rows.filter((r) => r.nilai !== '').map((r) => Number(r.nilai));
    if (terisi.length === 0) return { rata: '-', tertinggi: '-', terisi: 0 };
    const total = terisi.reduce((a, b) => a + b, 0);
    return {
      rata: (total / terisi.length).toFixed(1),
      tertinggi: Math.max(...terisi),
      terisi: terisi.length,
    };
  }, [rows]);

  const updateRow = (siswaId, field, value) => {
    setRows((prev) => prev.map((r) => (r.siswa_id === siswaId ? { ...r, [field]: value } : r)));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invalid = rows.find((r) => {
      if (r.nilai === '') return false;
      const n = Number(r.nilai);
      return !Number.isFinite(n) || n < 0 || n > 100;
    });
    if (invalid) {
      setError(`Nilai ${invalid.nama} harus berupa angka antara 0 dan 100.`);
      return;
    }
    // Siswa tanpa nilai tidak ikut disimpan
    const hasil = {};
    rows.forEach((r) => {
      if (r.nilai !== '') {
        hasil[r.siswa_id] = {
          nilai: Number(r.nilai),
          keterangan: r.keterangan.trim() || null,
        };
      }
    });
    onSimpan(hasil);
  };

  return (
    <ModalShell
      title="Input Nilai Latihan Soal"
      subtitle={`${sesi.mata_pelajaran} · ${sesi.materi}`}
      onClose={onClose}
      maxWidth="max-w-3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            form="form-nilai"
            className="flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            <Save className="h-4 w-4" /> Simpan Nilai
          </button>
        </>
      }
    >
      <form id="form-nilai" onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-center">
            <p className="text-xs font-medium text-blue-700">Terisi</p>
            <p className="text-lg font-bold text-blue-900">
              {ringkasan.terisi}/{siswaList.length}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Rata-rata</p>
            <p className="text-lg font-bold text-gray-900">{ringkasan.rata}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Tertinggi</p>
            <p className="text-lg font-bold text-gray-900">{ringkasan.tertinggi}</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            Belum ada siswa di kelas ini.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="border-b p-3 font-semibold">Nama Siswa</th>
                  <th className="w-28 border-b p-3 font-semibold">Nilai (0-100)</th>
                  <th className="border-b p-3 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.siswa_id}>
                    <td className="p-3 text-sm font-medium text-gray-800">{r.nama}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={r.nilai}
                        onChange={(e) => updateRow(r.siswa_id, 'nilai', e.target.value)}
                        placeholder="—"
                        className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={r.keterangan}
                        onChange={(e) => updateRow(r.siswa_id, 'keterangan', e.target.value)}
                        placeholder="Catatan singkat..."
                        className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Siswa yang nilainya dikosongkan tidak akan tersimpan pada sesi ini.
        </p>
      </form>
    </ModalShell>
  );
}