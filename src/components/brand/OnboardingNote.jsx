import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'demoOnboardingSeen_v1';

const LANGKAH = [
  { to: '/profil', judul: 'Isi Profil Sekolah & Tahun Ajaran', ket: 'Masukkan nama dan logo sekolah — otomatis tampil di halaman login, sidebar, kwitansi, dan tab browser. Lalu buat Tahun Ajaran dan jadikan aktif.' },
  { to: '/kelas', judul: 'Buat Data Kelas & Rombel', ket: 'Tambahkan tingkat kelas dan rombel (mis. 1A, 1B).' },
  { to: '/guru', judul: 'Tambah Data Guru & Staff', ket: 'Opsional, dipakai untuk wali kelas.' },
  { to: '/siswa', judul: 'Input Data Siswa', ket: 'Isi manual satu per satu atau upload sekaligus dari Excel.' },
  { to: '/tagihan', judul: 'Atur Tarif lalu Terbitkan Tagihan', ket: 'Di menu Tagihan & Biaya: isi tab TARIF dulu, lalu terbitkan tagihan SPP di tab PENERBITAN SPP.' },
  { to: '/pembayaran', judul: 'Catat Pembayaran', ket: 'Cari siswa, catat pembayaran, dan cetak kwitansinya.' },
];

function sudahPernahLihat() {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
}

// Panduan langkah awal -- muncul SEKALI saja setelah login pertama di browser ini.
export default function OnboardingNote() {
  const [open, setOpen] = useState(() => !sudahPernahLihat());
  const navigate = useNavigate();

  if (!open) return null;

  function tutup(tujuan) {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* diblokir browser -- abaikan */ }
    setOpen(false);
    if (tujuan) navigate(tujuan);
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) tutup(); }}>
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <h3>👋 Selamat datang!</h3>
          <button type="button" className="btn-icon" onClick={() => tutup()} title="Tutup" style={{ fontSize: 18, lineHeight: 1, marginTop: -2 }}>✕</button>
        </div>
        <p className="modal-sub">Supaya aplikasi siap dipakai, kerjakan langkah-langkah ini secara berurutan. Klik salah satu untuk langsung menuju halamannya.</p>

        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {LANGKAH.map((l, i) => (
            <li key={l.to}>
              <button
                type="button"
                onClick={() => tutup(l.to)}
                style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: '#fff', cursor: 'pointer', font: 'inherit' }}
              >
                <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--green-dark)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>{i + 1}</span>
                <span>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>{l.judul}</span>
                  <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{l.ket}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
          ℹ️ Ini aplikasi demo — data yang Anda isi bisa dilihat pengunjung lain, jadi jangan masukkan data asli.
        </p>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={() => tutup('/profil')}>Mulai dari Profil Sekolah</button>
        </div>
      </div>
    </div>
  );
}
