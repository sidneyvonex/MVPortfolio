export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

/** Row of filter buttons with a live result count. */
export const FilterChips = ({
  label,
  options,
  active,
  onChange,
  total,
}: {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
  total: number;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={active === o.value}
          onClick={() => onChange(o.value)}
          className={`border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tangerine-500 ${
            active === o.value
              ? 'border-fg bg-fg text-surface'
              : 'border-line text-fg-soft hover:border-fg-soft hover:text-fg'
          }`}
        >
          {o.label}
          <span className="ml-2 font-mono text-xs opacity-70">{o.count}</span>
        </button>
      ))}
    </div>
    <span aria-live="polite" className="font-mono text-xs tracking-[0.12em] text-fg-soft uppercase">
      {total} {total === 1 ? 'project' : 'projects'}
    </span>
  </div>
);
