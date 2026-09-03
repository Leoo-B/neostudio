# Design System — neostudio

> **LOGIC:** Dokumen ini adalah satu-satunya sumber kebenaran desain. Nilai CSS asli berada di `apps/web/tailwind.config.ts` dan `apps/web/src/styles/` — pastikan tetap sinkron jika mengubah di sini.

---

**Project:** neostudio
**Generated:** 2026-09-02
**Category:** Developer Tool / Multi-tool Platform ("Swiss Army Knife")

---

## Global Rules

### Style: Dark Neobrutalism

Kombinasi dark mode (OLED-friendly) dengan estetika neobrutalism modern:
bg hitam pekat, border tebal putih/krem solid, shadow keras tanpa blur (hard offset), sudut siku/geometrik, warna aksen cream. **Tanpa emoji** sebagai ikon — wajib SVG modern (Heroicons).

**Keywords:** dark, OLED, hard shadow, thick border, punchy, bold, geometric, cream accent, high contrast, playful-but-functional

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0B0B0F` | `--color-background` |
| Background Alt | `#111117` | `--color-bg-alt` |
| Foreground | `#F7F5F2` | `--color-foreground` |
| Card | `#15151C` | `--color-card` |
| Card Foreground | `#F7F5F2` | `--color-card-foreground` |
| Accent (CTA) | `#F5DEB3` | `--color-accent` |
| On Accent | `#0B0B0F` | `--color-on-accent` |
| Primary | `#F5DEB3` | `--color-primary` |
| On Primary | `#0B0B0F` | `--color-on-primary` |
| Secondary Border | `#F7F5F2` | `--color-secondary` |
| Muted | `#2A2A33` | `--color-muted` |
| Muted Foreground | `#A9A9B3` | `--color-muted-foreground` |
| Border | `#F7F5F2` (solid 2px) | `--color-border` |
| Destructive | `#F8716F` | `--color-destructive` |
| On Destructive | `#0B0B0F` | `--color-on-destructive` |
| Ring / Focus | `#F5DEB3` | `--color-ring` |

**Color Notes:** Dark pekat + cream berpendar pengganti neon. Border putih/krem tebal solid (2px) — ciri neobrutalism.

### Typography

- **Heading Font:** Space Grotesk (geometris, bold, modern)
- **Body Font:** Inter (bersih, mudah dibaca)
- **Mono (kode/JSON):** JetBrains Mono
- **Mood:** modern, bold, geometric, developer, punchy
- **Google Fonts:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `.25rem` | tight gaps |
| `--space-sm` | `8px` / `.5rem` | icon gaps |
| `--space-md` | `16px` / `1rem` | standard padding |
| `--space-lg` | `24px` / `1.5rem` | section padding |
| `--space-xl` | `32px` / `2rem` | large gaps |
| `--space-2xl` | `48px` / `3rem` | section margins |
| `--space-3xl` | `64px` / `4rem` | hero padding |

### Neobrutalism Signature (border + hard shadow)

```css
:root {
  --border-w: 2px;
  --border-color: #F7F5F2;
  --shadow-hard: 4px 4px 0 0 #F5DEB3;   /* hard offset, no blur */
  --shadow-hard-sm: 3px 3px 0 0 #F5DEB3;
  --radius: 0px;                          /* sudut siku (atau 8px jika minta) */
}
```

Rule: **tanpa blur shadow**, tebal jelas, warna aksen cream sebagai shadow di atas hitam.

---

## Component Specs

### Button (primary)
```css
.btn-primary {
  background: #F5DEB3;        /* cream */
  color: #0B0B0F;
  border: 2px solid #F7F5F2;
  border-radius: 0;           /* siku */
  padding: 12px 24px;
  font-weight: 700;
  box-shadow: 4px 4px 0 0 #F7F5F2;
  cursor: pointer;
  transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 150ms;
}
.btn-primary:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 0 #F7F5F2; }
.btn-primary:active { transform: translate(2px,2px); box-shadow: 0 0 0 0 #F7F5F2; }
```

### Card (tool / kategori)
```css
.card {
  background: #15151C;
  border: 2px solid #F7F5F2;
  border-radius: 0;
  padding: 24px;
  box-shadow: 4px 4px 0 0 #F5DEB3;   /* cream hard shadow */
  cursor: pointer;
  transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 150ms;
}
.card:hover { transform: translate(-3px,-3px); box-shadow: 7px 7px 0 0 #F5DEB3; }
```

### Input
```css
.input {
  background: #111117;
  color: #F7F5F2;
  border: 2px solid #F7F5F2;
  border-radius: 0;
  padding: 12px 16px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #F5DEB3;
  box-shadow: 3px 3px 0 0 #F5DEB3;
}
```

### Tag/Chip
```css
.chip {
  background: #111117;
  border: 2px solid #F7F5F2;
  color: #F7F5F2;
  padding: 4px 12px;
  font-weight: 600;
  box-shadow: 2px 2px 0 0 #F5DEB3;
  cursor: pointer;
}
```

---

## Style Guidelines

**Style: Dark Neobrutalism** — bg `#0B0B0F`, card `#15151C`, border putih `#F7F5F2` (2px solid), hard shadow cream `#F5DEB3` (4px offset, **tanpa blur**), sudut siku.

**Key Effects (dari transitions-dev / transitions-polish):**
- Hovernya `translate(-2px,-2px)` + shadow membesar — kesan "diangkat" khas neobrutalism
- Transisi 150-300ms, easing `cubic-bezier(0.22,1,0.36,1)` (smooth-out)
- Gunakan motion tokens dari `transitions-polish/_root.css` (salon di repo root)

### Page Pattern

**Pattern: Dashboard / Toolbox Launchpad**
- **CTA:** Kotak pencarian besar + 8 kartu kategori
- **Section order:** Hero (logo + tagline + search) → "cara pakai" strip (3-4 langkah) → grid 8 kategori → tool populer
- **Anti-pattern dilarang:** emoji sebagai ikon (pakai Heroicons SVG), shadow blur terlalu lembut, gradient neon, layout shift saat hover

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — wajib SVG (Heroicons)
- ❌ Neon/bright gradients — ganti dengan cream `#F5DEB3` + hard shadow
- ❌ Soft feathery shadows — ganti hard offset shadow
- ❌ Rounded corners berlebihan (kecuali diminta) — default sudut siku
- ❌ Light mode default
- ❌ Missing `cursor:pointer` pada elemen klik
- ❌ Low contrast text — min 4.5:1
- ❌ Instan state change tanpa transisi — selalu 150-300ms

---

## Pre-Delivery Checklist

- [ ] No emojis as icons (pakai Heroicons SVG)
- [ ] `cursor-pointer` pada semua elemen klik
- [ ] Hard offset shadow (`-px`, no blur), border tebal 2px
- [ ] Hover `translate` + shadow membesar, 150-300ms
- [ ] `prefers-reduced-motion` dihormati (guard di semua transition)
- [ ] text contrast ≥ 4.5:1
- [ ] Focus states visible (ring cream `#F5DEB3`)
- [ ] Responsive: 375 / 768 / 1024 / 1440 px
- [ ] No horizontal scroll on mobile
