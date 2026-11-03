import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';
const KEY = 'kodika-theme';

const read = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

// Every switch on the page re-renders when <html data-theme> changes, whoever changed it.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

const setTheme = (next: Theme) => {
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Storage can be unavailable; the theme still applies for this visit.
  }
};

/**
 * Reads and switches the site theme. public/theme-init.js applies the saved choice before paint.
 * Pages are prerendered in light, so the first render while hydrating also reports light (the
 * server snapshot) and React then switches the icon to the real theme without a mismatch.
 */
export const useTheme = () => {
  const theme = useSyncExternalStore<Theme>(subscribe, read, () => 'light');
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
};
