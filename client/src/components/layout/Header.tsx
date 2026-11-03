import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { MAIN_MENU } from '../../data/site';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ThemeToggle } from '../ui/ThemeToggle';
import { TileIcon } from '../ui/TileIcon';
import { MobileMenu } from './MobileMenu';
import { Wordmark } from './Wordmark';

const topLink =
  'inline-flex items-center gap-1.5 px-3 py-2 text-[0.9375rem] font-medium transition-colors hover:text-fg';

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resumeHref } = useSettings();

  // Escape closes the mobile menu; its links close it through onNavigate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link to="/" className="shrink-0" aria-label="Home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {MAIN_MENU.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `${topLink} ${isActive ? 'text-fg' : 'text-fg-soft'}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* On small screens these live in the mobile menu */}
          <div className="hidden items-center gap-1 md:flex">
            <ThemeToggle />
            {resumeHref && (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${topLink} text-fg-soft`}
              >
                Résumé
                <TileIcon name="download" size={11} />
              </a>
            )}
          </div>
          <div className="hidden md:block">
            <Button to="/contact">Get in touch</Button>
          </div>
          <button
            type="button"
            className="-mr-2 p-2 text-fg md:hidden"
            aria-label={mobileOpen ? 'Close' : 'Menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <TileIcon name={mobileOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </Container>

      {mobileOpen && <MobileMenu onNavigate={() => setMobileOpen(false)} />}
    </header>
  );
};
