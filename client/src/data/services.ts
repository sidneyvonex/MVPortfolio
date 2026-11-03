// What I offer: the main content people search for. Each service gets its own page at
// /services/<slug>, its own title and description, and an entry in the sitemap.
// Plain data only: the build-time prerender loads this file in Node too.

import type { IconName } from '../components/ui/tileIcons';

export type ServiceGroup = 'build' | 'collaborate';

export interface Service {
  slug: string;
  group: ServiceGroup;
  icon: IconName;
  title: string;
  /** One line for cards and the page description. */
  summary: string;
  /** Opening paragraph of the service page. */
  intro: string;
  /** What is part of it. */
  includes: string[];
  /** Who it suits, one short paragraph. */
  forWho: string;
  /** How it runs, in order. */
  steps: { title: string; body: string }[];
  /** Phrases people search for; used in the page description and structured data. */
  keywords: string[];
}

export const SERVICE_GROUPS: Record<ServiceGroup, { label: string; title: string; lead: string }> = {
  build: {
    label: 'Build for you',
    title: 'Products, from idea to launch.',
    lead: 'You bring the problem; I design, build and ship the software, then keep improving it.',
  },
  collaborate: {
    label: 'Build with you',
    title: 'An extra developer on your team.',
    lead: 'For teams, hackathons and short pushes that need someone who can work across the stack.',
  },
};

export const SERVICES: Service[] = [
  // Build for you
  {
    slug: 'websites',
    group: 'build',
    icon: 'websites',
    title: 'Websites',
    summary: 'Fast, search-friendly websites for businesses, organisations and personal brands.',
    intro:
      'A website that loads quickly, reads well on a phone and shows up when people search for what you do. Built to be easy to update after launch.',
    includes: [
      'Business and organisation websites',
      'Landing pages for a product or campaign',
      'Portfolios and personal sites',
      'Content you can edit yourself',
      'Search engine basics: titles, sitemap, link previews',
      'Hosting, domain and analytics setup',
    ],
    forWho:
      'Small businesses, organisations and founders who need a site that works, without hiring an agency.',
    steps: [
      { title: 'Talk', body: 'What the site is for, who it is for, and what it must do on day one.' },
      { title: 'Design', body: 'The key pages laid out and agreed before any building starts.' },
      { title: 'Build', body: 'Developed, tested on phones and desktops, and filled with your content.' },
      { title: 'Launch', body: 'Live on your domain, with a short handover so you can update it.' },
    ],
    keywords: ['website developer Kenya', 'business website', 'landing page developer'],
  },
  {
    slug: 'web-apps',
    group: 'build',
    icon: 'web-apps',
    title: 'Web apps',
    summary: 'Dashboards, portals and internal tools built around how your team actually works.',
    intro:
      'Software that runs in the browser: customer portals, admin dashboards and tools that replace spreadsheets and manual steps. Front end, back end and database, built together.',
    includes: [
      'Admin dashboards and internal tools',
      'Customer and member portals',
      'Sign-in, roles and permissions',
      'REST APIs and database design',
      'Integrations with the services you already use',
      'Deployment, monitoring and backups',
    ],
    forWho:
      'Teams with a process that has outgrown spreadsheets, and founders turning an idea into a working product.',
    steps: [
      { title: 'Map', body: 'The people who will use it, what they do today and what should change.' },
      { title: 'Prototype', body: 'The main screens, clickable, so the idea can be tested early.' },
      { title: 'Build', body: 'In short cycles, each ending with something you can try.' },
      { title: 'Launch and iterate', body: 'Released to real users, then improved from what they do.' },
    ],
    keywords: ['web app developer', 'full stack developer Kenya', 'React developer', 'dashboard development'],
  },
  {
    slug: 'mobile-apps',
    group: 'build',
    icon: 'mobile-apps',
    title: 'Mobile apps',
    summary: 'iOS and Android apps, from the first clickable prototype to the app stores.',
    intro:
      'Apps for phones, built from one codebase for iOS and Android, sharing a back end with your web app where that makes sense.',
    includes: [
      'Cross-platform apps for iOS and Android',
      'Clickable prototypes to test ideas first',
      'Sign-in, notifications and offline use',
      'The back end and API the app talks to',
      'App Store and Google Play submission',
    ],
    forWho:
      'Businesses whose customers live on their phones, and founders who need an app to test with real users.',
    steps: [
      { title: 'Shape', body: 'The few things the app must do well, and who it is for.' },
      { title: 'Prototype', body: 'A clickable version on your own phone before building.' },
      { title: 'Build', body: 'The app and its back end, tested on real devices.' },
      { title: 'Release', body: 'Submitted to the stores, then updated as feedback comes in.' },
    ],
    keywords: ['mobile app developer Kenya', 'Android app developer', 'iOS app developer'],
  },
  {
    slug: 'custom-platforms',
    group: 'build',
    icon: 'custom-platforms',
    title: 'Custom platforms',
    summary: 'Booking, payments, marketplaces and the other systems a business runs on.',
    intro:
      'Larger systems with several kinds of users and money moving through them: bookings, marketplaces, subscriptions. Designed so they keep working as the business grows.',
    includes: [
      'Booking and scheduling systems',
      'Marketplaces with buyers, sellers and admins',
      'M-Pesa and card payments',
      'Subscriptions and invoicing',
      'Reporting and data exports',
      'Integrations with third-party APIs',
    ],
    forWho:
      'Businesses that need software no off-the-shelf product quite fits, and want to own what they build.',
    steps: [
      { title: 'Discover', body: 'Every kind of user, every flow of money and data, written down.' },
      { title: 'Design', body: 'The system and its key screens, agreed before building.' },
      { title: 'Build in stages', body: 'The most valuable part first, live early, the rest after.' },
      { title: 'Run', body: 'Monitored after launch, with fixes and improvements as needed.' },
    ],
    keywords: ['custom software Kenya', 'M-Pesa integration developer', 'marketplace developer', 'booking system developer'],
  },

  // Build with you
  {
    slug: 'collaboration',
    group: 'collaborate',
    icon: 'team',
    title: 'Collaboration projects',
    summary: 'Building with other developers on side projects, open source and products in progress.',
    intro:
      'I like building with other developers. If you have a project that needs another pair of hands across the front end, back end or database, I am open to joining.',
    includes: [
      'Joining an existing side project or startup idea',
      'Open-source contributions',
      'Pairing on features across the stack',
      'Code reviews and technical discussions',
    ],
    forWho:
      'Developers and small teams with a project worth building, looking for a reliable collaborator.',
    steps: [
      { title: 'Say hello', body: 'What the project is, where it stands and where you need help.' },
      { title: 'Agree the scope', body: 'What I take on, how we communicate and how often we meet.' },
      { title: 'Build together', body: 'Shared repository, small pull requests, regular check-ins.' },
    ],
    keywords: ['developer to collaborate with', 'open source contributor', 'side project developer'],
  },
  {
    slug: 'hackathons',
    group: 'collaborate',
    icon: 'early',
    title: 'Hackathons',
    summary: 'A full stack teammate who can get a working demo built under time pressure.',
    intro:
      'Hackathons reward teams that can go from idea to working demo fast. I can cover the front end, the back end and the deployment, so the team spends its time on the idea.',
    includes: [
      'Turning the idea into a buildable plan in the first hours',
      'Front end, back end and database',
      'Deploying a live demo',
      'Preparing the demo for judging',
    ],
    forWho: 'Teams forming for a hackathon who need a developer who can work across the stack.',
    steps: [
      { title: 'Team up', body: 'Tell me the event, the dates and the team so far.' },
      { title: 'Plan', body: 'Agree the smallest version that shows the idea well.' },
      { title: 'Build and demo', body: 'Build it, deploy it, and present something that works.' },
    ],
    keywords: ['hackathon teammate', 'hackathon developer Kenya', 'full stack hackathon'],
  },
  {
    slug: 'sprints',
    group: 'collaborate',
    icon: 'ship',
    title: 'Short sprints',
    summary: 'One or two focused weeks on a single goal: an MVP, a feature or a fix.',
    intro:
      'Some work has a clear goal and a short deadline. A sprint is one or two weeks spent on exactly that, ending with something shipped.',
    includes: [
      'A first version (MVP) of a product idea',
      'One feature added to an existing product',
      'Fixing performance, bugs or a broken deployment',
      'Moving an app to new hosting, such as Cloudflare',
    ],
    forWho: 'Founders and teams with one well-defined piece of work and a date it must be done by.',
    steps: [
      { title: 'Define', body: 'One goal, written down, with what "done" looks like.' },
      { title: 'Build', body: 'Daily progress you can see, in your repository.' },
      { title: 'Hand over', body: 'Shipped, documented and explained at the end of the sprint.' },
    ],
    keywords: ['MVP developer', 'freelance developer short project', 'one week sprint developer'],
  },
  {
    slug: 'short-term-contracts',
    group: 'collaborate',
    icon: 'stay',
    title: 'Short-term contracts',
    summary: 'Extra hands on an existing team for a set number of weeks or months.',
    intro:
      'When a team has more work than people for a while, I can join for a fixed period, work in your tools and process, and leave the code in good shape.',
    includes: [
      'Working inside your team, tools and process',
      'Front end, back end or full stack tickets',
      'Covering for a teammate on leave',
      'Clear handover notes when the contract ends',
    ],
    forWho: 'Teams with a deadline, a backlog or a gap, who need a developer for a set period.',
    steps: [
      { title: 'Talk', body: 'The work, the team, the length and how many hours a week.' },
      { title: 'Onboard', body: 'Access, a walkthrough of the codebase, and a first small task.' },
      { title: 'Deliver', body: 'Regular work through your process until the contract ends.' },
    ],
    keywords: ['contract developer Kenya', 'remote full stack developer', 'short-term developer'],
  },
];

export const servicesIn = (group: ServiceGroup) => SERVICES.filter((s) => s.group === group);
