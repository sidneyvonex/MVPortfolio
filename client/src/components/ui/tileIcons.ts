// Kodika icon set: every icon is drawn on a square grid of rounded tiles (6 x 6 for content icons,
// 5 x 5 for small UI icons). "#" is a tile in the current text color, "o" is the one Tangerine accent,
// "." is empty. To add an icon, add a map here; keep at most one accent group per icon.

export const TILE_ICONS = {
  // Services
  websites: ['oooooo', '######', '#....#', '#.##.#', '#....#', '######'],
  'web-apps': ['....o.', '....o.', '..#.o.', '..#.o.', '#.#.o.', '######'],
  'mobile-apps': ['.####.', '.#..#.', '.#..#.', '.#..#.', '.#oo#.', '.####.'],
  'custom-platforms': ['##..oo', '##..oo', '..##..', '..##..', '##..##', '##..##'],

  // Process
  discover: ['.###..', '#...#.', '#...#.', '.###..', '....o.', '.....o'],
  design: ['###...', '###...', '###ooo', '...ooo', '...ooo', '......'],
  build: ['....oo', '....oo', '..####', '..####', '######', '######'],
  launch: ['..oo..', '.oooo.', 'o.##.o', '..##..', '..##..', '..##..'],

  // Principles and values
  team: ['##..##', '##..##', '......', 'oooooo', 'oooooo', '......'],
  early: ['...oo.', '..oo..', '.oooo.', '..oo..', '.oo...', 'oo....'],
  stay: ['.####.', '#....#', '#....o', '#...oo', '#....#', '.####.'],
  clear: ['######', '......', 'oooo..', '......', '######', '......'],
  ship: ['..o...', '..oo..', '######', '.####.', '..##..', '......'],
  own: ['.####.', '#....#', '#.oo.#', '#.oo.#', '#....#', '.####.'],

  // UI
  'arrow-right': ['..#..', '...#.', '#####', '...#.', '..#..'],
  'arrow-up-right': ['..###', '...##', '..#.#', '.#...', '#....'],
  menu: ['#####', '.....', '#####', '.....', '#####'],
  close: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  copy: ['###..', '#.#..', '#####', '..#.#', '..###'],
  check: ['....#', '...#.', '#.#..', '.#...', '.....'],
  plus: ['..#..', '..#..', '#####', '..#..', '..#..'],
  mail: ['#####', '##.##', '#.#.#', '#...#', '#####'],
  'chevron-down': ['.....', '#...#', '.#.#.', '..#..', '.....'],
  sun: ['#.#.#', '.ooo.', '#ooo#', '.ooo.', '#.#.#'],
  moon: ['.###.', '##...', '#....', '##...', '.###.'],
  download: ['..#..', '..#..', '#.#.#', '.###.', 'ooooo'],
} as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof TILE_ICONS;

/** Grid unit and tile size in viewBox units: tiles are 85% of a cell with soft corners. */
export const CELL = 8;
export const TILE = 6.8;
export const RADIUS = 2;
