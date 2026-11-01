import AdminLayout from '../../layouts/AdminLayout';
import { adminKelasStats } from '../../data/dummy';
import { createKelas, deleteKelas, getAllKelas } from '../../services/kelasService';
import AddKelasCard from '../../components/admin/AddKelasCard';
import { 
  Plus, Users, School, BookOpen, AlertTriangle,
  Filter, FileUp, FileDown, Edit, Trash2, Info, LoaderCircle
} from 'lucide-react';

export default function DaftarKelas() {
  const [kelasList, setKelasList] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: LIMIT_KELAS, total: 0, total_pages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addKelasOpen, setAddKelasOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [deletingKelasId, setDeletingKelasId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadKelas() {
      setLoading(true);
      setError('');

      try {
        const result = await getAllKelas({ page, limit: LIMIT_KELAS });
        if (!Array.isArray(result?.data) || !result.meta) {
          throw new Error('Format data kelas dari server tidak valid.');
        }

        if (active) {
          setKelasList(result.data);
          setMeta(result.meta);
        }
      } catch (requestError) {
        if (active) {
          setKelasList([]);
          setError(requestError.response?.data?.message || requestError.message || 'Gagal memuat data kelas.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadKelas();
    return () => {
      active = false;
    };
  }, [page, refreshVersion]);

  const getRequestError = (requestError, fallback) =>
    requestError.response?.data?.message || requestError.message || fallback;

  const handleCreateKelas = async (kelas) => {
    setSubmitting(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      await createKelas(kelas);
      setAddKelasOpen(false);
      setCreateSuccess('Kelas berhasil ditambahkan.');
      setPage(1);
      setRefreshVersion((version) => version + 1);
    } catch (requestError) {
      setCreateError(getRequestError(requestError, 'Gagal menambahkan kelas.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteKelas = async (kelas) => {
    if (!window.confirm(`Hapus kelas "${kelas.nama_kelas}"?`)) return;

    setDeletingKelasId(kelas.id);
    setDeleteError('');
    setCreateSuccess('');

    try {
      await deleteKelas(kelas.id);
      if (kelasList.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        setRefreshVersion((version) => version + 1);
      }
    } catch (requestError) {
      setDeleteError(getRequestError(requestError, 'Gagal menghapus kelas.'));
    } finally {
      setDeletingKelasId(null);
    }
  };

  return (
    <AdminLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Kelas</h1>
          <p className="text-gray-500 mt-1">Kelola data kelas yang berjalan di Pilar Cendekia.</p>
        </div>
        
        <button
          onClick={() => { setCreateError(''); setCreateSuccess(''); setAddKelasOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-900 transition text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Kelas
        </button>
      </div>

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Siswa */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Siswa</p>
            <h3 className="text-2xl font-bold text-gray-900">{adminKelasStats.totalSiswa}</h3>
          </div>
        </div>

        {/* Total Kelas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Kelas</p>
            <h3 className="text-2xl font-bold text-gray-900">{adminKelasStats.totalKelas}</h3>
          </div>
        </div>

        {/* Rata-rata Kelas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rata-rata Kelas</p>
            <h3 className="text-2xl font-bold text-gray-900">{adminKelasStats.rataRata}</h3>
          </div>
        </div>

        {/* Kelas Penuh */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas Penuh</p>
            <h3 className="text-2xl font-bold text-red-600">{adminKelasStats.kelasPenuh}</h3>
          </div>
        </div>
      </div>

      {/* Tabel Daftar Kelas */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {createSuccess && <p role="status" className="border-b border-green-100 bg-green-50 p-4 text-sm text-green-700">{createSuccess}</p>}
        {deleteError && <p role="alert" className="border-b border-red-100 bg-red-50 p-4 text-sm text-red-700">{deleteError}</p>}
        
        {/* Toolbar Tabel */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              <Filter className="w-4 h-4" /> Filter & Urutkan
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              <FileUp className="w-4 h-4" /> Import Siswa
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              <FileDown className="w-4 h-4" /> Ekspor Data
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-gray-200">Nama Kelas</th>
                <th className="p-4 font-semibold border-b border-gray-200 text-center">Jenjang</th>
                <th className="p-4 font-semibold border-b border-gray-200">Jumlah Siswa</th>
                <th className="p-4 font-semibold border-b border-gray-200">Wali Kelas</th>
                <th className="p-4 font-semibold border-b border-gray-200 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyKelas.map((kelas) => {
                const isFull = kelas.jumlahSiswa >= kelas.kapasitas;
                const percentage = (kelas.jumlahSiswa / kelas.kapasitas) * 100;
                
                return (
                  <tr key={kelas.id} className="hover:bg-gray-50 transition group">
                    <td className="p-4 text-sm font-bold text-gray-800">{kelas.nama}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {kelas.jenjang}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700 min-w-[40px]">
                          {kelas.jumlahSiswa} <span className="text-gray-400 font-normal">/ {kelas.kapasitas}</span>
                        </span>
                        {/* Progress Bar */}
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-blue-600'}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{kelas.waliKelas}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteKelas(kelas)}
                          disabled={deletingKelasId === kelas.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition disabled:cursor-wait disabled:opacity-50"
                          title="Hapus kelas"
                          aria-label={`Hapus kelas ${kelas.nama_kelas}`}
                        >
                          {deletingKelasId === kelas.id
                            ? <LoaderCircle className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Menampilkan 1 - 4 dari 12 kelas</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded font-semibold">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Info Banner Bawah */}
      <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>Catatan Admin:</strong> Perubahan data kelas akan langsung berpengaruh pada dashboard pengajar dan siswa secara real-time. Periksa kapasitas kelas untuk menghindari penumpukan siswa.
        </p>
      </div>

      {addKelasOpen && (
        <AddKelasCard
          onClose={() => setAddKelasOpen(false)}
          onSubmit={handleCreateKelas}
          submitting={submitting}
          error={createError}
        />
      )}

    </AdminLayout>
  );
}