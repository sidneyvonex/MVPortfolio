# Bensidney Ndungu — Portfolio

Personal portfolio at [sidney.kodikalabs.com](https://sidney.kodikalabs.com), styled with the Kodika Labs design system, with a CMS-style admin panel. Projects, skills, experience, education, testimonials, communities and site settings live in PostgreSQL and are edited at `/admin` without touching code. Services and FAQ content live in code (`client/src/data/`).

## Repository Structure

```
client/          React 19 + TypeScript site (Vite), served by a Cloudflare Worker as static assets
server/          Hono + TypeScript REST API, deployed as a separate Cloudflare Worker
SETUP.md         Install, configure and run locally; deploy
ARCHITECTURE.md  How the pieces fit: data flow, auth, uploads, API reference
```

## Tech Stack

**Site (`client/`)**
- React 19 + TypeScript, Vite 8
- React Router 7 (pages: home, services, work, case studies, about, contact, FAQ, privacy, admin)
- TanStack Query (API data caching)
- Tailwind CSS v4 with the Kodika Labs tokens: paper, ink and tangerine, light and dark themes
- Instrument Sans and JetBrains Mono, self-hosted
- React Hook Form + Zod (contact form)
- Lucide icons in the admin panel; Kodika tile icons on the public site

**API (`server/`)**
- Hono on Cloudflare Workers
- Drizzle ORM with the Neon serverless HTTP driver, Neon PostgreSQL
- Cloudinary for images and PDFs (signed REST calls, no Node SDK)
- JWT admin authentication, bcryptjs password hashing
- OpenAPI spec generated at build time, Swagger UI at `/api/docs`

Both apps use pnpm.

## Quick Links

- [Setup Guide](SETUP.md) — install, environment variables, run locally, deploy
- [Architecture](ARCHITECTURE.md) — data flow, admin auth, upload pipeline, API reference
- API docs at `http://localhost:8787/api/docs` while `pnpm dev` runs in `server/`
