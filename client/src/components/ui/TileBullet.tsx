/** A single Tangerine tile, used as the list bullet and the eyebrow marker across the site. */
export const TileBullet = ({ className = 'mt-[0.45em]' }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`size-[0.5em] shrink-0 rounded-[2px] bg-tangerine-500 ${className}`}
  />
);
