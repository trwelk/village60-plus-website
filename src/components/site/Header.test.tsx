import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

const pathState = vi.hoisted(() => ({ value: '/homes/serenity' }));

vi.mock('next/navigation', () => ({
  usePathname: () => pathState.value,
}));
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
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

  it('lays a light bar over main-nav heroes and keeps a solid bar on detail and legal pages', () => {
    const light = ['/', '/find-the-right-care', '/homes', '/living-and-care', '/oracle', '/silver-roots', '/destination-retirement', '/sage', '/our-story', '/contact', '/feedback'];
    const solid = ['/homes/serenity', '/living-and-care/respite-care', '/privacy', '/terms', '/accessibility'];
    try {
      for (const path of light) {
        pathState.value = path;
        const view = render(
          <EnquiryProvider contact={contactFixture}>
            <Header contact={contactFixture} enquiryTrigger={<button type="button">Enquire</button>} />
          </EnquiryProvider>,
        );
        expect(screen.getByRole('link', { name: 'Village 60 Plus' }).className, path).toContain('text-ivory');
        view.unmount();
      }
      for (const path of solid) {
        pathState.value = path;
        const view = render(<Header contact={contactFixture} enquiryTrigger={<button type="button">Enquire</button>} />);
        expect(screen.getByRole('link', { name: 'Village 60 Plus' }).className, path).toContain('text-green');
        view.unmount();
      }
    } finally {
      pathState.value = '/homes/serenity';
    }
  });

  it('closes the More menu after a menu item is chosen', async () => {
    const user = userEvent.setup();
    render(<Header contact={contactFixture} />);
    const more = screen.getByText('More').closest('details');
    await user.click(screen.getByText('More'));
    expect(more).toHaveAttribute('open');
    await user.click(within(more!).getByRole('link', { name: 'Contact' }));
    expect(more).not.toHaveAttribute('open');
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
