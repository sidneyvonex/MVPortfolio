// Site-wide facts and navigation. Content that changes often (projects, experience, links) comes
// from the API through the admin dashboard; this file holds what the page frame needs up front.

export const SITE = {
  name: 'Bensidney Githu',
  fullName: "Bensidney Githu Ndung'u",
  role: 'Full stack developer',
  location: 'Kenya',
  /** Fallback until settings load, and for pages rendered before the API is reached. */
  email: 'bensidneyndungu@gmail.com',
  description:
    'Full stack developer in Kenya. Websites, web apps, mobile apps and custom platforms, plus hackathons, short sprints and collaboration projects.',
};

export interface NavItem {
  label: string;
  to: string;
}

/** Top navigation, left to right. Services and FAQ join once their pages exist. */
export const MAIN_MENU: NavItem[] = [
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_PAGES: NavItem[] = [{ label: 'Home', to: '/' }, ...MAIN_MENU];
