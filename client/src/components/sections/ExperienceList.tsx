import { formatPeriod } from '../../lib/format';
import type { Education, Experience } from '../../types';
import { Label } from '../ui/Label';
import { TileBullet } from '../ui/TileBullet';

const row = 'grid gap-3 border-b border-line py-6 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8';

/** Work history as rows: period on the left, role and company on the right; `detailed` adds bullets. */
export const ExperienceList = ({ items, detailed = false }: { items: Experience[]; detailed?: boolean }) => (
  <ol className="grid border-t border-line">
    {items.map((e) => (
      <li key={e.experienceId} className={row}>
        <Label className="pt-1.5 text-fg-soft">{formatPeriod(e.startDate, e.endDate)}</Label>
        <div className="grid gap-2">
          <h3 className="text-xl leading-tight tracking-[-0.02em]">{e.role}</h3>
          <p className="text-fg-soft">
            {e.company}
            {e.location ? ` · ${e.location}` : ''}
          </p>
          {detailed && e.bullets && e.bullets.length > 0 && (
            <ul className="mt-2 grid gap-2 text-[0.9375rem]">
              {e.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <TileBullet />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    ))}
  </ol>
);

/** Education in the same row layout, with the school's logo when there is one. */
export const EducationList = ({ items }: { items: Education[] }) => (
  <ol className="grid border-t border-line">
    {items.map((e) => (
      <li key={e.educationId} className={row}>
        <Label className="pt-1.5 text-fg-soft">{formatPeriod(e.startDate, e.endDate)}</Label>
        <div className="flex gap-5">
          {e.logoUrl && (
            <img
              src={e.logoUrl}
              alt=""
              loading="lazy"
              className="size-12 shrink-0 border border-line bg-white object-contain p-1"
            />
          )}
          <div className="grid gap-2">
            <h3 className="text-xl leading-tight tracking-[-0.02em]">{e.degree}</h3>
            <p className="text-fg-soft">{e.institution}</p>
            {e.description && <p className="text-[0.9375rem] text-fg-soft">{e.description}</p>}
          </div>
        </div>
      </li>
    ))}
  </ol>
);
