import type { ReactNode } from 'react';

/** Page-width column shared by every section: 1200px max, 20px gutters on phones. */
export const Container = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>{children}</div>;
