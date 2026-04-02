import { getToken, clearToken } from '../lib/auth';
import type { Project, Skill, Experience, Education, Community, Testimonial } from '../types';

const BASE = import.meta.env.VITE_API_URL || '/api';

// ── internal HTTP helpers ─────────────────────────────────────────────────────

const authHeaders = (json = true): HeadersInit => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  Authorization: `Bearer ${getToken() ?? ''}`,
});

const handle = async (res: Response) => {
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const msg = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(msg);
  }
  if (res.status === 204) return undefined;
  return res.json();
};

const aGet  = (path: string)                    => fetch(`${BASE}${path}`, { headers: authHeaders() }).then(handle);
const aPost = (path: string, body: unknown)     => fetch(`${BASE}${path}`, { method: 'POST',   headers: authHeaders(), body: JSON.stringify(body) }).then(handle);
const aPut  = (path: string, body: unknown)     => fetch(`${BASE}${path}`, { method: 'PUT',    headers: authHeaders(), body: JSON.stringify(body) }).then(handle);
const aPatch= (path: string, body?: unknown)    => fetch(`${BASE}${path}`, { method: 'PATCH',  headers: authHeaders(), ...(body !== undefined ? { body: JSON.stringify(body) } : {}) }).then(handle);
const aDel  = (path: string)                    => fetch(`${BASE}${path}`, { method: 'DELETE', headers: authHeaders() }).then(handle);

const aUpload = (path: string, field: string, file: File) => {
  const fd = new FormData();
  fd.append(field, file);
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken() ?? ''}` },
    body: fd,
  }).then(handle);
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      if (!res.ok) throw new Error('Invalid credentials');
      return res.json() as Promise<{ token: string }>;
    }),
};

// ── Projects ──────────────────────────────────────────────────────────────────

export const projectsApi = {
  getAll:         ()                           => aGet('/projects')                                     as Promise<Project[]>,
  create:         (d: Partial<Project>)        => aPost('/projects', d)                                 as Promise<Project>,
  update:         (id: number, d: Partial<Project>) => aPut(`/projects/${id}`, d)                      as Promise<Project>,
  delete:         (id: number)                 => aDel(`/projects/${id}`),
  uploadImage:    (id: number, f: File)        => aUpload(`/projects/${id}/image`, 'image', f)          as Promise<{ imageUrl: string }>,
  toggleFeatured: (id: number)                 => aPatch(`/projects/${id}/featured`)                    as Promise<{ featured: boolean }>,
};

// ── Skills ────────────────────────────────────────────────────────────────────

export const skillsApi = {
  getAll:     ()                          => aGet('/skills')                              as Promise<Skill[]>,
  create:     (d: Partial<Skill>)         => aPost('/skills', d)                          as Promise<Skill>,
  update:     (id: number, d: Partial<Skill>) => aPut(`/skills/${id}`, d)                as Promise<Skill>,
  delete:     (id: number)                => aDel(`/skills/${id}`),
  uploadIcon: (id: number, f: File)       => aUpload(`/skills/${id}/icon`, 'icon', f)    as Promise<{ iconUrl: string }>,
};

// ── Experience ────────────────────────────────────────────────────────────────

export const experienceApi = {
  getAll:  ()                              => aGet('/experience')                 as Promise<Experience[]>,
  create:  (d: Partial<Experience>)        => aPost('/experience', d)             as Promise<Experience>,
  update:  (id: number, d: Partial<Experience>) => aPut(`/experience/${id}`, d)  as Promise<Experience>,
  delete:  (id: number)                    => aDel(`/experience/${id}`),
};

// ── Education ─────────────────────────────────────────────────────────────────

export const educationApi = {
  getAll:     ()                             => aGet('/education')                              as Promise<Education[]>,
  create:     (d: Partial<Education>)        => aPost('/education', d)                          as Promise<Education>,
  update:     (id: number, d: Partial<Education>) => aPut(`/education/${id}`, d)               as Promise<Education>,
  delete:     (id: number)                   => aDel(`/education/${id}`),
  uploadLogo: (id: number, f: File)          => aUpload(`/education/${id}/logo`, 'logo', f)    as Promise<{ logoUrl: string }>,
};

// ── Community ─────────────────────────────────────────────────────────────────

export const communityApi = {
  getAll:     ()                              => aGet('/communities')                              as Promise<Community[]>,
  create:     (d: Partial<Community>)         => aPost('/communities', d)                          as Promise<Community>,
  update:     (id: number, d: Partial<Community>) => aPut(`/communities/${id}`, d)                as Promise<Community>,
  delete:     (id: number)                    => aDel(`/communities/${id}`),
  uploadLogo: (id: number, f: File)           => aUpload(`/communities/${id}/logo`, 'logo', f)   as Promise<{ logoUrl: string }>,
};

// ── Testimonials ──────────────────────────────────────────────────────────────

export const testimonialsApi = {
  getAll:        ()                                => aGet('/testimonials')                                  as Promise<Testimonial[]>,
  create:        (d: Partial<Testimonial>)         => aPost('/testimonials', d)                              as Promise<Testimonial>,
  update:        (id: number, d: Partial<Testimonial>) => aPut(`/testimonials/${id}`, d)                    as Promise<Testimonial>,
  delete:        (id: number)                      => aDel(`/testimonials/${id}`),
  uploadAvatar:  (id: number, f: File)             => aUpload(`/testimonials/${id}/avatar`, 'avatar', f)    as Promise<{ avatarUrl: string }>,
};

// ── Contact Messages ──────────────────────────────────────────────────────────

export interface AdminContactMessage {
  contactMessageId: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string | null;
}

export const contactApi = {
  getAll:   ()          => aGet('/contact')                    as Promise<AdminContactMessage[]>,
  markRead: (id: number) => aPatch(`/contact/${id}/read`),
  delete:   (id: number) => aDel(`/contact/${id}`),
};

// ── Settings ──────────────────────────────────────────────────────────────────

export interface SettingsMap {
  tagline?: string;
  heroImageUrl?: string;
  heroFocalPoint?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  aboutBio?: string;
}

export const settingsApi = {
  getAll:        ()               => aGet('/settings')                                       as Promise<SettingsMap>,
  update:        (d: SettingsMap) => aPut('/settings', d),
  uploadHero:    (f: File)        => aUpload('/auth/upload/hero', 'heroImage', f)            as Promise<{ heroImageUrl: string }>,
  uploadResume:  async (f: File)  => {
    const res = await aUpload('/settings/resume/upload', 'resume', f) as { resumeUrl?: string; url?: string };
    return { resumeUrl: res.resumeUrl ?? res.url ?? '' };
  },
};
