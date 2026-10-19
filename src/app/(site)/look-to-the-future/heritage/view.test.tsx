import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { HeritageView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

HTMLDialogElement.prototype.showModal = vi.fn(function show(this: HTMLDialogElement) {
  this.open = true;
});

function renderPage() {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <HeritageView />
    </EnquiryProvider>,
  );
}

describe('HeritageView', () => {
  it('follows the landing layout and keeps one heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Where History Meets/ })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const order = [...document.querySelectorAll('[data-heritage-section]')].map((node) => node.getAttribute('data-heritage-section'));
    expect(order).toEqual(['hero', 'estate', 'matara', 'wellness', 'ecosystem', 'launch']);
    expect(screen.getByRole('heading', { name: 'The Keunaman Bungalow Estate' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Why Matara?' })).toBeInTheDocument();
    expect(screen.getByText('50 Private Chalets')).toBeInTheDocument();
    expect(screen.getByText(/Mirissa — whale watching/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Discover the Heritage/ })).toHaveAttribute('href', '#estate');
    expect(screen.getByRole('link', { name: /Explore our services/ })).toHaveAttribute('href', '/living-and-care');
    expect(screen.getByRole('img', { name: /colonial bungalow and gardens/ })).toHaveAttribute('src', '/look-to-the-future/heritage.jpg');
  });

  it('opens a Heritage enquiry from the launch band', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /Register your interest/ }));
    expect(screen.getByRole('heading', { name: 'Plan a stay' })).toBeInTheDocument();
  });
});
