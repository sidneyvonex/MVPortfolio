import { Link } from 'react-router';
import { useSettings } from '../../hooks/useSettings';
import { Container } from '../ui/Container';
import { Label } from '../ui/Label';
import { TileIcon } from '../ui/TileIcon';
import type { IconName } from '../ui/tileIcons';

const bandLink =
  'group inline-flex items-center gap-2 px-4 py-2.5 text-[0.9375rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

/** Full-width Tangerine call to action. One per page at most. */
export const AccentBand = () => (
  <section className="bg-tangerine-500 text-ink">
    <Container className="grid gap-6 py-16 md:py-20">
      <span className="font-mono text-xs tracking-[0.12em] uppercase">Let's build</span>
      <h2 className="max-w-[22ch] text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.05] tracking-[-0.03em]">
        Got a project, a hackathon or a sprint coming up?
      </h2>
      <p className="max-w-[52ch] text-lg">
        Tell me what you are building and where you are with it. I'll reply with a sensible first step.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/contact" className={`${bandLink} bg-ink text-paper-1 hover:bg-ink-2`}>
          Get in touch
          <TileIcon name="arrow-right" size={11} accent="currentColor" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link to="/services" className={`${bandLink} border border-ink/40 hover:bg-ink/10`}>
          See what I offer
          <TileIcon name="arrow-right" size={11} accent="currentColor" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Container>
  </section>
);

/** Closing section above the footer: a short statement on the left, ways to reach me on the right. */
export const CtaBand = ({ title = 'Have something in mind?' }: { title?: string }) => {
  const { email, settings, resumeHref } = useSettings();
  const routes: { icon: IconName; label: string; title: string; to?: string; href?: string }[] = [
    { icon: 'build', label: 'Start here', title: 'Send a message', to: '/contact' },
    { icon: 'mail', label: 'Email', title: email, href: `mailto:${email}` },
    ...(settings?.linkedinUrl
      ? [{ icon: 'team' as IconName, label: 'LinkedIn', title: 'Connect on LinkedIn', href: settings.linkedinUrl }]
      : []),
    ...(resumeHref ? [{ icon: 'download' as IconName, label: 'Résumé', title: 'Download my CV', href: resumeHref }] : []),
  ];

  return (
    <section className="border-t border-line">
      <Container className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="grid gap-4">
          <Label dot className="text-fg-soft">
            Get in touch
          </Label>
          <h2 className="max-w-[14ch] text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.035em]">
            {title}
          </h2>
        </div>
        <ul className="grid border-t border-line">
          {routes.map((r) => {
            const inner = (
              <>
                <span className="grid size-10 place-items-center border border-line">
                  <TileIcon name={r.icon} size={18} className="text-fg" />
                </span>
                <span className="grid min-w-0 gap-0.5">
                  <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg-soft uppercase">
                    {r.label}
                  </span>
                  <span className="truncate text-lg font-medium tracking-[-0.01em]">{r.title}</span>
                </span>
                <TileIcon
                  name={r.to ? 'arrow-right' : 'arrow-up-right'}
                  size={12}
                  accent="currentColor"
                  className="text-fg-soft transition-transform group-hover:translate-x-1 group-hover:text-fg"
                />
              </>
            );
            const cls =
              'group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-5 border-b border-line py-5 transition-colors hover:bg-surface-2 md:px-3';
            return (
              <li key={r.label}>
                {r.to ? (
                  <Link to={r.to} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={r.href}
                    className={cls}
                    target={r.href?.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};
