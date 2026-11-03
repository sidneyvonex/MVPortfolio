// Everything search engines, link previews and AI tools read, built from the site's own data:
// the list of pages, each page's head tags and structured data (JSON-LD), sitemap.xml, robots.txt
// and llms.txt. scripts/prerender.mjs calls these at build time; nothing here runs in the browser.

import { FAQS } from '../data/faq';
import { SERVICE_GROUPS, SERVICES } from '../data/services';
import { fullTitle, SITE } from '../data/site';
import { projectPath, projectSummary } from '../lib/format';
import type { SettingsMap } from '../services/adminApi';
import type { Community, Education, Experience, Project, Skill, Testimonial } from '../types';

/** The API content a build renders with; the same shapes the browser fetches. */
export interface SiteData {
  settings: SettingsMap;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  testimonials: Testimonial[];
  community: Community[];
}

export interface PageMeta {
  path: string;
  /** Title without the site name; omit for the home page. */
  title?: string;
  description: string;
  /** Breadcrumb trail after Home. */
  crumbs?: { name: string; path: string }[];
}

const OG_IMAGE = `${SITE.url}/og-image.png`;
const PERSON_ID = `${SITE.url}/#person`;

export const urlFor = (path: string) => (path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`);

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// JSON inside <script> must not contain "</script>"; escaping "<" covers it.
const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const clip = (text: string, max = 160) => {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

// --- Pages ----------------------------------------------------------------------------------------

/** Every public page, in sitemap order. Projects come from the API, the rest from code. */
export const pagesFor = (data: SiteData): PageMeta[] => [
  { path: '/', description: SITE.description },
  {
    path: '/services',
    title: 'Services',
    description:
      'Websites, web apps, mobile apps and custom platforms built for you, plus collaboration, hackathons, short sprints and short-term contracts.',
  },
  ...SERVICES.map((s) => ({
    path: `/services/${s.slug}`,
    title: s.seoTitle,
    description: clip(`${s.summary} ${s.intro}`),
    crumbs: [
      { name: 'Services', path: '/services' },
      { name: s.title, path: `/services/${s.slug}` },
    ],
  })),
  {
    path: '/work',
    title: 'Work',
    description: `Projects by ${SITE.name}, built end to end: database, API and the interface people use.`,
  },
  ...data.projects.map((p) => ({
    path: projectPath(p),
    title: p.title,
    description: clip(projectSummary(p)),
    crumbs: [
      { name: 'Work', path: '/work' },
      { name: p.title, path: projectPath(p) },
    ],
  })),
  {
    path: '/about',
    title: 'About',
    description: clip(
      data.settings.aboutBio ||
        `${SITE.name}, full stack developer in ${SITE.location}: experience, skills, education and community.`,
    ),
  },
  {
    path: '/contact',
    title: 'Contact',
    description: `Tell ${SITE.name.split(' ')[0]} about your project, team, hackathon or sprint. Email ${data.settings.email || SITE.email}.`,
  },
  {
    path: '/faq',
    title: 'FAQ',
    description: 'How work starts, how it is priced, which technologies are used and what happens after launch.',
  },
  { path: '/privacy', title: 'Privacy', description: 'What happens to what you send through this site.' },
];

// --- Structured data ------------------------------------------------------------------------------

const person = (data: SiteData) => {
  const s = data.settings;
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    jobTitle: SITE.role,
    description: SITE.description,
    url: `${SITE.url}/`,
    ...(s.heroImageUrl ? { image: s.heroImageUrl } : {}),
    email: `mailto:${s.email || SITE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: s.location || SITE.location, addressCountry: 'KE' },
    sameAs: [s.githubUrl, s.linkedinUrl, s.twitterUrl].filter(Boolean),
    knowsAbout: data.skills.map((k) => k.name),
    ...(data.education[0] ? { alumniOf: { '@type': 'CollegeOrUniversity', name: data.education[0].institution } } : {}),
  };
};

const breadcrumbs = (page: PageMeta) => {
  const trail = [{ name: 'Home', path: '/' }, ...(page.crumbs ?? (page.title ? [{ name: page.title, path: page.path }] : []))];
  if (trail.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: urlFor(item.path),
    })),
  };
};

const pageSpecific = (page: PageMeta, data: SiteData): object[] => {
  const [section, slug] = page.path.split('/').filter(Boolean);
  const url = urlFor(page.path);

  if (page.path === '/') {
    return [
      { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, publisher: { '@id': PERSON_ID } },
      { '@type': 'ProfilePage', url, mainEntity: { '@id': PERSON_ID } },
    ];
  }
  if (page.path === '/about') return [{ '@type': 'ProfilePage', url, mainEntity: { '@id': PERSON_ID } }];
  if (page.path === '/contact') return [{ '@type': 'ContactPage', url, about: { '@id': PERSON_ID } }];
  if (page.path === '/faq') {
    return [
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ];
  }
  if (section === 'services' && slug) {
    const s = SERVICES.find((x) => x.slug === slug);
    if (!s) return [];
    return [
      {
        '@type': 'Service',
        name: s.title,
        serviceType: s.seoTitle,
        category: SERVICE_GROUPS[s.group].label,
        description: s.intro,
        url,
        provider: { '@id': PERSON_ID },
        areaServed: [{ '@type': 'Country', name: 'Kenya' }, 'Remote'],
        keywords: s.keywords.join(', '),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `What ${s.title.toLowerCase()} include`,
          itemListElement: s.includes.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
        },
      },
    ];
  }
  if (section === 'work' && slug) {
    const p = data.projects.find((x) => projectPath(x) === page.path);
    if (!p) return [];
    return [
      {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.description,
        url,
        ...(p.imageUrl ? { image: p.imageUrl } : {}),
        creator: { '@id': PERSON_ID },
        keywords: p.techStack.join(', '),
        ...(p.liveUrl ? { sameAs: p.liveUrl } : {}),
        ...(p.githubUrl ? { codeRepository: p.githubUrl } : {}),
      },
    ];
  }
  return [];
};

// --- Head tags ------------------------------------------------------------------------------------

export interface Head {
  title: string;
  description: string;
  /** Everything else for <head>: canonical, link previews, structured data. */
  tags: string;
}

/** The page's <title>, description, canonical, link-preview and structured-data tags. */
export const headFor = (page: PageMeta, data: SiteData): Head => {
  const title = fullTitle(page.title);
  const url = urlFor(page.path);
  const graph = [person(data), ...pageSpecific(page, data), breadcrumbs(page)].filter(Boolean);
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.path === '/' ? 'profile' : 'website'}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="en_KE" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    jsonLd({ '@context': 'https://schema.org', '@graph': graph }),
  ].join('\n    ');
  return {
    title: `<title>${escapeHtml(title)}</title>`,
    description: `<meta name="description" content="${escapeHtml(page.description)}" />`,
    tags,
  };
};

/** Head for pages search engines should skip: the 404 page and the admin screens. */
export const noindexHead = (title: string): Head => ({
  title: `<title>${escapeHtml(fullTitle(title))}</title>`,
  description: `<meta name="description" content="${escapeHtml(SITE.description)}" />`,
  tags: '<meta name="robots" content="noindex" />',
});

// --- Files ----------------------------------------------------------------------------------------

export const sitemap = (pages: PageMeta[], lastmod: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${urlFor(p.path)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;

export const robots = () => `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE.url}/sitemap.xml
`;

/** Plain-text summary for AI tools (llmstxt.org): who, what, and links to every page. */
export const llms = (pages: PageMeta[], data: SiteData) => {
  const line = (p: PageMeta) => `- [${p.title ?? 'Home'}](${urlFor(p.path)}): ${p.description}`;
  const section = (prefix: string) => pages.filter((p) => p.path.startsWith(prefix)).map(line).join('\n');
  return `# ${SITE.name}

> ${SITE.description}

Based in ${data.settings.location || SITE.location}. Contact: ${data.settings.email || SITE.email}.

## Services

${section('/services/')}

## Work

${section('/work/')}

## About

${pages.filter((p) => ['/about', '/contact', '/faq'].includes(p.path)).map(line).join('\n')}
`;
};
