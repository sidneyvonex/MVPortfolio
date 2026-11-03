import { useTheme } from '../../hooks/useTheme';
import { TileIcon } from './TileIcon';

/** Sun/moon switch between the light and dark themes. */
export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      className={`p-2 text-fg-soft transition-colors hover:text-fg ${className}`}
    >
      <TileIcon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
    </button>
  );
};
