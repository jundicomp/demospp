/**
 * ===================================================================
 * KONEKSI GOOGLE SHEETS — DITANAM PERMANEN DI KODE (Cara 1)
 * ===================================================================
 * Sesuai keputusan: aplikasi ini SATU sekolah, jadi URL & sandi Apps
 * Script ditanam langsung di sini -- browser mana pun otomatis
 * langsung terhubung, tidak perlu isi Pengaturan Koneksi manual lagi.
 *
 * ⚠️ INGAT (sudah didiskusikan panjang sebelumnya): nilai di file ini
 * IKUT TER-BUILD ke file JavaScript yang dikirim ke SETIAP pengunjung
 * website -- bukan rahasia yang benar-benar tersembunyi. Siapa pun yang
 * buka DevTools browser (atau repo GitHub kalau statusnya Publik) bisa
 * menemukan nilai ini. Amannya cuma sebatas: orang itu MAKSIMAL bisa
 * baca/tulis ke 2 Google Sheets ini -- tidak lebih dari itu.
 *
 * Mau ganti URL/sandi? Edit nilai di bawah ini, lalu build ulang &
 * upload ulang. TIDAK ADA cara mengubahnya dari dalam aplikasi lagi
 * (Pengaturan Koneksi sudah dinonaktifkan, sesuai permintaan).
 * ===================================================================
 */
export const DEFAULT_SHEETS_CONFIG = {
  master: {
    url: 'https://script.google.com/macros/s/AKfycbx9unf2CFzLySuXEJyPLnUPgNMvAoBYxjtUlMOfumk6L2q_m-gFxAOC5_KmW8WuyJ0xBA/exec',
    secret: '123456',
  },
  keuangan: {
    url: 'https://script.google.com/macros/s/AKfycbxY1oNxd9ywcl0TZIkJAIy828QyubJnnNW_QsZmMCGzgXDlxr_YgL0WNK_bvnKvLGq2lQ/exec',
    secret: '123456',
  },
};
