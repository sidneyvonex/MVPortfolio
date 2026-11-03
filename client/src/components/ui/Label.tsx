import type { ReactNode } from 'react';
import { TileBullet } from './TileBullet';

// Small uppercase mono label used for eyebrows, tags, dates and section names.
// `dot` adds the Tangerine tile in front: the one place the accent appears in a section header.
export const Label = ({
  children,
  className = '',
  dot = false,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) => (
  <span
    className={`inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase ${className}`}
  >
    {dot && <TileBullet className="" />}
    <span>{children}</span>
  </span>
);
