# PRD — neostudio

**Versi:** 0.1 (MVP)
**Tanggal:** 2026-09-02
**Status:** Draft terkunci untuk MVP

---

## 1. Ringkasan

neostudio adalah web app "Swiss Army Knife" — satu situs, banyak alat siap pakai. Pengguna tidak perlu install apa pun, tidak perlu daftar, langsung pakai. Alat diambil dari API pihak ketiga yang sudah diverifikasi hidup (siputzx + kyzznekoo), diproksi lewat backend sendiri agar kredensial dan rate-limit terkendali.

## 2. Masalah

Orang Indonesia yang butuh alat kecil (unduh video, generate QR, compress gambar, cek berita, screenshot web) sekarang harus:

- Buka 5 situs berbeda, masing-masing penuh iklan dan popup
- Install aplikasi hanya untuk satu fungsi
- Kena redirect/paywall di tengah proses
- Tidak tahu situs mana yang aman

Tidak ada satu tempat yang mengumpulkan alat-alat ini dengan UI konsisten dan bersih.

## 3. Target pengguna

| Persona | Kebutuhan | Tool yang dipakai |
|---|---|---|
| **Umum** | unduh video TikTok/IG, cek berita, jadwal sholat, main game ringan | Downloader, News & Info, Games & Fun |
| **Creator** | edit gambar, upscale, buat sticker/poster, template IG story | Canvas |
| **Developer** | QR, obfuscate JS, cari package NPM, cek IP, upload gambar | Tools, Search |

Fokus geografis: Indonesia. Bahasa antarmuka: Indonesia.

## 4. Ruang lingkup MVP

### Kategori (8) dan jumlah tool

| Kategori | Jml | Isi |
|---|---|---|
| **Tools** | 9 | QR Generator, My IP, JS Obfuscate, NPM Search, GitHub Search, Upload ImgBB, Upload GitHub, Kodepos, Temp Mail |
| **Canvas** | 13 | Brat, Balogo, IQC, PP Couple, IG Story, Fake IG, Wanted, Wasted, Upscale UHD, HD Foto, Sertifikat, Faceblur, RemoveBG |
| **Downloader** | 10 | TikTok, Instagram, Facebook, CapCut, Google Drive, SaveFrom, All-in-One, SnackVideo, Spotify, YouTube MP3 |
| **News & Info** | 12 | Antara, CNBC, CNN, Kompas, Liputan6, Merdeka, Sindonews, Suara, Tribun, BMKG, Jadwal TV, Jadwal Sholat |
| **Games & Fun** | 8 | Tebak Gambar, Family 100, Maths, Susun Kata, Cak Lontong, Asah Otak, Quote Anime, Blue Archive |
| **Primbon** | 3 | Arti Nama, Kecocokan Pasangan, Zodiak |
| **Search** | 6 | YouTube, Pinterest, Resep, Apple Music, Spotify, Grup WA |
| **Stalker** | 3 | GitHub, Twitter, Threads |

**Total: 64 tool.**

### Sumber API (terverifikasi 200)

- **siputzx** — `https://api.siputzx.my.id/api` (37 endpoint lolos)
- **kyzznekoo** — `https://api.kyzznekoo.my.id` (28 endpoint lolos)

Endpoint yang 4xx/5xx saat uji sudah dibuang atau diganti dengan padanan fungsi dari sumber lain. Rincian ada di `docs/api-inventory.md`.

## 5. User stories

1. Sebagai pengunjung baru, saya melihat semua kategori di halaman utama dan bisa langsung klik satu tool tanpa daftar.
2. Sebagai pengguna, saya bisa mencari tool berdasarkan nama atau fungsi lewat satu kotak pencarian.
3. Sebagai pengguna, saya mengisi form input tool, klik jalankan, dan melihat hasil (teks/gambar/JSON) di halaman yang sama.
4. Sebagai pengguna, saya bisa mengunduh atau menyalin hasil dengan satu klik.
5. Sebagai pengguna di koneksi lambat, saya melihat indikator loading yang jelas dan pesan galat yang bisa dimengerti (bukan stack trace).
6. Sebagai pengguna, kalau tool sedang mati (upstream 5xx), saya diberi tahu "sedang gangguan" bukan halaman kosong.
7. Sebagai pengguna mobile, saya bisa memakai semua tool dengan satu tangan di layar 375px.

## 6. Non-goals (di luar MVP)

- Autentikasi, akun pengguna, riwayat pemakaian
- Pembayaran, tier premium, kuota berbayar
- Tool AI chat / image generation (upstream tidak stabil)
- Kategori NSFW, tool bypass/spam, pemalsuan dokumen resmi (KTP, bukti transfer)
- Dark/light toggle (MVP dark-only sesuai design system)
- i18n multi-bahasa (Indonesia dulu)
- PWA/offline mode
- Public-apis sebagai sumber tambahan (ditunda)

## 7. Kebutuhan non-fungsional

| Aspek | Target |
|---|---|
| **Kinerja** | LCP < 2.5s di 4G; bundle awal < 200KB gzip |
| **Aksesibilitas** | Kontras teks 4.5:1, fokus keyboard terlihat, `prefers-reduced-motion` dihormati |
| **Responsif** | 375 / 768 / 1024 / 1440 px |
| **Keamanan** | Semua panggilan upstream lewat backend proxy; tidak ada API key di klien; validasi input di boundary |
| **Ketahanan** | Timeout 25s per panggilan upstream; cache respons yang layak; pesan galat ramah saat 4xx/5xx |
| **Rate limit** | Batasi per-IP di proxy agar tidak membanjiri upstream |

## 8. Arsitektur (ringkas)

```
apps/web      React + Vite + Tailwind  (UI, form per tool, render hasil)
apps/api      Hono + TypeScript        (proxy ke upstream, rate limit, cache, normalisasi galat)
packages/shared  TypeScript + Zod      (katalog tool, skema input/output, tipe bersama)
```

Alasan proxy di backend, bukan panggil upstream langsung dari browser:

- Menyembunyikan endpoint dan kredensial upstream
- CORS tidak dapat diandalkan pada beberapa upstream
- Bisa menambah cache dan rate limit
- Bentuk respons upstream tidak konsisten; dinormalisasi di satu tempat

Database belum dipakai di MVP (tidak ada state pengguna). Ditambah nanti bila perlu analitik atau akun.

## 9. Desain

Mengikuti `design-system/neostudio/MASTER.md`:

- **Style:** Dark Mode (OLED), dark-only di MVP
- **Pattern:** hero dengan kotak pencarian > grid kategori > daftar tool
- **Font:** JetBrains Mono (heading) + IBM Plex Sans (body)
- **Warna:** background `#0F172A`, aksen `#22C55E`
- **Ikon:** SVG (Lucide), bukan emoji

## 10. Kriteria selesai (MVP)

- [ ] 8 kategori tampil di halaman utama, tiap kategori punya halaman daftar tool
- [ ] 64 tool punya halaman sendiri dengan form input dan render hasil
- [ ] Pencarian tool berfungsi (nama + kata kunci)
- [ ] Semua panggilan lewat `apps/api`, tanpa endpoint upstream di bundle klien
- [ ] Galat upstream ditampilkan sebagai pesan ramah, bukan crash
- [ ] `pnpm typecheck` dan `pnpm lint` bersih
- [ ] Ada uji otomatis untuk katalog tool dan normalisasi respons proxy
- [ ] Lolos checklist aksesibilitas di `MASTER.md`

## 11. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Upstream mati atau berubah tanpa pemberitahuan | Tool tidak berfungsi | Health check periodik; tandai tool "gangguan"; siapkan padanan dari sumber lain |
| Rate limit upstream | Pengguna kena 429 | Cache di proxy; batasi per-IP; antre permintaan |
| Bentuk respons upstream tidak seragam | Bug render | Normalisasi + validasi Zod di `apps/api` |
| Legalitas beberapa tool (downloader) | Risiko takedown | Batasi ke tool yang lazim dipakai; tidak menyimpan konten unduhan di server |

## 12. Tahap berikutnya

1. `docs/api-inventory.md` — daftar 64 endpoint + parameter tervalidasi (sumber kebenaran untuk `packages/shared`)
2. `docs/CONTEXT.md` + ADR 0001 (pilihan stack)
3. Scaffold `packages/shared` (katalog + skema Zod)
4. Scaffold `apps/api` (proxy + rate limit + cache)
5. Scaffold `apps/web` (layout, halaman kategori, halaman tool)
