import { Link } from 'react-router';
import { SERVICE_GROUPS, servicesIn, type ServiceGroup } from '../../data/services';
import { FOOTER_PAGES, SITE } from '../../data/site';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { TileIcon } from '../ui/TileIcon';
import { Wordmark } from './Wordmark';

// Heights (in blocks) of the stepped "skyline" along the bottom edge, mirrored at the far end.
// Shades: 0 tangerine 500, 1 light (300), 2 dark (600). Same skyline as Kodika Labs.
const SKYLINE: [number, number][] = [
  [4, 0], [3, 1], [3, 0], [2, 0], [2, 2], [1, 1], [1, 0], [0, 0],
  [0, 0], [0, 0], [1, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
  [0, 0], [1, 1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
];
const SHADES = ['#ff6a1f', '#fda271', '#da5c1d'];

const Skyline = () => {
  const cols = [...SKYLINE, ...[...SKYLINE].reverse()];
  const rows = 5;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${cols.length} ${rows}`}
      preserveAspectRatio="none"
      className="block h-10 w-full md:h-16"
    >
      {cols.flatMap(([height, shade], x) =>
        Array.from({ length: height + 1 }, (_, i) => (
          <rect
            key={`${x}-${i}`}
            x={x}
            y={rows - 1 - i}
            width="1"
            height="1"
            fill={SHADES[i === height ? shade : 0]}
          />
        )),
      )}
    </svg>
  );
};

const colTitle = 'font-mono text-[0.6875rem] tracking-[0.12em] text-fg-soft uppercase';

export const Footer = () => {
  const { email, socials, resumeHref } = useSettings();
  return (
    <footer className="border-t border-line bg-surface text-fg">
      <Container className="grid gap-14 pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:gap-10">
          <div className="grid content-start gap-5">
            <Wordmark className="justify-self-start" />
            <p className="max-w-[38ch] text-fg-soft">{SITE.description}</p>
            <a
              href={`mailto:${email}`}
              className="justify-self-start font-medium break-all underline decoration-tangerine-500 underline-offset-4 hover:text-accent"
            >
              {email}
            </a>
            <div>
              <Button to="/contact">Get in touch</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-4">
            {(['build', 'collaborate'] as ServiceGroup[]).map((group) => (
              <nav key={group} aria-label={SERVICE_GROUPS[group].label} className="grid content-start gap-4">
                <span className={colTitle}>{SERVICE_GROUPS[group].label}</span>
                <ul className="grid gap-2.5 text-[0.9375rem]">
                  {servicesIn(group).map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} className="transition-colors hover:text-accent">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <nav aria-label="Pages" className="grid content-start gap-4">
              <span className={colTitle}>Pages</span>
              <ul className="grid gap-2.5 text-[0.9375rem]">
                {FOOTER_PAGES.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Elsewhere" className="grid content-start gap-4">
              <span className={colTitle}>Elsewhere</span>
              <ul className="grid gap-2.5 text-[0.9375rem]">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
                {resumeHref && (
                  <li>
                    <a
                      href={resumeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      Résumé
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm text-fg-soft">
          <span>
            © {new Date().getFullYear()} {SITE.fullName}.
          </span>
          <a href="#main" className="group inline-flex items-center gap-2 hover:text-fg">
            Back to top
            <TileIcon
              name="arrow-up-right"
              size={10}
              accent="currentColor"
              className="-rotate-45 transition-transform group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </Container>
      <Skyline />
    </footer>
  );
};
