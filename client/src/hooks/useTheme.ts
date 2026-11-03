import { useCallback, useState } from 'react';

export type Theme = 'dark' | 'light';
const KEY = 'kodika-theme';

const current = (): Theme => {
  // Pages may also be rendered to HTML at build time, where there is no document; light is the default.
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
};

/** Reads and switches the site theme. public/theme-init.js applies the saved choice on load. */
export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(current);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Storage can be unavailable; the theme still applies for this visit.
    }
    setThemeState(next);
  }, []);

  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
};
