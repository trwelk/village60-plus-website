// intentionally bare: the Studio must not inherit site chrome
import type { ReactNode } from 'react';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
