import { useEffect } from 'react';
import { fullTitle } from '../data/site';

/** One fixed title per page: "Work · Bensidney Ndungu", or the name and tagline on the home page. */
export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = fullTitle(title);
  }, [title]);
};
