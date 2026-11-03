import { CELL, RADIUS, TILE, TILE_ICONS, type IconName } from './tileIcons';

/**
 * A Kodika tile icon. Tiles marked "#" use the current text color; "o" tiles use `accent`
 * (Tangerine by default). Decorative unless a `title` is given.
 */
export const TileIcon = ({
  name,
  size = 24,
  accent = 'var(--color-tangerine-500)',
  className = '',
  title,
}: {
  name: IconName;
  size?: number;
  accent?: string;
  className?: string;
  title?: string;
}) => {
  const map = TILE_ICONS[name];
  const n = map.length;
  const inset = (CELL - TILE) / 2;
  return (
    <svg
      viewBox={`0 0 ${n * CELL} ${n * CELL}`}
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {map.flatMap((row, y) =>
        row
          .split('')
          .map((ch, x) =>
            ch === '.' ? null : (
              <rect
                key={`${x}-${y}`}
                x={x * CELL + inset}
                y={y * CELL + inset}
                width={TILE}
                height={TILE}
                rx={RADIUS}
                fill={ch === 'o' ? accent : 'currentColor'}
              />
            ),
          ),
      )}
    </svg>
  );
};
