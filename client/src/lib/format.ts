import type { Project } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2025-05" or "2025-05-01" -> "May 2025"; anything else ("May 2024", "2025") is shown as typed. */
export const formatMonth = (value: string): string => {
  const m = /^(\d{4})-(\d{2})/.exec(value.trim());
  if (!m) return value.trim();
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : m[1];
};

/** "May 2025 – Jul 2025", or "– Present" when there is no end date. */
export const formatPeriod = (start: string | null, end: string | null): string => {
  const from = start ? formatMonth(start) : '';
  const to = end ? formatMonth(end) : 'Present';
  return from ? `${from} – ${to}` : to;
};

/** Splits admin text into paragraphs on blank lines (or single line breaks). */
export const paragraphs = (text: string | null | undefined): string[] =>
  (text ?? '')
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Case study address. Falls back to the id for projects saved before slugs existed. */
export const projectPath = (p: Pick<Project, 'slug' | 'projectId'>) =>
  `/work/${p.slug || p.projectId}`;

const SUMMARY_MAX = 170;

/**
 * Card text: the summary, or until one is written, the description's first sentence, cut at a
 * word boundary when it runs long.
 */
export const projectSummary = (p: Pick<Project, 'summary' | 'description'>) => {
  if (p.summary) return p.summary;
  const text = p.description.trim();
  const first = (/^.*?[.!?](\s|$)/.exec(text)?.[0] ?? text).trim();
  if (first.length <= SUMMARY_MAX) return first;
  const cut = first.slice(0, SUMMARY_MAX);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
};

/**
 * Cloudinary images resized and converted on delivery (WebP/AVIF where the browser supports it).
 * Other URLs are returned unchanged.
 */
export const imageUrl = (url: string, width: number) =>
  url.includes('/image/upload/')
    ? url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`)
    : url;
