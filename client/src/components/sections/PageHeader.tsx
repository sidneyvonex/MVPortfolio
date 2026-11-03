import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Container } from '../ui/Container';

/**
 * Top of every inner page: breadcrumb, headline, lead and actions on the left, and an optional
 * panel on the right (a photo or a fact list).
 */
export const PageHeader = ({
  crumbs,
  title,
  lead,
  aside,
  children,
}: {
  /** Trail after "Home"; the last one is the current page. */
  crumbs: { label: string; to?: string }[];
  title: ReactNode;
  lead?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) => (
  <section className="border-b border-line">
    <Container
      className={`grid items-center gap-12 pt-12 pb-14 md:pt-16 md:pb-20 ${
        aside ? 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16' : ''
      }`}
    >
      <div className="grid gap-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-soft uppercase">
            <li>
              <Link to="/" className="hover:text-fg">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {c.to && i < crumbs.length - 1 ? (
                  <Link to={c.to} className="hover:text-fg">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={i === crumbs.length - 1 ? 'page' : undefined} className="text-fg">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-[18ch] text-[clamp(2.4rem,5.6vw,4.5rem)] leading-[1.02] tracking-[-0.04em]">
          {title}
        </h1>
        {lead && <p className="max-w-[50ch] text-xl leading-normal text-fg-soft">{lead}</p>}
        {children}
      </div>
      {aside}
    </Container>
  </section>
);
