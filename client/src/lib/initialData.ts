import type { QueryClient } from '@tanstack/react-query';
import type { SiteData } from '../seo/documents';

// Query keys the hooks in useContent/useSettings read. The prerender fills them with the data the
// page was built from, so the browser's first render matches the HTML exactly.
const KEYS: Record<keyof SiteData, string> = {
  settings: 'settings',
  projects: 'projects',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  testimonials: 'testimonials',
  community: 'community',
};

/** Id of the <script type="application/json"> that carries the build's data into the page. */
export const INITIAL_DATA_ID = 'initial-data';

/**
 * Puts the build's data in the cache. In the browser it is marked as old (`updatedAt: 0`), so each
 * collection is fetched again in the background and edits made since the build still show.
 */
export const seedQueryClient = (client: QueryClient, data: Partial<SiteData>, updatedAt = Date.now()) => {
  for (const [field, key] of Object.entries(KEYS) as [keyof SiteData, string][]) {
    if (data[field] !== undefined) client.setQueryData([key], data[field], { updatedAt });
  }
};
