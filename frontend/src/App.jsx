import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardSiswa from './pages/siswa/DashboardSiswa';
import LaporanProgres from './pages/siswa/LaporanProgres';
import TagihanSpp from './pages/siswa/TagihanSpp';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DaftarPengguna from './pages/admin/DaftarPengguna';
import DaftarKelas from './pages/admin/DaftarKelas';
import ManajemenSpp from './pages/admin/ManajemenSpp';
import NilaiReport from './pages/admin/NilaiReport';
import DashboardTentor from './pages/tentor/DashboardTentor';


// siswa
const DashboardSiswa = lazy(()=> import('./pages/siswa/DashboardSiswa'))
const NilaiSiswa = lazy(() => import('./pages/siswa/LaporanProgres'))
const TagihanSpp = lazy(() => import('./pages/siswa/TagihanSpp'))

// tentor
const DashboardTentor = lazy(()=> import('./pages/tentor/DashboardTentor'))
const DetailKelasTentor = lazy(() => import('./pages/tentor/DetailKelasTentor'))

// admin
const DashboardAdmin = lazy(() => import('./pages/admin/DashboardAdmin'))
const DaftarPengguna = lazy(() => import('./pages/admin/DaftarPengguna'))
const DaftarKelas = lazy(() => import('./pages/admin/DaftarKelas'))
const LaporanBelajar = lazy(() => import('./pages/admin/NilaiReport'))
const ManajemenSpp = lazy(() => import('./pages/admin/ManajemenSpp'))

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
      <p>Memuat halaman...</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rute Siswa */}
        <Route path="/siswa" element={<DashboardSiswa />} />
        <Route path="/siswa/nilai" element={<LaporanProgres />} />
        <Route path="/siswa/spp" element={<TagihanSpp />} />

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<DashboardAdmin/>} />
              <Route path="/admin/pengguna" element={<DaftarPengguna />} />
              <Route path="/admin/kelas" element={<DaftarKelas />} />
              <Route path="/admin/laporan" element={<LaporanBelajar />} />
              <Route path="/admin/spp" element={<ManajemenSpp />} />
            </Route>
            
            <Route element={<ProtectedRoute roles={['tentor']} />}>
              <Route path="/tentor" element={<DashboardTentor />} />
              <Route path="/tentor/kelas/:kelasId" element={<DetailKelasTentor />} />
            </Route>

            <Route element={<ProtectedRoute roles={['siswa']} />}>
              <Route path="/siswa" element={<DashboardSiswa/>} />
              <Route path="/siswa/nilai" element={<NilaiSiswa/>} />
              <Route path="/siswa/spp" element={<TagihanSpp/>} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>

        {/* Rute Tentor */}
        <Route path="/tentor" element={<DashboardTentor />} />
      </Routes>
    </BrowserRouter>
  );
}
