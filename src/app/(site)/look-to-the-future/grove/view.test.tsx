import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { GroveView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

HTMLDialogElement.prototype.showModal = vi.fn(function show(this: HTMLDialogElement) {
  this.open = true;
});

function renderPage() {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <GroveView />
    </EnquiryProvider>,
  );
}

describe('GroveView', () => {
  it('follows the landing layout and keeps one heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /A New Chapter/ })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const order = [...document.querySelectorAll('[data-grove-section]')].map((node) => node.getAttribute('data-grove-section'));
    expect(order).toEqual(['hero', 'residence', 'grounds', 'features', 'community', 'launch']);
    expect(screen.getByRole('heading', { name: 'Two buildings. Forty rooms.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'A warm welcome every day.' })).toBeInTheDocument();
    expect(screen.getAllByText('40 Private Rooms').length).toBeGreaterThan(0);
    expect(screen.getByText(/Central garden — green, open and peaceful/)).toBeInTheDocument();
    expect(screen.getByText('40 Ensuite Rooms (20 Down, 20 Up)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Discover The Grove/ })).toHaveAttribute('href', '#residence');
    expect(screen.getByRole('link', { name: /Explore living & care/ })).toHaveAttribute('href', '/living-and-care');
    expect(screen.getByRole('img', { name: /timber gates and an illuminated sign/ })).toHaveAttribute('src', '/look-to-the-future/grove.jpg');
    expect(screen.getByRole('img', { name: /two long buildings/ })).toHaveAttribute('src', '/look-to-the-future/grove-aerial.jpg');
  });

  it('opens a Grove enquiry from the launch band', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /Register your interest/ }));
    expect(screen.getByRole('heading', { name: 'Register your interest' })).toBeInTheDocument();
  });
});
