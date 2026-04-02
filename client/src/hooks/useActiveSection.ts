import { useState, useEffect } from 'react';

export const sections = [
  { id: 'hero',         label: 'Home' },
  { id: 'about',        label: 'About' },
  { id: 'resume',       label: 'Resume' },
  { id: 'skills',       label: 'Skills' },
  { id: 'portfolio',    label: 'Portfolio' },
  { id: 'education',    label: 'Education' },
  { id: 'community',    label: 'Community' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact',      label: 'Contact' },
];

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      const navbarHeight = window.innerWidth >= 1024 ? 72 : 64;
      const anchor = window.scrollY + navbarHeight + window.innerHeight * 0.25;

      let current = sections[0]?.id ?? 'hero';

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= anchor) current = id;
      }

      setActiveSection(current);
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveSection);
    };

    onScrollOrResize();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const navbarHeight = window.innerWidth >= 1024 ? 72 : 64;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top: Math.max(0, sectionTop), behavior: 'smooth' });
  };

  return { activeSection, scrollToSection };
};