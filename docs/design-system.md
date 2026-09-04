# Design System — neostudio

> **LOGIC:** Dokumen ini adalah satu-satunya sumber kebenaran desain. Nilai CSS asli berada di `apps/web/tailwind.config.ts` dan `apps/web/src/styles/` — pastikan tetap sinkron jika mengubah di sini.

---

**Project:** neostudio
**Updated:** 2026-09-04
**Category:** Developer Tool / Multi-tool Platform ("Swiss Army Knife")

---

## Global Rules

### Style: Clean Modern Dark

Dark base (OLED-friendly) dengan estetika modern minimalis:
bg hitam pekat, border tipis 1px semi-transparan, radius seragam 12px, shadow lembut (blur), satu aksen cream `#F5DEB3` yang dipakai halus (link, CTA, highlight). **Bukan neobrutalism** (tanpa hard offset shadow, tanpa border tebal 2px) dan **bukan glassmorphism**.

**Keywords:** dark, minimal, thin border, soft shadow, rounded, clean, cream accent, humanist, calm

### Color Palette

| Role | Hex | Tailwind |
|------|-----|----------|
| Background | `#0B0B0F` | `bg-bg` |
| Background Alt | `#111117` | `bg-altar` |
| Foreground | `#F7F5F2` | `text-fg` |
| Card | `#15151C` | `bg-card` |
| Accent (CTA) | `#F5DEB3` | `text-cream` / `bg-cream` |
| On Accent | `#0B0B0F` | `text-oncream` |
| Muted | `#2A2A33` | `bg-muted` |
| Muted Foreground | `#A9A9B3` | `text-muted-fg` |
| Border (line) | `rgba(247,245,242,0.10)` | `border-line` |
| Border (strong) | `rgba(247,245,242,0.18)` | `border-line-strong` |
| Destructive | `#F8716F` | `text-danger` |

**Color Notes:** Aksen cream dipakai halus — tidak boleh jadi hard shadow atau border tebal.

### Typography

- **Heading Font:** Space Grotesk (geometris, bold, modern)
- **Body Font:** Inter (bersih, mudah dibaca)
- **Mono (kode/JSON):** JetBrains Mono
- **Google Fonts:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Signature (border tipis + shadow lembut)

```css
:root {
  --border-w: 1px;
  --border-color: rgba(247, 245, 242, 0.10);
  --shadow-soft: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-lift: 0 12px 32px rgba(0, 0, 0, 0.45);
  --radius: 12px;
}
```

Rule: border tipis 1px, radius 12px, shadow blur lembut. Tidak ada hard offset shadow, tidak ada gradient neon.

---

## Component Specs

### Button (primary)
```css
.btn-primary {
  background: #F5DEB3;        /* cream */
  color: #0B0B0F;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.22,1,0.36,1), box-shadow 200ms, background 200ms;
}
.btn-primary:hover { background: #F8E7C4; box-shadow: 0 8px 24px rgba(245,222,179,0.18); }
.btn-primary:active { transform: translateY(1px); }
```

### Card (tool / kategori)
```css
.card {
  background: #15151C;
  border: 1px solid rgba(247,245,242,0.10);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
  transition: transform 200ms cubic-bezier(0.22,1,0.36,1), box-shadow 200ms, border-color 200ms;
}
.card:hover { border-color: rgba(245,222,179,0.25); box-shadow: 0 12px 32px rgba(0,0,0,0.45); }
```

### Input
```css
.input {
  background: #111117;
  color: #F7F5F2;
  border: 1px solid rgba(247,245,242,0.14);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
}
.input:focus { outline: none; border-color: rgba(245,222,179,0.55); box-shadow: 0 0 0 3px rgba(245,222,179,0.12); }
```

### Chip / Filter
```css
.chip {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(247,245,242,0.12);
  border-radius: 999px;
  padding: 6px 14px;
  font-weight: 500;
  cursor: pointer;
}
.chip:hover { background: rgba(245,222,179,0.08); border-color: rgba(245,222,179,0.35); color: #F5DEB3; }
.chip.is-active { background: rgba(245,222,179,0.12); border-color: rgba(245,222,179,0.5); color: #F5DEB3; }
```

---

## Motion (GSAP)

- `gsap` + `ScrollTrigger` terdaftar di `apps/web/src/lib/gsap.ts`.
- **Counter animasi** (0→64): `AnimatedCounter` — ScrollTrigger `once`, `snap: 1`, durasi 1.4s, ease `power2.out`.
- **Reveal scroll**: `Reveal` — fade + translateY + blur → clear, ScrollTrigger `start: top 88%`, durasi 0.6s, ease `power3.out`.
- **Hover lift**: class CSS `nb-lift` (translateY(-3px)) — tanpa JS per elemen.
- **Accordion FAQ**: transisi CSS `grid-template-rows 0fr→1fr` + rotate chevron. Gaya braikter: satu item terbuka, border aktif cream.
- **Hormati** `prefers-reduced-motion: reduce` (guard di `AnimatedCounter` & `Reveal`).

---

## Page Pattern

**Pattern: Landing → Katalog → Detail**
- `/` Home (landing): hero + search + CTA + kategori (tab filter + preview) + FAQ. **Tidak** menampilkan semua tool di home.
- `/tools`: search + sticky filter kategori + grid penuh.
- `/tool/:id`: form + hasil (konsisten pakai token di atas).
- **Anti-pattern dilarang:** emoji sebagai ikon (pakai Heroicons SVG), hard shadow neobrutalism, glassmorphism, gradient neon, tool grid penuh di home.

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — wajib SVG (Heroicons)
- ❌ Neon/bright gradients
- ❌ Hard offset shadow (neobrutalism) — `4px 4px 0 0 #F5DEB3` dilarang
- ❌ Border tebal 2px solid — pakai 1px semi-transparan
- ❌ Glassmorphism (blur tebal + transparansi tinggi) — cukup `bg-bg/85` + blur tipis di header
- ❌ Light mode default
- ❌ Missing `cursor:pointer` pada elemen klik
- ❌ Low contrast text — min 4.5:1
- ❌ Instan state change tanpa transisi — selalu 200-300ms

---

## Keamanan: Info API Tidak Boleh Bocor

- `packages/shared/src/tools.ts` hanya berisi **metadata publik** (id, category, name, desc, fields, renderKind).
- Info upstream (`baseUrl`, `path`, `source`, `method`) ada di `packages/shared/src/upstream.ts` — **server-only**, tidak boleh diimport dari kode web.
- API (`apps/api`) memakai `withUpstream()` / `UPSTREAM[id]` untuk membangun URL.
- `SIPUTZX_BASE` / `KYZZNEKOO_BASE` env dapat menimpa domain upstream.

---

## Pre-Delivery Checklist

- [ ] No emojis as icons (pakai Heroicons SVG)
- [ ] `cursor-pointer` pada semua elemen klik
- [ ] Border 1px semi-transparan, radius 12px, shadow lembut
- [ ] Transisi 200-300ms, easing `cubic-bezier(0.22,1,0.36,1)`
- [ ] `prefers-reduced-motion` dihormati (GSAP guard)
- [ ] text contrast ≥ 4.5:1
- [ ] Focus states visible (ring cream `#F5DEB3`)
- [ ] Responsive: 375 / 768 / 1024 / 1440 px
- [ ] No horizontal scroll on mobile
- [ ] Nama/domain API upstream tidak muncul di bundle web (`grep -c siputzx dist`)
