import type { Community, Testimonial } from '../../types';
import { Label } from '../ui/Label';
import { TileIcon } from '../ui/TileIcon';

/** Quotes in a hairline grid: the words first, then who said them. */
export const TestimonialGrid = ({ items }: { items: Testimonial[] }) => (
  <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
    {items.map((t) => (
      <li key={t.testimonialId} className="grid content-between gap-8 bg-surface p-6 md:p-8">
        <blockquote className="text-lg leading-relaxed tracking-[-0.01em]">“{t.message}”</blockquote>
        <div className="flex items-center gap-4">
          {t.avatarUrl ? (
            <img src={t.avatarUrl} alt="" loading="lazy" className="size-11 shrink-0 object-cover" />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center bg-accent-soft font-medium"
            >
              {t.name.charAt(0)}
            </span>
          )}
          <div className="grid gap-0.5">
            <span className="font-medium">{t.name}</span>
            <Label className="text-fg-soft">{t.role}</Label>
          </div>
        </div>
      </li>
    ))}
  </ul>
);

/** Communities as cards with logo, role and a link to more when there is one. */
export const CommunityList = ({ items }: { items: Community[] }) => (
  <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
    {items.map((c) => (
      <li key={c.communityId} className="grid content-start gap-4 bg-surface p-6 md:p-8">
        <div className="flex items-center gap-4">
          {c.logoUrl && (
            <img
              src={c.logoUrl}
              alt=""
              loading="lazy"
              className="size-12 shrink-0 border border-line bg-white object-contain p-1"
            />
          )}
          <div className="grid gap-0.5">
            <h3 className="text-xl leading-tight tracking-[-0.02em]">{c.name}</h3>
            {c.role && <Label className="text-fg-soft">{c.role}</Label>}
          </div>
        </div>
        {c.description && <p className="text-[0.9375rem] leading-relaxed text-fg-soft">{c.description}</p>}
        {c.bioUrl && (
          <a
            href={c.bioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 justify-self-start text-[0.9375rem] font-medium"
          >
            Learn more
            <TileIcon name="arrow-up-right" size={10} accent="currentColor" />
          </a>
        )}
      </li>
    ))}
  </ul>
);
