import { Link } from 'react-router';
import { imageUrl, projectPath, projectSummary } from '../../lib/format';
import type { Project } from '../../types';
import { Label } from '../ui/Label';

/**
 * Project cover on a paper panel; the title's initials stand in when there is no image yet.
 * Cards crop to one shape; `natural` shows the whole image, as on the case study page.
 */
export const ProjectCover = ({
  project,
  width = 800,
  natural = false,
  className = '',
}: {
  project: Project;
  width?: number;
  natural?: boolean;
  className?: string;
}) => (
  <div className={`relative overflow-hidden border border-line bg-surface-2 ${natural && project.imageUrl ? '' : 'aspect-[16/10]'} ${className}`}>
    {project.imageUrl && natural ? (
      <img src={imageUrl(project.imageUrl, width)} alt={`${project.title} screenshot`} className="block h-auto w-full" />
    ) : project.imageUrl ? (
      <img
        src={imageUrl(project.imageUrl, width)}
        alt=""
        loading="lazy"
        width={width}
        height={Math.round(width * 0.625)}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    ) : (
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <span className="font-display text-5xl font-medium tracking-[-0.04em] text-fg-soft/40">
          {project.title.slice(0, 2)}
        </span>
      </div>
    )}
  </div>
);

/** Card grid of projects: cover, main tech, title and the one-line summary. */
export const WorkGrid = ({ items }: { items: Project[] }) => (
  <ul className="grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
    {items.map((p) => (
      <li key={p.projectId}>
        <Link
          to={projectPath(p)}
          className="group grid gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tangerine-500"
        >
          <ProjectCover project={p} className="transition-transform group-hover:-translate-y-1" />
          <Label className="text-fg-soft">{p.techStack.slice(0, 3).join(' · ')}</Label>
          <h3 className="text-xl leading-tight tracking-[-0.02em] group-hover:text-accent">{p.title}</h3>
          <p className="text-[0.9375rem] text-fg-soft">{projectSummary(p)}</p>
        </Link>
      </li>
    ))}
  </ul>
);
