import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

const pathState = vi.hoisted(() => ({ value: '/not-a-page' }));

vi.mock('next/navigation', () => ({
  usePathname: () => pathState.value,
}));
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { Header } from './Header';
import { contactFixture } from '@/test/contact-fixture';

describe('Header', () => {
  it('shows the homepage navigation, and keeps phone and WhatsApp when the page has no photo hero', async () => {
    const { container } = render(<Header contact={contactFixture} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'Oracle' })).toHaveAttribute('href', '/oracle');
    expect(within(nav).getByRole('link', { name: 'Our Homes' })).toHaveAttribute('href', '/homes');
    expect(within(nav).getByRole('link', { name: 'Living & Care' })).toHaveAttribute('href', '/living-and-care');
    expect(within(nav).getByRole('link', { name: 'Destination Retirement' })).toHaveAttribute('href', '/destination-retirement');
    expect(within(nav).getByRole('link', { name: 'Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(within(nav).getByRole('link', { name: 'Our Story' })).toHaveAttribute('href', '/our-story');
    expect(within(nav).getByRole('link', { name: 'Look to the Future' })).toHaveAttribute('href', '/look-to-the-future');
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(within(nav).queryByRole('link', { name: 'Find the Right Care' })).not.toBeInTheDocument();
    expect(within(nav).queryByText('More')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Call \+94 11 250 4838/ })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('wa.me/94741003994'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not render a tel link when the phone number is empty', () => {
    render(
      <Header
        contact={{ phone: '', phoneDisplay: '', whatsapp: '', email: '', responseTime: 'as soon as we can' }}
        enquiryTrigger={<button type="button">Enquire</button>}
      />,
    );
    expect(screen.queryByRole('link', { name: /^Call/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enquire' })).toBeInTheDocument();
  });

  it('lays a light bar over full heroes and keeps a solid bar on pages without one', () => {
    const light = ['/', '/homes', '/homes/serenity', '/find-the-right-care', '/living-and-care', '/living-and-care/respite-care', '/oracle', '/destination-retirement', '/silver-roots', '/sage', '/our-story', '/contact', '/feedback', '/look-to-the-future', '/look-to-the-future/heritage', '/look-to-the-future/grove'];
    const solid = ['/privacy', '/terms', '/accessibility'];
    try {
      for (const path of light) {
        pathState.value = path;
        const view = render(
          <EnquiryProvider contact={contactFixture}>
            <Header contact={contactFixture} enquiryTrigger={<button type="button">Enquire</button>} />
          </EnquiryProvider>,
        );
        expect(screen.getByRole('link', { name: 'Village 60 Plus' }).className, path).toContain('bg-paper/95');
        view.unmount();
      }
      for (const path of solid) {
        pathState.value = path;
        const view = render(<Header contact={contactFixture} enquiryTrigger={<button type="button">Enquire</button>} />);
        expect(screen.getByRole('link', { name: 'Village 60 Plus' }).className, path).not.toContain('bg-paper/95');
        view.unmount();
      }
    } finally {
      pathState.value = '/not-a-page';
    }
  }, 15000);

  it('keeps Find the Right Care, SAGE and Contact in the mobile menu', () => {
    render(<Header contact={contactFixture} />);
    const mobile = screen.getByRole('navigation', { name: 'Mobile' });
    expect(within(mobile).getByRole('link', { name: 'Look to the Future' })).toHaveAttribute('href', '/look-to-the-future');
    expect(within(mobile).getByRole('link', { name: 'Find the Right Care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(within(mobile).getByRole('link', { name: 'SAGE' })).toHaveAttribute('href', '/sage');
    expect(within(mobile).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
  });

  it('closes the mobile menu after a menu item is chosen', async () => {
    const user = userEvent.setup();
    render(<Header contact={contactFixture} />);
    const mobile = screen.getByRole('navigation', { name: 'Mobile' }).closest('details');
    await user.click(screen.getByText('Menu'));
    expect(mobile).toHaveAttribute('open');
    await user.click(within(mobile!).getByRole('link', { name: 'Contact' }));
    expect(mobile).not.toHaveAttribute('open');
  });
});
