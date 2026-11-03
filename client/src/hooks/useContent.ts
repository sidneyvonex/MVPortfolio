import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Community, Education, Experience, Project, Skill, Testimonial } from '../types';

// Everything the admin dashboard manages, one hook per collection, each sorted by its `order`.
// Same query keys everywhere, so a page that shows a collection twice fetches it once.

const byOrder = <T extends { order: number }>(items: T[] | undefined) =>
  [...(items ?? [])].sort((a, b) => a.order - b.order);

const useCollection = <T extends { order: number }>(key: string, fetcher: () => Promise<unknown>) => {
  const query = useQuery({ queryKey: [key], queryFn: fetcher as () => Promise<T[]> });
  return { items: byOrder(query.data), isLoading: query.isLoading, isError: query.isError };
};

export const useProjects = () => useCollection<Project>('projects', api.projects.getAll);
export const useExperience = () => useCollection<Experience>('experience', api.experience.getAll);
export const useEducation = () => useCollection<Education>('education', api.education.getAll);
export const useSkills = () => useCollection<Skill>('skills', api.skills.getAll);
export const useTestimonials = () => useCollection<Testimonial>('testimonials', api.testimonials.getAll);
export const useCommunity = () => useCollection<Community>('community', api.community.getAll);
