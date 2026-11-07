import { useState } from 'react';
import { Save } from 'lucide-react';
import ModalShell from './ModalShell';
import { getTodayIso } from '../../utils/sesiTentor';

const kelasInput = (adaError) =>
  `w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
    adaError ? 'border-red-400' : 'border-gray-200'
  }`;

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export default function FormSesiModal({
  sesi,
  mapelOptions,
  defaultMapel,
  onSimpan,
  onClose,
}) {
  const isEdit = Boolean(sesi);
  const [form, setForm] = useState(() =>
    sesi
      ? {
          mata_pelajaran: sesi.mata_pelajaran,
          materi: sesi.materi,
          tanggal: sesi.tanggal,
          jam_mulai: sesi.jam_mulai,
          jam_selesai: sesi.jam_selesai,
          link_materi: sesi.link_materi ?? '',
        }
      : {
          mata_pelajaran: defaultMapel ?? '',
          materi: '',
          tanggal: getTodayIso(),
          jam_mulai: '',
          jam_selesai: '',
          link_materi: '',
        },
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.mata_pelajaran.trim()) err.mata_pelajaran = 'Mata pelajaran wajib diisi.';
    if (!form.materi.trim()) err.materi = 'Topik wajib diisi.';
    if (!form.tanggal) err.tanggal = 'Tanggal wajib diisi.';
    if (!form.jam_mulai) err.jam_mulai = 'Jam mulai wajib diisi.';
    if (!form.jam_selesai) err.jam_selesai = 'Jam selesai wajib diisi.';
    if (form.jam_mulai && form.jam_selesai && form.jam_selesai <= form.jam_mulai) {
      err.jam_selesai = 'Jam selesai harus setelah jam mulai.';
    }
    if (form.link_materi.trim() && !/^https?:\/\//i.test(form.link_materi.trim())) {
      err.link_materi = 'Tautan harus diawali http:// atau https://';
    }
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    onSimpan({
      ...(sesi ?? {}),
      mata_pelajaran: form.mata_pelajaran.trim(),
      materi: form.materi.trim(),
      tanggal: form.tanggal,
      jam_mulai: form.jam_mulai,
      jam_selesai: form.jam_selesai,
      link_materi: form.link_materi.trim() || null,
    });
  };

  return (
    <ModalShell
      title={isEdit ? 'Edit Sesi Pembelajaran' : 'Tambah Sesi Pembelajaran Baru'}
      subtitle="Isi jadwal dan topik sesi kelas."
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            type="submit"
            form="form-sesi"
            className="flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            <Save className="h-4 w-4" /> Simpan Sesi
          </button>
        </>
      }
    >
      <form id="form-sesi" onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="mata_pelajaran" className="mb-1 block text-sm font-medium text-gray-700">
              Mata Pelajaran
            </label>
            <input
              id="mata_pelajaran"
              name="mata_pelajaran"
              list="daftar-mapel"
              value={form.mata_pelajaran}
              onChange={handleChange}
              placeholder="Contoh: Matematika"
              className={kelasInput(errors.mata_pelajaran)}
            />
            <datalist id="daftar-mapel">
              {mapelOptions.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <FieldError message={errors.mata_pelajaran} />
          </div>
          <div>
            <label htmlFor="tanggal" className="mb-1 block text-sm font-medium text-gray-700">
              Tanggal
            </label>
            <input
              id="tanggal"
              name="tanggal"
              type="date"
              value={form.tanggal}
              onChange={handleChange}
              className={kelasInput(errors.tanggal)}
            />
            <FieldError message={errors.tanggal} />
          </div>
        </div>

        <div>
          <label htmlFor="materi" className="mb-1 block text-sm font-medium text-gray-700">
            Topik Pembahasan
          </label>
          <input
            id="materi"
            name="materi"
            value={form.materi}
            onChange={handleChange}
            placeholder="Masukkan topik sesi"
            className={kelasInput(errors.materi)}
          />
          <FieldError message={errors.materi} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="jam_mulai" className="mb-1 block text-sm font-medium text-gray-700">
              Jam Mulai
            </label>
            <input
              id="jam_mulai"
              name="jam_mulai"
              type="time"
              value={form.jam_mulai}
              onChange={handleChange}
              className={kelasInput(errors.jam_mulai)}
            />
            <FieldError message={errors.jam_mulai} />
          </div>
          <div>
            <label htmlFor="jam_selesai" className="mb-1 block text-sm font-medium text-gray-700">
              Jam Selesai
            </label>
            <input
              id="jam_selesai"
              name="jam_selesai"
              type="time"
              value={form.jam_selesai}
              onChange={handleChange}
              className={kelasInput(errors.jam_selesai)}
            />
            <FieldError message={errors.jam_selesai} />
          </div>
        </div>

        <div>
          <label htmlFor="link_materi" className="mb-1 block text-sm font-medium text-gray-700">
            Tautan Materi <span className="font-normal text-gray-400">(opsional)</span>
          </label>
          <input
            id="link_materi"
            name="link_materi"
            value={form.link_materi}
            onChange={handleChange}
            placeholder="https://..."
            className={kelasInput(errors.link_materi)}
          />
          <FieldError message={errors.link_materi} />
        </div>
      </form>
    </ModalShell>
  );
}