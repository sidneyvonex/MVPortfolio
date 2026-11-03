import { useEffect } from 'react';
import { SITE } from '../data/site';

/** One fixed title per page: "Work · Bensidney Ndungu", or the name and role on the home page. */
export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE.name}` : `${SITE.name} · ${SITE.role}`;
  }, [title]);
};
