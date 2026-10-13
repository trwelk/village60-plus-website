import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/homes/serenity',
}));
import { Header } from './Header';
import { contactFixture } from '@/test/contact-fixture';

describe('Header', () => {
  it('shows primary navigation, a More menu, the phone number and WhatsApp', async () => {
    const { container } = render(<Header contact={contactFixture} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Find the Right Care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(within(nav).getByRole('link', { name: 'Oracle' })).toHaveAttribute('href', '/oracle');
    expect(within(nav).getByText('More')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Call \+94 11 250 4838/ })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Serenity'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
