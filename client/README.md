# client

React 19 + TypeScript site for the portfolio: the public pages in the Kodika Labs style, and the protected admin dashboard.

## Tech Stack

| Library | Purpose |
|---------|---------|
| React 19 + TypeScript | UI framework |
| Vite | Dev server and bundler |
| React Router 7 | Pages and links |
| TanStack Query | API data, cached per collection |
| Tailwind CSS v4 | Styling, with the Kodika tokens in `src/index.css` |
| Instrument Sans, JetBrains Mono | Self-hosted fonts (`@fontsource`) |
| React Hook Form + Zod | Contact form validation |
| Lucide React | Icons in the admin panel |
| Sonner | Toast notifications |

## Design system

`src/index.css` holds the Kodika Labs brand: paper, ink and tangerine colours exposed as semantic roles (`surface`, `fg`, `fg-soft`, `line`, `accent`). Components use only the roles, so the dark theme (set on `<html data-theme>` by `public/theme-init.js` before first paint) needs no extra classes. Shape: square corners, hairline borders, tangerine for the eyebrow tile, one band per page and the hero tiles.

## Folder Structure

```
src/
  components/
    admin/        Eight admin panels (one per content type)
    layout/       Layout, Header, MobileMenu, Footer, Wordmark
    sections/     Page building blocks: HomeHero, ServiceStrip, WorkGrid, Bands, ...
    ui/           Button, Label, TileIcon (+ tileIcons), Container, SectionHeading, ...
  data/
    site.ts       Name, role, canonical URL, navigation
    services.ts   The eight services and their pages' content
    faq.ts        Questions and answers for /faq
  hooks/
    useContent.ts   One query hook per API collection, sorted by `order`
    useSettings.ts  Site settings plus derived links (email, socials, résumé)
    usePageTitle.ts, useTheme.ts, useAdminHead.ts
  lib/
    format.ts     Dates, project summaries and paths, Cloudinary image sizes
    auth.ts       Admin token helpers (localStorage)
    favicon.ts    Admin tab icon from the hero photo
  pages/          One file per route; admin/ for Login and Dashboard
  services/
    api.ts        Public API calls
    adminApi.ts   Authenticated API calls (Bearer token)
  types/index.ts  Shared TypeScript interfaces
  App.tsx         Routes
  main.tsx        Entry point
```

## Routes

| Path | Page | Content from |
|------|------|--------------|
| `/` | Home: summaries of everything, each linking onward | API + `data/` |
| `/services`, `/services/:slug` | Services and one page per service | `data/services.ts` |
| `/work`, `/work/:slug` | Projects with filters, and case studies | API (slug, or id for older projects) |
| `/about` | Story, experience, skills, education, community, testimonials | API |
| `/contact` | Contact details and form | API |
| `/faq`, `/privacy` | Questions, privacy notice | `data/faq.ts`, page |
| `/admin` → `/admin/login`, `/admin/dashboard` | Admin | API (token required) |

## Environment

`.env.production` sets `VITE_API_URL` to the API Worker's absolute URL for production builds. In development `VITE_API_URL` is unset, calls go to `/api`, and Vite proxies them:

```bash
pnpm dev                                                            # proxies to a local API on :8787
API_PROXY=https://mvportfolio-api.sidneygithu.workers.dev pnpm dev  # uses the live API's data
```

## Commands

```bash
pnpm dev       # Vite dev server on port 5173
pnpm build     # Type-check, build, then prerender every page to dist/ from the live API
pnpm preview   # Build, then serve it with wrangler dev
pnpm deploy    # Build, then deploy the Worker
pnpm lint      # ESLint
```
