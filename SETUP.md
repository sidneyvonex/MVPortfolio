# Setup Guide

This document covers everything needed to run the portfolio project locally, from prerequisites to creating your first admin account.

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 20 | LTS recommended |
| pnpm | 9 | Used in both workspaces |
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

Create `server/.env` by copying the example:

```bash
cp server/.env.example server/.env
```

Then fill in every value — none have safe defaults in production:

```env
# Express
PORT=5000

# Neon PostgreSQL
# Copy the connection string from your Neon project dashboard > Connection Details
# Make sure to include ?sslmode=require&channel_binding=require at the end
DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require&channel_binding=require

# Cloudinary
# Find these in your Cloudinary dashboard > Settings > API Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
# Use a long, random string — e.g. openssl rand -base64 48
JWT_SECRET=replace_with_a_long_random_secret

# CORS — the URL of your frontend dev server
CLIENT_URL=http://localhost:5173
```

---

## 4. Configure the client environment

Create `client/.env`:

```bash
cp client/.env.example client/.env   # or create manually
```

Contents:

```env
# Full base URL of the Express API (including /api)
# During local development this value is also used to configure the Vite proxy
VITE_API_URL=http://localhost:5000/api
```

> **Important:** Do not set `VITE_API_URL` as a system/shell environment variable. A shell-level value overrides the `.env` file and may cause the client to bypass the proxy.

---

## 5. Run database migrations

Drizzle manages the schema. Apply all migrations to your Neon database:

```bash
cd server
pnpm migrate
```

This reads `drizzle.config.ts` and runs the SQL files in `src/drizzle/migrations/` against your `DATABASE_URL`.

---

## 6. (Optional) Seed demo data

A seed script inserts placeholder projects, skills, experience, education, testimonials and community entries so the portfolio looks populated immediately.

```bash
cd server
pnpm seed
```

Run this only once. If the database already has data the script may insert duplicates.

---

## 7. Create the admin account

The admin panel is protected by a JWT. An admin account must be created before you can log in.

```bash
cd server
pnpm create-admin you@example.com YourSecurePassword123
```

- If the email already exists the password is updated instead.
- Passwords must be at least 8 characters.
- Use a strong password — the admin panel gives full write access to all content.

---

## 8. Start both development servers

Open two terminal windows or tabs.

**Terminal 1 — API server** (runs on port 5000):
```bash
cd server
pnpm dev
```

**Terminal 2 — Vite dev server** (runs on port 5173):
```bash
cd client
pnpm dev
```

Then open:

- Portfolio site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login
- API docs (Swagger): http://localhost:5000/api/docs

---

## 9. Build for production

```bash
# Build the client (outputs to client/dist/)
cd client
pnpm build

# Compile the server (outputs to server/dist/)
cd ../server
pnpm build
```

To serve the compiled server:

```bash
cd server
pnpm start
```

For deployment, serve the `client/dist/` folder from a static host (Vercel, Netlify, Cloudflare Pages) and deploy the server to a Node.js host. This project currently deploys the server to **Render** (see `render.yaml` at the repo root — a Blueprint that defines the web service, build/start commands, and required env var names; set the actual values in the Render dashboard). Set the same environment variables on whichever platform you use.

---

## Environment Variable Reference

### server/.env

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Port the Express server listens on. Defaults to `5000`. |
| `DATABASE_URL` | Yes | Full Neon/PostgreSQL connection string. |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account cloud name. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens. |
| `CLIENT_URL` | Yes | Frontend origin for CORS. Must match the exact URL the browser uses. |

### client/.env

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Base URL of the API including `/api`. Used as the fetch base and Vite proxy target. |

---

## Common Issues

**`ERR_CONNECTION_REFUSED` on API calls pointing to the wrong port**
The `VITE_API_URL` shell environment variable is overriding the `.env` file. Run `unset VITE_API_URL` (bash) or `Remove-Item Env:VITE_API_URL` (PowerShell) and restart the Vite dev server.

**`authenticated` routes return 401 immediately**
The JWT token in `localStorage` under key `admin_token` has expired (7-day lifetime) or the `JWT_SECRET` changed. Log out and log in again.

**Migration fails with SSL error**
The `DATABASE_URL` is missing `?sslmode=require` at the end. Neon requires SSL.

**Cloudinary upload returns 400**
Check that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are all set and correct in `server/.env`.
