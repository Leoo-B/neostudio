# neostudio

Satu situs, banyak alat. **64 tools** dalam 8 kategori — gratis, tanpa daftar, bahasa Indonesia.

Dari unduh video TikTok, generate QR, cek berita, edit gambar, sampai main tebak-tebakan.

## Stack

| Bagian | Teknologi |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind + TanStack Router/Query + Heroicons |
| **Backend** | Hono (proxy ke upstream API, rate limit, cache, normalisasi galat) |
| **Shared** | TypeScript + Zod (katalog tool, skema, tipe) |
| **Desain** | Clean modern dark — bg `#0B0B0F`, border 1px, radius 12px, shadow lembut, aksen cream `#F5DEB3`; animasi GSAP |

## Struktur

```
apps/
  api/       Hono proxy — /api/run/:id, /api/catalog, /health
  web/       React + Vite — home, halaman tool
packages/
  shared/    Katalog 64 tool, kategori, skema Zod, tipe
docs/
  PRD.md              Product requirements
  api-inventory.md    Daftar 64 endpoint + parameter tervalidasi
  design-system.md    Design tokens & aturan UI
```

## Jalankan lokal

Butuh Node ≥ 20 dan pnpm 9.

```bash
pnpm install

# terminal 1 — API proxy (port 8787)
pnpm --filter @neostudio/api dev

# terminal 2 — Web (port 5173)
pnpm --filter @neostudio/web dev
```

Buka http://localhost:5173

Vite mem-proxy `/api` ke `http://localhost:8787`, jadi tidak perlu konfigurasi CORS saat dev.

## Perintah

```bash
pnpm typecheck                        # semua workspace
pnpm --filter @neostudio/web lint     # eslint
pnpm --filter @neostudio/web build    # build produksi
pnpm --filter @neostudio/shared test  # test katalog
pnpm --filter @neostudio/api test     # test proxy
```

## Kategori

| Kategori | Jml | Isi |
|---|---|---|
| Tools | 9 | QR, My IP, JS Obfuscate, NPM/GitHub Search, Upload, Kodepos, Temp Mail |
| Canvas | 13 | Brat, Logo, Upscale, Remove BG, Face Blur, meme editor, sertifikat |
| Downloader | 10 | TikTok, Instagram, Facebook, YouTube MP3, Spotify, CapCut, Google Drive |
| News & Info | 12 | 9 outlet berita Indonesia + BMKG + Jadwal TV + Jadwal Sholat |
| Games & Fun | 8 | Tebak Gambar, Family 100, Maths, Susun Kata, Cak Lontong, Asah Otak |
| Primbon | 3 | Arti Nama, Kecocokan Pasangan, Zodiak |
| Search | 6 | YouTube, Pinterest, Resep, Apple Music, Spotify, Grup WA |
| Stalker | 3 | GitHub, Twitter/X, Threads |

## Cara kerja

1. Frontend memanggil `POST /api/run/:toolId` dengan `{ params }`
2. `apps/api` mencari definisi tool di `packages/shared` (katalog publik + peta upstream server-only), memanggil upstream, lalu menormalisasi respons ke `{ ok, status, kind, data | imageUrl }`
3. Frontend merender hasil sesuai `renderKind` tool — `downloadCard`, `articleList`, `profileCard`, `keyValue`, `mediaList`, `resultList`, `quoteCard`, `image`, atau fallback `codeBlock`

Semua panggilan upstream lewat proxy: endpoint upstream tidak pernah masuk bundle klien, dan rate limit (60 req/menit/IP) plus cache 1 menit ditangani di server.

## Sumber API

Katalog tool memakai beberapa API publik pihak ketiga. Nama/domain sumber **tidak diekspos ke klien** — semua dipetakan di `packages/shared/src/upstream.ts` (server-only) dan bisa dioverride via env `SIPUTZX_BASE` / `KYZZNEKOO_BASE`.

Tool yang upstream-nya sedang gangguan menampilkan pesan galat ramah dan menyarankan tool alternatif.

## Lisensi

MIT — lihat [LICENSE](./LICENSE).
