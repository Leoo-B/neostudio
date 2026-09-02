# API Inventory — neostudio

> **Sumber kebenaran:** 64 tool, 8 kategori. Parameter tervalidasi dari test (Sep 2026).
> Setiap kolom: `id` → `method baseUrl + path` → `fields` → `kind`

| # | ID | Endpoint | Fields | Result | Status |
|---|---|---|---|---|---|
| **Tools** (9) | | | | | |
| 1 | `qr` | GET `https://api.kyzznekoo.my.id/api/tools/v2/qr` | text* (text) | image | kyzznekoo |
| 2 | `myip` | GET `https://api.kyzznekoo.my.id/api/tools/ip` | ip (text) | json | kyzznekoo |
| 3 | `obfuscate` | GET `https://api.kyzznekoo.my.id/api/tools/obfuscate` | text* (text) | json | kyzznekoo |
| 4 | `npm` | GET `https://api.kyzznekoo.my.id/api/search/npm` | q* (text) | json | kyzznekoo |
| 5 | `github-search` | GET `https://api.kyzznekoo.my.id/api/search/github` | q* (text) | json | kyzznekoo |
| 6 | `upload-imgbb` | GET `https://api.kyzznekoo.my.id/api/upload/imgbb` | url* (url) | json | kyzznekoo |
| 7 | `upload-github` | GET `https://api.kyzznekoo.my.id/api/upload/github` | url* (url), accessToken (text) | json | kyzznekoo |
| 8 | `kodepos` | GET `https://api.siputzx.my.id/api/tools/kodepos` | form* (text) | json | siputzx |
| 9 | `tempmail` | GET `https://api.kyzznekoo.my.id/api/tools/tmpmail/v2/create` | — | json | kyzznekoo |
| **Canvas** (13) | | | | | |
| 10 | `brat` | GET `https://api.siputzx.my.id/api/m/brat` | text* (text) | image | siputzx |
| 11 | `balogo` | GET `https://api.kyzznekoo.my.id/api/maker/balogo` | text* (text), bgcolor (text), color (text) | image | kyzznekoo |
| 12 | `iqc` | GET `https://api.kyzznekoo.my.id/api/image/iqc` | text* (text), avatar (url) | image | kyzznekoo |
| 13 | `ppcouple` | GET `https://api.kyzznekoo.my.id/api/image/ppcouple` | — | json | kyzznekoo |
| 14 | `story-ig` | GET `https://api.kyzznekoo.my.id/api/canvas/v2/storyig` | username* (text), text (text), avatar (url) | image | kyzznekoo |
| 15 | `fake-ig` | GET `https://api.kyzznekoo.my.id/api/canvas/v2/fake-ig` | username* (text), avatar (url) | image | kyzznekoo |
| 16 | `wanted` | GET `https://api.kyzznekoo.my.id/api/editor/wanted` | url* (url), text (text) | image | kyzznekoo |
| 17 | `wasted` | GET `https://api.kyzznekoo.my.id/api/editor/wasted` | url* (url), text (text) | image | kyzznekoo |
| 18 | `upscale-uhd` | GET `https://api.kyzznekoo.my.id/api/upscale/v5/uhd` | url* (url) | image | kyzznekoo |
| 19 | `hdfoto` | GET `https://api.kyzznekoo.my.id/api/upscale/hdfoto` | url* (url) | image | kyzznekoo |
| 20 | `sertifikat` | GET `https://api.kyzznekoo.my.id/api/image/sertifikat` | text* (text) | image | kyzznekoo |
| 21 | `faceblur` | GET `https://api.kyzznekoo.my.id/api/editor/faceblur` | url* (url) | image | kyzznekoo |
| 22 | `removebg` | GET `https://api.kyzznekoo.my.id/api/tools/rbg` | url* (url) | image | kyzznekoo |
| **Downloader** (10) | | | | | |
| 23 | `tiktok` | GET `https://api.siputzx.my.id/api/d/tiktok/v2` | url* (url) | json | siputzx |
| 24 | `instagram` | GET `https://api.siputzx.my.id/api/d/sssinstagram` | url* (url) | json | siputzx |
| 25 | `facebook` | GET `https://api.siputzx.my.id/api/d/facebook` | url* (url) | json | siputzx |
| 26 | `capcut` | GET `https://api.siputzx.my.id/api/d/capcut` | url* (url) | json | siputzx |
| 27 | `gdrive` | GET `https://api.siputzx.my.id/api/d/gdrive` | url* (url) | json | siputzx |
| 28 | `savefrom` | GET `https://api.siputzx.my.id/api/d/savefrom` | url* (url) | json | siputzx |
| 29 | `snackvideo` | GET `https://api.kyzznekoo.my.id/api/downloader/snackvideo` | url* (url) | json | kyzznekoo |
| 30 | `spotify-dl` | GET `https://api.kyzznekoo.my.id/api/downloader/spotify` | url* (url) | json | kyzznekoo |
| 31 | `ytmp3` | GET `https://api.kyzznekoo.my.id/api/downloader/ytmp3` | url* (url) | json | kyzznekoo |
| 32 | `all-dl` | GET `https://api.kyzznekoo.my.id/api/downloader/all` | url* (url) | json | kyzznekoo |
| **News & Info** (12) | | | | | |
| 33 | `berita-cnn` | GET `https://api.siputzx.my.id/api/berita/cnn` | — | json | siputzx |
| 34 | `berita-kompas` | GET `https://api.siputzx.my.id/api/berita/kompas` | — | json | siputzx |
| 35 | `berita-liputan6` | GET `https://api.siputzx.my.id/api/berita/liputan6` | — | json | siputzx |
| 36 | `berita-antara` | GET `https://api.siputzx.my.id/api/berita/antara` | — | json | siputzx |
| 37 | `berita-suara` | GET `https://api.siputzx.my.id/api/berita/suara` | — | json | siputzx |
| 38 | `berita-sindonews` | GET `https://api.siputzx.my.id/api/berita/sindonews` | — | json | siputzx |
| 39 | `berita-merdeka` | GET `https://api.siputzx.my.id/api/berita/merdeka` | — | json | siputzx |
| 40 | `berita-tribun` | GET `https://api.siputzx.my.id/api/berita/tribunnews` | — | json | siputzx |
| 41 | `berita-cnbc` | GET `https://api.siputzx.my.id/api/berita/cnbcindonesia` | — | json | siputzx |
| 42 | `bmkg` | GET `https://api.siputzx.my.id/api/info/bmkg` | — | json | siputzx |
| 43 | `jadwaltv` | GET `https://api.siputzx.my.id/api/info/jadwaltv` | — | json | siputzx |
| 44 | `sholat` | GET `https://api.kyzznekoo.my.id/api/search/sholat` | kota* (text) | json | kyzznekoo |
| **Games & Fun** (8) | | | | | |
| 45 | `tebak-gambar` | GET `https://api.siputzx.my.id/api/games/tebakgambar` | — | json | siputzx |
| 46 | `family100` | GET `https://api.siputzx.my.id/api/games/family100` | — | json | siputzx |
| 47 | `maths` | GET `https://api.siputzx.my.id/api/games/maths` | — | json | siputzx |
| 48 | `susun-kata` | GET `https://api.siputzx.my.id/api/games/susunkata` | — | json | siputzx |
| 49 | `cak-lontong` | GET `https://api.siputzx.my.id/api/games/caklontong` | — | json | siputzx |
| 50 | `asah-otak` | GET `https://api.siputzx.my.id/api/games/asahotak` | — | json | siputzx |
| 51 | `quote-anime` | GET `https://api.siputzx.my.id/api/r/quotesanime` | — | json | siputzx |
| 52 | `blue-archive` | GET `https://api.siputzx.my.id/api/r/blue-archive` | — | json | siputzx |
| **Primbon** (3) | | | | | |
| 53 | `arti-nama` | GET `https://api.siputzx.my.id/api/primbon/artinama` | nama* (text) | json | siputzx |
| 54 | `kecocokan` | GET `https://api.siputzx.my.id/api/primbon/kecocokan_nama_pasangan` | nama1* (text), nama2* (text) | json | siputzx |
| 55 | `zodiak` | GET `https://api.siputzx.my.id/api/primbon/zodiak` | zodiak* (select) | json | siputzx |
| **Search** (6) | | | | | |
| 56 | `yt-search` | GET `https://api.siputzx.my.id/api/s/youtube` | query* (text) | json | siputzx |
| 57 | `pinterest-search` | GET `https://api.siputzx.my.id/api/s/pinterest` | query* (text) | json | siputzx |
| 58 | `resep` | GET `https://api.siputzx.my.id/api/s/resep` | query* (text) | json | siputzx |
| 59 | `apple-music` | GET `https://api.kyzznekoo.my.id/api/search/applemusic` | q* (text) | json | kyzznekoo |
| 60 | `spotify-search` | GET `https://api.kyzznekoo.my.id/api/search/v2/spotify` | q* (text) | json | kyzznekoo |
| 61 | `grup-wa` | GET `https://api.kyzznekoo.my.id/api/search/group` | q* (text) | json | kyzznekoo |
| **Stalker** (3) | | | | | |
| 62 | `stalk-github` | GET `https://api.siputzx.my.id/api/stalk/github` | user* (text) | json | siputzx |
| 63 | `stalk-twitter` | GET `https://api.siputzx.my.id/api/stalk/twitter` | user* (text) | json | siputzx |
| 64 | `stalk-threads` | GET `https://api.kyzznekoo.my.id/api/stalker/threads` | q* (text) | json | kyzznekoo |

*Diperbarui: 2026-09-02*
