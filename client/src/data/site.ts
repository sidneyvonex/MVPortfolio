// Site-wide facts and navigation. Content that changes often (projects, experience, links) comes
// from the API through the admin dashboard; this file holds what the page frame needs up front.

export const SITE = {
  name: 'Bensidney Ndungu',
  fullName: 'Bensidney Ndungu',
  role: 'Full stack developer',
  location: 'Kenya',
  /** Canonical address: used for the sitemap, link previews and structured data. */
  url: 'https://sidney.kodikalabs.com',
  /** Fallback until settings load, and for pages rendered before the API is reached. */
  email: 'bensidneyndungu@gmail.com',
  /** Home page title after the name; the phrase the home page should rank for. */
  tagline: 'Full stack developer in Kenya',
  description:
    'Full stack developer in Kenya. Websites, web apps, mobile apps and custom platforms, plus hackathons, short sprints and collaboration projects.',
};

/**
 * Full page title: "Work · Bensidney Ndungu", or the name and tagline on the home page. Shared by
 * the browser (usePageTitle) and the build-time prerender, so both always agree.
 */
export const fullTitle = (title?: string) =>
  title ? `${title} · ${SITE.name}` : `${SITE.name} · ${SITE.tagline}`;

export interface NavItem {
  label: string;
  to: string;
}

/** Top navigation, left to right. */
export const MAIN_MENU: NavItem[] = [
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_PAGES: NavItem[] = [
  { label: 'Home', to: '/' },
  ...MAIN_MENU,
  { label: 'FAQ', to: '/faq' },
  { label: 'Privacy', to: '/privacy' },
];
