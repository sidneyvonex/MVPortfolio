import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { SettingsMap } from '../services/adminApi';
import { SITE } from '../data/site';


/** Site settings from the admin dashboard, plus the links the page frame needs, with fallbacks. */
export const useSettings = () => {
  const { data: settings, isLoading } = useQuery<SettingsMap>({
    queryKey: ['settings'],
    queryFn: () => api.settings.get() as Promise<SettingsMap>,
    staleTime: 1000 * 60 * 5,
  });

  const email = settings?.email || SITE.email;

  return {
    settings,
    isLoading,
    email,
    // Served by the site's Worker (worker/index.ts), or the dev server's proxy, from the API.
    resumeHref: settings?.resumeUrl ? '/resume.pdf' : null,
    socials: [
      { label: 'GitHub', href: settings?.githubUrl },
      { label: 'LinkedIn', href: settings?.linkedinUrl },
      { label: 'X', href: settings?.twitterUrl },
      { label: 'Email', href: `mailto:${email}` },
    ].filter((s): s is { label: string; href: string } => !!s.href),
  };
};
