import type { Skill } from '../../types';
import { Label } from '../ui/Label';

/** Skills grouped by category in a hairline grid, one column per category. */
export const SkillsGrid = ({ items }: { items: Skill[] }) => {
  const groups = new Map<string, Skill[]>();
  for (const s of items) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);

  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {[...groups].map(([category, skills]) => (
        <div key={category} className="grid content-start gap-4 bg-surface p-6">
          <Label dot className="text-fg-soft">
            {category}
          </Label>
          <ul className="grid gap-2.5">
            {skills.map((s) => (
              <li key={s.skillId} className="flex items-center gap-3">
                {s.iconUrl ? (
                  <img src={s.iconUrl} alt="" loading="lazy" className="size-5 shrink-0 object-contain" />
                ) : (
                  <span aria-hidden="true" className="size-5 shrink-0" />
                )}
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

/** Compact cloud of skill names, as on the home page. */
export const SkillsCloud = ({ items }: { items: Skill[] }) => (
  <ul className="flex max-w-[56rem] flex-wrap items-center justify-center gap-2.5 text-[0.9375rem]">
    {items.map((s, i) => (
      <li key={s.skillId}>
        {/* Every third one gets the accent chip so the cloud has rhythm, as on Kodika's home page */}
        <span
          className={`inline-flex px-3 py-1.5 ${i % 3 === 0 ? 'bg-accent-soft text-fg' : 'border border-line text-fg-soft'}`}
        >
          {s.name}
        </span>
      </li>
    ))}
  </ul>
);
