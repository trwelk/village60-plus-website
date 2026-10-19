export type NavItem = { label: string; href: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Oracle', href: '/oracle' },
  { label: 'Our Homes', href: '/homes' },
  { label: 'Living & Care', href: '/living-and-care' },
  { label: 'Destination Retirement', href: '/destination-retirement' },
  { label: 'Silver Roots', href: '/silver-roots' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Look to the Future', href: '/look-to-the-future' },
  { label: 'Contact', href: '/contact' },
];

export const MORE_NAV: NavItem[] = [
  { label: 'SAGE', href: '/sage' },
  { label: 'Find the Right Care', href: '/find-the-right-care' },
  { label: 'Feedback', href: '/feedback' },
];

export const LEGAL_NAV: NavItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
];

/** Light nav on a full-viewport photo hero. Legal pages keep the solid bar. */
export function overlayHeader(pathname: string) {
  if (LEGAL_NAV.some((item) => item.href === pathname)) return false;
  if (pathname === '/') return true;
  return [...PRIMARY_NAV, ...MORE_NAV].some((item) => item.href === pathname || (item.href !== '/' && pathname.startsWith(`${item.href}/`)));
}
