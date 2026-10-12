import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ===================================================================
 * TUR APLIKASI ("room tour") — menyorot bagian layar satu per satu.
 * - Muncul otomatis SEKALI setelah login pertama di browser ini.
 * - Bisa dilewati kapan saja (tombol Lewati / Esc).
 * - Bisa diulang lewat tombol "Tur" di header.
 * Target ditandai atribut data-tour="..." di komponen layout. Kalau target
 * tidak tampil (mis. sidebar tersembunyi di HP), langkah tetap muncul di
 * tengah layar tanpa sorotan.
 * =================================================================== */

const STORAGE_KEY = 'demoTourSeen_v1';
export const PDF_PANDUAN = `${import.meta.env.BASE_URL}panduan-spp-sekolah.pdf`;

const LANGKAH_AWAL = [
  { to: '/profil', judul: 'Isi Profil Sekolah & Tahun Ajaran', ket: 'Nama & logo sekolah, lalu buat Tahun Ajaran dan jadikan aktif.' },
  { to: '/kelas', judul: 'Buat Data Kelas & Rombel', ket: 'Tingkat kelas dan rombel (mis. 1A, 1B).' },
  { to: '/guru', judul: 'Tambah Data Guru & Staff', ket: 'Opsional, dipakai untuk wali kelas.' },
  { to: '/siswa', judul: 'Input Data Siswa', ket: 'Manual satu per satu atau upload dari Excel.' },
  { to: '/tagihan', judul: 'Atur Tarif lalu Terbitkan Tagihan', ket: 'Tab TARIF dulu, lalu tab PENERBITAN SPP.' },
  { to: '/pembayaran', judul: 'Catat Pembayaran', ket: 'Cari siswa, catat bayar, cetak kwitansi.' },
];

const STEPS = [
  { judul: '👋 Selamat datang!', isi: 'Ikuti tur singkat ini untuk mengenal bagian-bagian aplikasi. Bisa dilewati kapan saja, dan bisa diulang dari tombol "Tur" di bagian atas.' },
  { target: 'brand', judul: 'Identitas Sekolah', isi: 'Nama dan logo sekolah tampil di sini. Isinya otomatis mengikuti menu Profil Sekolah — begitu juga di halaman login, kwitansi, dan tab browser.' },
  { target: 'nav-dashboard', judul: 'Dashboard', isi: 'Ringkasan cepat: jumlah siswa, pemasukan, pengeluaran, dan tunggakan.' },
  { target: 'nav-spp', judul: '🎓 SPP', isi: 'Dashboard SPP per kelas dan menu Pembayaran — tempat mencatat pembayaran siswa dan mencetak kwitansi.' },
  { target: 'nav-keuangan', judul: '💰 Keuangan', isi: 'Atur tarif, terbitkan tagihan SPP & biaya lain, catat pemasukan/pengeluaran lain, rekap tunggakan, beasiswa, dan laporan keuangan (buku besar, laba rugi, neraca, cashflow).' },
  { target: 'nav-pengaturan', judul: '⚙️ Pengaturan', isi: 'Profil sekolah & tahun ajaran, data kelas, guru, siswa, manajemen user & hak akses, serta log histori.' },
  { target: 'status', judul: 'Status Koneksi D & K', isi: 'D = database Data Induk, K = database Keuangan. Hijau berarti terhubung, merah berarti terputus. Dicek otomatis tiap beberapa detik.' },
  { target: 'tahun', judul: 'Tahun Ajaran Aktif', isi: 'Tagihan dan laporan mengikuti tahun ajaran yang aktif. Atur di Pengaturan › Profil Sekolah & Tahun Ajaran.' },
  { target: 'bantuan', judul: 'Bantuan', isi: 'Klik "Tur" untuk mengulang tur ini, atau "Panduan PDF" untuk mengunduh buku panduan lengkap aplikasi.' },
  { target: 'user', judul: 'Akun Anda', isi: 'Klik nama untuk melihat profil & riwayat aktivitas. Tombol di sebelahnya untuk keluar.' },
  { judul: '🚀 Langkah Awal', langkahAwal: true, isi: 'Supaya aplikasi siap dipakai, kerjakan berurutan. Klik salah satu untuk langsung menuju halamannya.' },
];

const TourContext = createContext({ start: () => {} });
export const useTour = () => useContext(TourContext);

function sudahLihat() { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; } }
function tandaiSudahLihat() { try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* abaikan */ } }

function cariTarget(name) {
  if (!name) return null;
  const els = document.querySelectorAll(`[data-tour="${name}"]`);
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

export function TourProvider({ children }) {
  const [step, setStep] = useState(-1); // -1 = tur tidak aktif
  const start = useCallback(() => setStep(0), []);

  useEffect(() => {
    if (sudahLihat()) return;
    const t = setTimeout(() => setStep(0), 700); // tunggu layout siap
    return () => clearTimeout(t);
  }, []);

  const selesai = useCallback(() => { tandaiSudahLihat(); setStep(-1); }, []);

  return (
    <TourContext.Provider value={{ start }}>
      {children}
      {step >= 0 && <TourOverlay step={step} setStep={setStep} onClose={selesai} />}
    </TourContext.Provider>
  );
}

const PAD = 6;

function TourOverlay({ step, setStep, onClose }) {
  const s = STEPS[step];
  const navigate = useNavigate();
  const [rect, setRect] = useState(null);
  const [vw, setVw] = useState(window.innerWidth);

  useLayoutEffect(() => {
    function ukur() {
      setVw(window.innerWidth);
      const el = cariTarget(s.target);
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
    }
    const el = cariTarget(s.target);
    if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    ukur();
    window.addEventListener('resize', ukur);
    window.addEventListener('scroll', ukur, true);
    return () => { window.removeEventListener('resize', ukur); window.removeEventListener('scroll', ukur, true); };
  }, [s.target]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && step < STEPS.length - 1) setStep(step + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep(step - 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, setStep, onClose]);

  const terakhir = step === STEPS.length - 1;
  const lebarKartu = Math.min(s.langkahAwal ? 460 : 340, vw - 32);

  // Posisi kartu: kanan target (kalau muat), lalu bawah, lalu atas; tanpa target = tengah.
  let posKartu;
  if (!rect || vw <= 640) {
    posKartu = rect
      ? (rect.top > window.innerHeight / 2 ? { left: 16, right: 16, top: 16 } : { left: 16, right: 16, bottom: 16 })
      : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: lebarKartu };
  } else {
    const vh = window.innerHeight;
    const ruangKanan = vw - (rect.left + rect.width);
    if (ruangKanan > lebarKartu + 24) {
      posKartu = { left: rect.left + rect.width + 14, top: Math.min(Math.max(12, rect.top), vh - 260), width: lebarKartu };
    } else if (rect.top + rect.height + 240 < vh) {
      posKartu = { left: Math.min(Math.max(12, rect.left + rect.width - lebarKartu), vw - lebarKartu - 12), top: rect.top + rect.height + 12, width: lebarKartu };
    } else {
      posKartu = { left: Math.min(Math.max(12, rect.left), vw - lebarKartu - 12), bottom: vh - rect.top + 12, width: lebarKartu };
    }
  }

  function keHalaman(to) { onClose(); navigate(to); }

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-label="Tur aplikasi">
      <div className="tour-blocker" />
      {rect
        ? <div className="tour-spot" style={rect} />
        : <div className="tour-dim" />}
      <div className="tour-card" style={posKartu}>
        <div className="tour-head">
          <span className="tour-count">{step + 1} / {STEPS.length}</span>
          <button type="button" className="tour-skip" onClick={onClose}>Lewati tur ✕</button>
        </div>
        <h4>{s.judul}</h4>
        <p>{s.isi}</p>

        {s.langkahAwal && (
          <ol className="tour-langkah">
            {LANGKAH_AWAL.map((l, i) => (
              <li key={l.to}>
                <button type="button" onClick={() => keHalaman(l.to)}>
                  <span className="tour-num">{i + 1}</span>
                  <span><b>{l.judul}</b><small>{l.ket}</small></span>
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="tour-dots">
          {STEPS.map((_, i) => <span key={i} className={i === step ? 'on' : ''} />)}
        </div>
        <div className="tour-actions">
          {step > 0 && <button type="button" className="btn btn-sm" onClick={() => setStep(step - 1)}>‹ Kembali</button>}
          <span style={{ flex: 1 }} />
          {terakhir
            ? <button type="button" className="btn btn-primary btn-sm" onClick={() => keHalaman('/profil')}>Mulai dari Profil Sekolah</button>
            : <button type="button" className="btn btn-primary btn-sm" onClick={() => setStep(step + 1)}>Lanjut ›</button>}
        </div>
      </div>
    </div>
  );
}

// Tombol bantuan di header: ulang tur + unduh PDF panduan.
export function TombolBantuan() {
  const { start } = useTour();
  return (
    <div className="help-btns" data-tour="bantuan">
      <button type="button" className="help-btn" onClick={start} title="Ulangi tur aplikasi">🧭 <span>Tur</span></button>
      <a className="help-btn" href={PDF_PANDUAN} download="Panduan Aplikasi SPP Sekolah.pdf" title="Unduh panduan aplikasi (PDF)">📄 <span>Panduan PDF</span></a>
    </div>
  );
}
