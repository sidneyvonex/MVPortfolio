// The site's Worker. Static files (the prerendered pages, scripts, images) are served straight from
// dist/ without running this code; Cloudflare only calls it for the paths in `run_worker_first`
// (wrangler.jsonc), which it hands to the API Worker over a service binding. So the API answers on
// the site's own domain, without CORS, and the résumé has a clean address.

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  /** The `mvportfolio-api` Worker. */
  API: Fetcher;
  /** The site's static files. */
  ASSETS: Fetcher;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // sidney.kodikalabs.com/resume.pdf -> the API's résumé download (saved as resume.pdf).
    if (url.pathname === '/resume.pdf') {
      return env.API.fetch(new Request(new URL('/api/settings/resume/download', url), request));
    }

    if (url.pathname.startsWith('/api/')) {
      return env.API.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
