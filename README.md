# CodeSidney — Full-Stack Developer Portfolio

A production-ready personal portfolio with a CMS-style admin panel. All content — projects, skills, work experience, education, testimonials and site settings — is stored in a PostgreSQL database and editable through a protected admin UI without touching code.

> **Note:** This `main` branch still runs the original Express API, now hosted on [Render](https://render.com) (previously Azure App Service — see `render.yaml`). A full migration to Cloudflare — the API rewritten on Hono/Cloudflare Workers, the client on Cloudflare Pages — has been completed and deployed, and lives on the [`cloudflare-migration`](../../tree/cloudflare-migration) branch pending review/merge. See that branch's README/SETUP/ARCHITECTURE docs for the new setup and deploy flow.

## Repository Structure

```
portfolio/
  client/       React 19 + TypeScript frontend (Vite)
  server/       Express 5 + TypeScript REST API
  README.md     This file
  SETUP.md      Environment setup and running instructions
  ARCHITECTURE.md  How the system is designed and how it works
```

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite 8 (dev server + build)
- TanStack Router (file-based routing)
- TanStack Query (server-state caching)
- Framer Motion (animations)
- Tailwind CSS v4
- React Three Fiber + Three.js (hero 3D background)
- React Hook Form + Zod (contact form validation)
- Lucide React (icons throughout)

**Backend**
- Express 5 + TypeScript
- Drizzle ORM (schema, migrations, queries)
- Neon Postgres (serverless PostgreSQL)
- Cloudinary (image and PDF upload)
- JSON Web Tokens (admin authentication)
- bcryptjs (password hashing)
- Swagger / OpenAPI (auto-generated API docs)

## Quick Links

- [Setup Guide](SETUP.md) — install dependencies, configure env vars, run locally
- [Architecture](ARCHITECTURE.md) — data flow, API design, admin auth, upload pipeline
- API docs available at `http://localhost:5000/api/docs` when the server is running
