import type { ReactNode } from 'react';
import { Link, type LinkProps } from '@tanstack/react-router';
import { TileIcon } from './TileIcon';

type Variant = 'primary' | 'ghost' | 'brand' | 'invert';

const VARIANTS: Record<Variant, string> = {
  // On a dark page the primary button is the light one.
  primary: 'bg-fg text-surface hover:bg-fg/85',
  ghost: 'bg-fg/[0.08] text-fg hover:bg-fg/[0.14]',
  brand: 'bg-tangerine-500 text-ink hover:bg-tangerine-300',
  invert: 'bg-ink text-paper-1 hover:bg-ink-2',
};

const BASE =
  'group/btn inline-flex items-center gap-2 px-4 py-2.5 text-[0.9375rem] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tangerine-500 disabled:opacity-50';

/**
 * Square Kodika button with a trailing tile arrow.
 * Internal routes use `to`; mailto, files and external links use `href`; anything else is a
 * <button> (for example scrolling to a section).
 */
export const Button = ({
  to,
  href,
  children,
  variant = 'primary',
  onClick,
  arrow = true,
  download,
  external,
  type = 'button',
  disabled,
  className = '',
}: {
  to?: LinkProps['to'];
  href?: string;
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  /** Trailing tile arrow, on by default. */
  arrow?: boolean;
  /** For files: the browser saves the link instead of opening it. */
  download?: boolean;
  /** Opens in a new tab. */
  external?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) => {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <TileIcon
          name={download ? 'download' : external ? 'arrow-up-right' : 'arrow-right'}
          size={11}
          accent="currentColor"
          className="transition-transform group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
};
