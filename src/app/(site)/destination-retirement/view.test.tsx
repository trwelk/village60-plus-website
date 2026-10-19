import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { DestinationRetirementView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

HTMLDialogElement.prototype.showModal = vi.fn(function show(this: HTMLDialogElement) {
  this.open = true;
});

function renderPage() {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <DestinationRetirementView />
    </EnquiryProvider>,
  );
}

describe('DestinationRetirementView', () => {
  it('follows the landing layout and keeps one heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Your Next Chapter/ })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const order = [...document.querySelectorAll('[data-dr-section]')].map((node) => node.getAttribute('data-dr-section'));
    expect(order).toEqual(['hero', 'destinations', 'promises', 'lifestyle', 'places', 'wellness', 'support', 'trial']);
    expect(screen.getByRole('heading', { name: 'Sri Lanka' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore destinations/ })).toHaveAttribute('href', '#destinations');
    expect(screen.getByRole('link', { name: /Connected Services via Silver Roots/ })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByRole('link', { name: /Explore our services/ })).toHaveAttribute('href', '/silver-roots');
  });

  it('opens the stay enquiry from the hero', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /Plan your stay/ }));
    expect(screen.getByRole('heading', { name: 'Plan a stay' })).toBeInTheDocument();
  });
});
