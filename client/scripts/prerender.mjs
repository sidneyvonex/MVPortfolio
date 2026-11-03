// Writes a complete HTML file for every public page after `vite build`, so search engines, link
// previews and AI tools see each page's content and head tags without running JavaScript. The
// content comes from the live API at build time; the page refreshes it in the browser. Also writes
// sitemap.xml, robots.txt, llms.txt, 404.html and the admin shells.
//
// Runs as the last step of `pnpm build`, after the client build (dist/) and the SSR build
// (dist-ssr/). Files are written as dist/<path>.html: the Worker's static assets serve them at
// /<path>, and 404.html becomes the answer, with a 404 status, for unknown paths.
//
// API address: PRERENDER_API_URL, else VITE_API_URL from .env.production.
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = join(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist')
const SERVER = join(ROOT, 'dist-ssr')

const apiBase = () => {
  if (process.env.PRERENDER_API_URL) return process.env.PRERENDER_API_URL
  const env = readFileSync(join(ROOT, '.env.production'), 'utf8')
  const match = /^VITE_API_URL=(.+)$/m.exec(env)
  if (!match) throw new Error('No API address: set PRERENDER_API_URL or VITE_API_URL in .env.production')
  return match[1].trim()
}

// --- Data: the same collections the browser fetches -------------------------------------------------

const API = apiBase().replace(/\/$/, '')
const get = async (path) => {
  const res = await fetch(`${API}${path}`)
  // A failed fetch must stop the build: deploying pages without content would replace the live site.
  if (!res.ok) throw new Error(`GET ${API}${path} answered ${res.status}`)
  return res.json()
}
const [settings, projects, experience, education, skills, testimonials, community] = await Promise.all(
  ['/settings', '/projects', '/experience', '/education', '/skills', '/testimonials', '/communities'].map(get),
)
const byOrder = (items) => [...items].sort((a, b) => a.order - b.order)
const data = {
  settings,
  projects: byOrder(projects),
  experience: byOrder(experience),
  education: byOrder(education),
  skills: byOrder(skills),
  testimonials: byOrder(testimonials),
  community: byOrder(community),
}

// --- Pages ------------------------------------------------------------------------------------------

const server = await import(pathToFileURL(join(SERVER, 'entry-server.js')).href)
const template = readFileSync(join(DIST, 'index.html'), 'utf8')
for (const marker of ['<!--seo-head-->', '<!--app-html-->', '<!--initial-data-->']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing the ${marker} marker`)
}

// JSON in a non-executing script tag; escaping "<" keeps "</script>" out of it.
const dataTag = `<script type="application/json" id="${server.INITIAL_DATA_ID}">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const page = (head, html, withData = true) =>
  template
    .replace(/<title>[\s\S]*?<\/title>/, () => head.title)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, () => head.description)
    .replace('<!--seo-head-->', () => head.tags)
    .replace('<!--app-html-->', () => html)
    .replace('<!--initial-data-->', () => (withData ? dataTag : ''))

const write = (file, content) => {
  const path = join(DIST, file)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

const pages = server.pagesFor(data)
for (const meta of pages) {
  const html = server.render(meta.path, data)
  if (html.includes("This page doesn't exist")) {
    throw new Error(`${meta.path} rendered the 404 page; check its route and pagesFor() in src/seo/documents.ts`)
  }
  write(meta.path === '/' ? 'index.html' : `${meta.path.slice(1)}.html`, page(server.headFor(meta, data), html))
}

write('404.html', page(server.noindexHead('Page not found'), server.render('/404', data)))

// The admin is not prerendered: an empty root the browser fills in, kept out of search results.
for (const path of ['admin', 'admin/login', 'admin/dashboard']) {
  write(`${path}.html`, page(server.noindexHead('Admin'), '', false))
}

// --- Files for crawlers -----------------------------------------------------------------------------

// The last commit's date stands in for "last changed"; outside git, today.
let lastmod = new Date().toISOString().slice(0, 10)
try {
  lastmod = execSync('git log -1 --format=%cs', { cwd: ROOT, encoding: 'utf8' }).trim() || lastmod
} catch {
  // Not a git checkout.
}

write('sitemap.xml', server.sitemap(pages, lastmod))
write('robots.txt', server.robots())
write('llms.txt', server.llms(pages, data))

rmSync(SERVER, { recursive: true, force: true })
console.log(`Prerendered ${pages.length} pages from ${API} (+ 404, admin shells, sitemap.xml, robots.txt, llms.txt)`)
