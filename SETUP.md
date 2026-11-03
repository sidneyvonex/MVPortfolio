# Setup Guide

This document covers everything needed to run the portfolio project locally, from prerequisites to creating your first admin account.

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 20 | LTS recommended |
| pnpm | 12+ | Used in both workspaces |
| Git | any | |

An account on the following external services is required:

- **Neon** (https://neon.tech) — free-tier serverless PostgreSQL
- **Cloudinary** (https://cloudinary.com) — free-tier image and file storage

---

## 1. Clone the repository

```bash
git clone <your-repo-url>
cd portfolio
```

---

## 2. Install dependencies

Both workspaces have separate `package.json` files. Install them independently.

```bash
# Server
cd server
pnpm install

# Client
cd ../client
pnpm install
```

---

## 3. Configure the server environment

The API runs as a Cloudflare Worker (Hono), so its secrets live in **`server/.dev.vars`** for local dev (Wrangler's equivalent of `.env`) rather than a plain `.env`:

```bash
cp server/.dev.vars.example server/.dev.vars
```

Then fill in every value — none have safe defaults in production:

```env
# Neon PostgreSQL
# Copy the connection string from your Neon project dashboard > Connection Details
# Make sure to include ?sslmode=require&channel_binding=require at the end
DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require&channel_binding=require

# Cloudinary
# Find these in your Cloudinary dashboard > Settings > API Keys
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
# Use a long, random string — e.g. openssl rand -base64 48
JWT_SECRET=replace_with_a_long_random_secret
```

`CLOUDINARY_CLOUD_NAME` and `CLIENT_URL` (used for CORS) aren't secret — they live as plain `vars` in `server/wrangler.jsonc`. Edit that file directly to set your Cloudinary cloud name and, before deploying, your production frontend URL.

`server/.env.example` still exists separately for the Node-only tooling (`drizzle-kit`, `seed`, `create-admin`) — copy it to `server/.env` and set `DATABASE_URL` there too, since those scripts run outside the Worker.

---

## 4. Configure the client environment

Nothing is needed for local development. With `VITE_API_URL` unset, the site calls `/api` and the Vite dev server proxies those calls to the local API on port 8787 (see `client/vite.config.ts`). To work on the site with the live data instead, without running the API:

```bash
cd client
API_PROXY=https://mvportfolio-api.sidneygithu.workers.dev pnpm run dev
```

Production builds read `VITE_API_URL` from the committed `client/.env.production`: the API Worker's absolute URL, including `/api`.

> **Important:** Do not set `VITE_API_URL` as a system/shell environment variable. A shell-level value overrides the `.env` files and makes the dev server skip the proxy.

---

## 5. Run database migrations

Drizzle manages the schema. Apply all migrations to your Neon database:

```bash
cd server
pnpm run migrate
```

This reads `drizzle.config.ts` and runs the SQL files in `src/drizzle/migrations/` against your `DATABASE_URL`.

---

## 6. (Optional) Seed demo data

A seed script inserts placeholder projects, skills, experience, education, testimonials and community entries so the portfolio looks populated immediately.

```bash
cd server
pnpm run seed
```

Run this only once. If the database already has data the script may insert duplicates.

---

## 7. Create the admin account

The admin panel is protected by a JWT. An admin account must be created before you can log in.

```bash
cd server
pnpm run create-admin you@example.com YourSecurePassword123
```

- If the email already exists the password is updated instead.
- Passwords must be at least 8 characters.
- Use a strong password — the admin panel gives full write access to all content.

---

## 8. Start both development servers

Open two terminal windows or tabs.

**Terminal 1 — API Worker** (runs on port 8787 via `wrangler dev`):
```bash
cd server
pnpm run dev
```

**Terminal 2 — Vite dev server** (runs on port 5173):
```bash
cd client
pnpm run dev
```

Then open:

- Portfolio site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login
- API docs (Swagger): http://localhost:8787/api/docs

---

## 9. Deploy to Cloudflare

Both apps deploy to Cloudflare as Workers: the API as `mvportfolio-api`, the site as `client`, which serves the built `dist/` as static assets.

When a deploy includes a database migration, run the migration first (`pnpm run migrate` in `server/`, with `DATABASE_URL` set), then deploy the API straight away.

**API Worker:**
```bash
cd server
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
# edit CLIENT_URL and CLOUDINARY_CLOUD_NAME in wrangler.jsonc first, then:
pnpm run deploy
```

**Site (`client` Worker):**
```bash
cd client
# VITE_API_URL in .env.production must point at the deployed API Worker
pnpm run deploy
```

Both run comfortably on Cloudflare's free plan for a personal portfolio's traffic — see the CPU-time note in the environment variable reference below.

---

## Environment Variable Reference

### server/.dev.vars (secrets — `wrangler secret put` in production)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Full Neon/PostgreSQL connection string. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens. |

### server/wrangler.jsonc `vars` (not secret)

| Variable | Required | Description |
|----------|----------|-------------|
| `CLIENT_URL` | Yes | Frontend origin for CORS. Must match the exact URL the browser uses. |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account cloud name. |

> **Free plan note:** Workers on Cloudflare's free plan get 10ms of CPU time per request. Login/register hash passwords with bcrypt at cost factor 10 (tuned down from the original 12) specifically to stay under that budget — don't raise it without checking CPU usage in the dashboard.

### client

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `client/.env.production` | API base URL including `/api`, used by production builds. Leave unset in development. |
| `API_PROXY` | Shell, dev only | Where the dev server sends `/api` calls. Defaults to `http://localhost:8787`. |

---

## Common Issues

**`ERR_CONNECTION_REFUSED` on API calls pointing to the wrong port**
The `VITE_API_URL` shell environment variable is overriding the `.env` file. Run `unset VITE_API_URL` (bash) or `Remove-Item Env:VITE_API_URL` (PowerShell) and restart the Vite dev server.

**`authenticated` routes return 401 immediately**
The JWT token in `localStorage` under key `admin_token` has expired (7-day lifetime) or the `JWT_SECRET` changed. Log out and log in again.

**Migration fails with SSL error**
The `DATABASE_URL` is missing `?sslmode=require` at the end. Neon requires SSL.

**Cloudinary upload returns 400**
Check that `CLOUDINARY_CLOUD_NAME` (in `server/wrangler.jsonc`) and `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` (in `server/.dev.vars`, or set via `wrangler secret put` in production) are all set and correct.
