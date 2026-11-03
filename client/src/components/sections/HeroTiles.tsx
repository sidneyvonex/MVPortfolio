// Stepped blocks at each bottom corner of the home hero, rows top to bottom, outer edge first.
// o tangerine 500, l tangerine 300 (light), d tangerine 600 (dark), . empty. Same as Kodika Labs.
const STACK = ['l....', 'oo...', 'ol...', 'oooo.', 'odool'];
const COLOURS = { o: '#ff6a1f', l: '#fda271', d: '#da5c1d' } as const;

// Load animation (seconds): columns from the outer edge inward, each from the bottom up.
// Styles in index.css (.hero-tile), off under prefers-reduced-motion.
const COLUMN_DELAY = 0.07;
const ROW_DELAY = 0.06;

const Stack = ({ mirror }: { mirror: boolean }) => {
  const rows = STACK.length;
  const cols = STACK[0]!.length;
  return (
    <svg
      viewBox={`0 0 ${cols * 10} ${rows * 10}`}
      className={`absolute bottom-0 w-[90px] md:w-[150px] lg:w-[200px] ${mirror ? 'right-0 -scale-x-100' : 'left-0'}`}
    >
      {STACK.flatMap((row, y) =>
        row
          .split('')
          .map((ch, x) =>
            ch === '.' ? null : (
              <rect
                key={`${x}-${y}`}
                x={x * 10}
                y={y * 10}
                width="10"
                height="10"
                fill={COLOURS[ch as keyof typeof COLOURS]}
                className="hero-tile"
                style={{ animationDelay: `${x * COLUMN_DELAY + (rows - 1 - y) * ROW_DELAY}s` }}
              />
            ),
          ),
      )}
    </svg>
  );
};

/** Decorative hero edges: stepped tangerine blocks in both bottom corners. */
export const HeroTiles = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
    <Stack mirror={false} />
    <Stack mirror />
  </div>
);
