import { useRef, useState } from 'react';
import { FileText, Trash2, Upload } from 'lucide-react';
import ModalShell from './ModalShell';
import {
  ACCEPT_MATERI,
  formatUkuran,
  validasiBerkasMateri,
} from '../../utils/sesiTentor';

export default function UploadMateriModal({
  sesi,
  files,
  onTambah,
  onHapus,
  onClose,
}) {
  const inputRef = useRef(null);
  const [dragAktif, setDragAktif] = useState(false);
  const [error, setError] = useState('');

  const prosesBerkas = (fileList) => {
    const valid = [];
    const gagal = [];

    Array.from(fileList).forEach((file) => {
      const pesan = validasiBerkasMateri(file);
      if (pesan) {
        gagal.push(`${file.name}: ${pesan}`);
      } else {
        valid.push({
          id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          nama_file: file.name,
          ukuran: file.size,
        });
      }
    });

    if (valid.length > 0) onTambah(valid);
    setError(gagal.join(' '));
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <ModalShell
      title="Upload Materi Sesi"
      subtitle={`${sesi.mata_pelajaran} · ${sesi.materi}`}
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          Selesai
        </button>
      }
    >
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragAktif(true);
          }}
          onDragLeave={() => setDragAktif(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragAktif(false);
            prosesBerkas(e.dataTransfer.files);
          }}
          className={`flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition ${
            dragAktif ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Upload className="h-6 w-6 text-blue-600" />
          <p className="text-sm font-semibold text-gray-700">Pilih berkas atau seret ke sini</p>
          <p className="text-xs text-gray-500">PDF, DOCX, PPTX, JPG, PNG · maks. 10 MB per berkas</p>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_MATERI}
          onChange={(e) => prosesBerkas(e.target.files)}
          className="hidden"
        />

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700">
            Berkas tersimpan ({files.length})
          </h4>

          {files.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-500">
              Belum ada materi untuk sesi ini.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
              {files.map((f) => (
                <li key={f.id} className="flex items-center gap-3 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">{f.nama_file}</p>
                    <p className="text-xs text-gray-500">{formatUkuran(f.ukuran)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onHapus(f.id)}
                    aria-label={`Hapus ${f.nama_file}`}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ModalShell>
  );
}