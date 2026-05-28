# sudheendra-site

Personal website for Dr. Sudheendra Huddar — psychiatrist, de-addiction specialist, and founder.

Built with **Next.js 14 + Tailwind CSS**, deployed on **Vercel**.

---

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + DM Serif Display / DM Sans
- **Hosting**: Vercel (hobby tier — free)
- **Domain**: Connect via Vercel dashboard

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
# → http://localhost:3000
```

---

## Folder structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page
│   ├── about/page.tsx
│   ├── clinic/page.tsx
│   ├── products/page.tsx
│   └── research/page.tsx
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── ProductsPreview.tsx
│       └── ClinicPreview.tsx
├── styles/
│   └── globals.css
└── lib/               # Utilities, constants (add as needed)
```

---

## Pages to build next

| Page | Priority | Notes |
|------|----------|-------|
| `/about` | High | Story, photo, credentials, timeline |
| `/clinic` | High | Services, locations, contact/WhatsApp |
| `/products` | High | Cards for VERBATIM, Kairos, DRISHTI, NutriLens |
| `/research` | Medium | AUD subtypes, interests, publications |

---

## Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "init: personal site scaffold"
git remote add origin https://github.com/Endorphin28/sudheendra-site.git
git push -u origin main

# Then connect repo at vercel.com → Import project → done
```

---

## Design tokens

| Token | Value | Usage |
|-------|-------|-------|
| `ink` | `#1a1917` | Primary text |
| `ink-muted` | `#6b6a65` | Secondary text |
| `paper` | `#f7f5f0` | Page background |
| `paper-white` | `#fdfcfa` | Card/section backgrounds |
| `accent` | `#2d6a4f` | Green — brand colour |
| `font-display` | DM Serif Display | Headings |
| `font-body` | DM Sans | Body text |
