// Build-time renderer, bundled by `vite build --ssr` and used only by scripts/prerender.mjs.
// It renders a route to HTML with the API data the build fetched, and re-exports the SEO helpers.

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { seedQueryClient } from './lib/initialData';
import type { SiteData } from './seo/documents';

export { headFor, llms, noindexHead, pagesFor, robots, sitemap } from './seo/documents';
export { INITIAL_DATA_ID } from './lib/initialData';

/** The route's HTML with `data` already in place, as the browser will first render it. */
export const render = (url: string, data: SiteData) => {
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
  seedQueryClient(client, data);
  return renderToString(
    <StrictMode>
      <QueryClientProvider client={client}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
};
