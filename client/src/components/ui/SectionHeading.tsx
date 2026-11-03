import type { ReactNode } from 'react';
import { Label } from './Label';

/** Section header: dotted eyebrow, headline, optional lead and an action on the right. */
export const SectionHeading = ({
  label,
  title,
  lead,
  action,
  align = 'left',
}: {
  label: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
}) => {
  if (align === 'center') {
    return (
      <div className="mx-auto grid max-w-[44rem] justify-items-center gap-4 text-center">
        <Label dot className="text-fg-soft">
          {label}
        </Label>
        <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.08]">{title}</h2>
        {lead && <p className="max-w-[56ch] text-fg-soft">{lead}</p>}
        {action}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="grid max-w-[42rem] gap-4">
        <Label dot className="text-fg-soft">
          {label}
        </Label>
        <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.08]">{title}</h2>
        {lead && <p className="max-w-[56ch] text-fg-soft">{lead}</p>}
      </div>
      {action}
    </div>
  );
};
