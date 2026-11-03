import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router';
import { MAIN_MENU } from '../../data/site';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { TileIcon } from '../ui/TileIcon';

/**
 * Full-screen menu for small screens: the pages as large rows, then the main call to action,
 * the résumé, the email and the theme switch. The page behind does not scroll while it is open.
 */
export const MobileMenu = ({ onNavigate }: { onNavigate: () => void }) => {
  const { theme, toggle } = useTheme();
  const { email, resumeHref } = useSettings();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Rendered into <body>: the header's backdrop blur would otherwise become the containing block
  // for this fixed element and shrink it to the header's height.
  return createPortal(
    <nav
      id="mobile-menu"
      aria-label="Mobile"
      className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-surface md:hidden"
    >
      <Container className="grid min-h-full content-between gap-10 pt-2 pb-8">
        <ul className="grid">
          {[{ label: 'Home', to: '/' }, ...MAIN_MENU].map((item) => (
            <li key={item.to} className="border-b border-line">
              <NavLink
                to={item.to}
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center justify-between py-5 text-2xl font-medium tracking-[-0.02em] ${isActive ? 'text-fg' : 'text-fg-soft'}`
                }
              >
                {item.label}
                <TileIcon name="arrow-right" size={12} accent="currentColor" className="text-fg-soft" />
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="grid gap-5">
          <div className="flex flex-wrap gap-3">
            <Button to="/contact" onClick={onNavigate}>
              Get in touch
            </Button>
            {resumeHref && (
              <Button href={resumeHref} variant="ghost" download>
                Résumé
              </Button>
            )}
          </div>
          <div className="grid gap-1">
            <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg-soft uppercase">
              Email
            </span>
            <a href={`mailto:${email}`} className="text-lg font-medium break-all">
              {email}
            </a>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="flex items-center justify-between border-t border-line pt-5 text-left"
          >
            <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg-soft uppercase">
              Theme
            </span>
            <span className="inline-flex items-center gap-2 text-sm">
              <TileIcon name={theme === 'dark' ? 'moon' : 'sun'} size={14} />
              {theme === 'dark' ? 'Dark' : 'Light'}
              <span className="text-fg-soft">· switch</span>
            </span>
          </button>
        </div>
      </Container>
    </nav>,
    document.body,
  );
};
