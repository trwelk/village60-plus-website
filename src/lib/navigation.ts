export type NavItem = { label: string; href: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Find the Right Care', href: '/find-the-right-care' },
  { label: 'Our Homes', href: '/homes' },
  { label: 'Living & Care', href: '/living-and-care' },
  { label: 'Oracle', href: '/oracle' },
  { label: 'Silver Roots', href: '/silver-roots' },
];

export const MORE_NAV: NavItem[] = [
  { label: 'Destination Retirement', href: '/destination-retirement' },
  { label: 'SAGE', href: '/sage' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact', href: '/contact' },
  { label: 'Feedback', href: '/feedback' },
];

export const LEGAL_NAV: NavItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
];

/** Light nav sitting on a full-bleed hero. Exact paths only, so residence and care detail pages stay on the solid bar. */
export function overlayHeader(pathname: string) {
  if (pathname === '/') return true;
  return [...PRIMARY_NAV, ...MORE_NAV].some((item) => item.href === pathname);
}
