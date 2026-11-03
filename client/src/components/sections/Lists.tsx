import type { Faq } from '../../data/faq';
import { TileIcon } from '../ui/TileIcon';

/** Numbered steps in a hairline grid, as on Kodika's process section. */
export const ProcessSteps = ({ steps }: { steps: { title: string; body: string }[] }) => (
  <ol
    className={`grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 ${
      steps.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
    }`}
  >
    {steps.map((step, i) => (
      <li key={step.title} className="grid content-start gap-3 bg-surface p-6">
        <span className="mb-3 font-mono text-xs tracking-[0.12em] text-accent">
          {String(i + 1).padStart(2, '0')}
        </span>
        <h3 className="text-xl leading-tight tracking-[-0.02em]">{step.title}</h3>
        <p className="text-[0.9375rem] leading-relaxed text-fg-soft">{step.body}</p>
      </li>
    ))}
  </ol>
);

/** Numbered question list in a single bordered block; each answer opens in place. */
export const FaqList = ({ items }: { items: Faq[] }) => (
  <div className="border border-line bg-surface">
    {items.map((f, i) => (
      <details key={f.q} className="group border-b border-line last:border-b-0">
        <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
          <span className="font-mono text-xs tracking-[0.12em] text-fg-soft">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-display text-lg font-medium tracking-[-0.02em]">{f.q}</span>
          <TileIcon
            name="plus"
            size={14}
            accent="currentColor"
            className="text-fg-soft transition-transform group-open:rotate-45"
          />
        </summary>
        <p className="max-w-[65ch] px-5 pb-6 md:pl-[4.75rem]">{f.a}</p>
      </details>
    ))}
  </div>
);
