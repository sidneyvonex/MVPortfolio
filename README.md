# CodeSidney — Full-Stack Developer Portfolio

A production-ready personal portfolio with a CMS-style admin panel. All content — projects, skills, work experience, education, testimonials and site settings — is stored in a PostgreSQL database and editable through a protected admin UI without touching code.

## Repository Structure

```
portfolio/
  client/       React 19 + TypeScript frontend (Vite), deployed to Cloudflare Pages
  server/       Hono + TypeScript REST API, deployed as a Cloudflare Worker
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
- Hono + TypeScript, running on Cloudflare Workers
- Drizzle ORM (schema, migrations, queries) via the Neon serverless HTTP driver
- Neon Postgres (serverless PostgreSQL)
- Cloudinary (image and PDF upload, via signed REST calls — no Node SDK)
- JSON Web Tokens (admin authentication)
- bcryptjs (password hashing)
- Swagger / OpenAPI (spec generated at build time, served at `/api/docs`)

## Quick Links

- [Setup Guide](SETUP.md) — install dependencies, configure env vars, run locally
- [Architecture](ARCHITECTURE.md) — data flow, API design, admin auth, upload pipeline
- API docs available at `http://localhost:5000/api/docs` when the server is running
