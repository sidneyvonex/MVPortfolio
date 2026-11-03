import { SITE } from '../../data/site';

/** Name with a Tangerine tile in front: the personal mark, set in the Kodika type. */
export const Wordmark = ({ className = '' }: { className?: string }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <span aria-hidden="true" className="grid grid-cols-2 gap-[2px]">
      <span className="size-[7px] rounded-[1.5px] bg-fg" />
      <span className="size-[7px] rounded-[1.5px] bg-fg" />
      <span className="size-[7px] rounded-[1.5px] bg-fg" />
      <span className="size-[7px] rounded-[1.5px] bg-tangerine-500" />
    </span>
    <span className="font-display text-[1.0625rem] font-medium tracking-[-0.02em]">{SITE.name}</span>
  </span>
);
