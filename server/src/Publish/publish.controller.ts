import type { Context } from 'hono';
import type { AppEnv } from '../types/env';

// The admin's "Publish site" button: asks GitHub to run .github/workflows/deploy-site.yml, which
// rebuilds every prerendered page from the current content and deploys the site.

const WORKFLOW_FILE = 'deploy-site.yml';

const github = (c: Context<AppEnv>, path: string, init: RequestInit = {}) =>
    fetch(`https://api.github.com/repos/${c.env.GITHUB_REPO}${path}`, {
        ...init,
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${c.env.GITHUB_TOKEN}`,
            'User-Agent': 'portfolio-publish',
            'X-GitHub-Api-Version': '2022-11-28',
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        },
    });

const notConfigured = (c: Context<AppEnv>) =>
    !c.env.GITHUB_TOKEN || !c.env.GITHUB_REPO
        ? c.json({ error: 'Publishing is not set up: GITHUB_TOKEN and GITHUB_REPO are missing on the API' }, 503)
        : null;

// POST /api/publish — start a rebuild and deploy (admin only)
export const publishSite = async (c: Context<AppEnv>) => {
    const missing = notConfigured(c);
    if (missing) return missing;
    try {
        const res = await github(c, '/dispatches', {
            method: 'POST',
            body: JSON.stringify({ event_type: 'publish-site' }),
        });
        if (!res.ok) {
            return c.json({ error: `GitHub refused the publish request (${res.status})` }, 502);
        }
        return c.json({ message: 'Publishing started. The site updates in about two minutes.' }, 202);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/publish — the latest deploy run: queued, in_progress or completed, and its result (admin only)
export const getPublishStatus = async (c: Context<AppEnv>) => {
    const missing = notConfigured(c);
    if (missing) return missing;
    try {
        const res = await github(c, `/actions/workflows/${WORKFLOW_FILE}/runs?per_page=1`);
        if (!res.ok) {
            return c.json({ error: `GitHub answered ${res.status}` }, 502);
        }
        const body = (await res.json()) as {
            workflow_runs: { status: string; conclusion: string | null; created_at: string; updated_at: string; html_url: string }[];
        };
        const run = body.workflow_runs[0];
        if (!run) return c.json({ status: 'none' }, 200);
        return c.json({
            status: run.status,
            conclusion: run.conclusion,
            startedAt: run.created_at,
            updatedAt: run.updated_at,
            url: run.html_url,
        }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
