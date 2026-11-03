import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from './Footer';
import { Header } from './Header';

export const Layout = () => {
  const { pathname, hash } = useLocation();

  // New page: start at the top, or at the section named in the hash (e.g. /#contact).
  // Braces matter: current browsers return a Promise from scrollTo, and an effect must return
  // nothing or a cleanup function.
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page rails: two hairlines at the edges of the content column, running over every section */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 hidden md:block">
        <div className="mx-auto h-full max-w-[1200px] border-x border-line" />
      </div>
      <a
        href="#main"
        className="sr-only z-50 bg-surface-2 px-4 py-2 text-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 scroll-mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
