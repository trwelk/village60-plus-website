import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { SilverRootsView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

function renderView() {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <SilverRootsView />
    </EnquiryProvider>,
  );
}

describe('SilverRootsView', () => {
  it('follows the landing sequence and keeps the app marked coming soon', () => {
    renderView();

    const title = screen.getByRole('heading', { level: 1, name: /Everything You Need to Live Well/ });
    const support = screen.getByRole('heading', { name: /A Simpler Way to Find Support/ });
    const chapter = screen.getByRole('heading', { name: /Support for Every Chapter/ });
    const services = screen.getByRole('heading', { name: 'Our services' });
    const app = screen.getByRole('heading', { name: /The Silver Roots App/ });
    const tomorrow = screen.getByRole('heading', { name: /A Brighter, More Comfortable Tomorrow/ });

    expect(title.compareDocumentPosition(support) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(support.compareDocumentPosition(chapter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(chapter.compareDocumentPosition(services) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(services.compareDocumentPosition(app) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(app.compareDocumentPosition(tomorrow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(screen.getByRole('link', { name: 'Find the right option' })).toHaveAttribute('href', '/find-the-right-care');
    expect(screen.getByRole('link', { name: 'Explore services' })).toHaveAttribute('href', '#services');
    expect(screen.getByRole('link', { name: /Find Care Explore care homes/ })).toHaveAttribute('href', '/find-the-right-care');
    expect(screen.getByRole('link', { name: /Services at Home/ })).toHaveAttribute('href', '#services');
    expect(screen.getByRole('button', { name: /For Providers/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore all services' })).toHaveAttribute('href', '#services');
    expect(screen.getByRole('link', { name: /Care Homes/ })).toHaveAttribute('href', '/homes');
    expect(screen.getByRole('link', { name: /Home Care/ })).toHaveAttribute('href', '/living-and-care');
    expect(screen.getByRole('link', { name: /Health & Wellbeing/ })).toHaveAttribute('href', '/living-and-care#health');
    expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);

    const appSection = document.querySelector('[data-silver-section="app"]');
    expect(appSection?.textContent).toMatch(/Coming soon/);
    expect(appSection?.textContent).toMatch(/Secure payments/);
    expect(document.body.textContent).not.toMatch(/guarantee|best|number one/i);
  });
});
