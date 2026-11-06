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

const services = [
  'Comfortable Accommodation',
  'Nutritious Meals',
  'Personal Care and Assistance',
  'Recreation and Activities',
  'Peaceful Environment',
  'Community and Companionship',
];

describe('DestinationRetirementView', () => {
  it('shows the welcome and the services the residence provides', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Welcome to Destination Retirement, where comfort, care and peace of mind come together/ })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('[data-dr-section="hero"] img')).toHaveAttribute('src', '/destination-retirement/hero.jpg');
    expect(screen.getByText(/you are choosing a lifestyle, a community and a place to relax/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'A cliffside pool looking out to the ocean' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What We Provide' })).toBeInTheDocument();
    for (const name of services) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    }
    const order = [...document.querySelectorAll('[data-dr-section]')].map((node) => node.getAttribute('data-dr-section'));
    expect(order).toEqual(['hero', 'intro', 'provide']);
    expect(screen.queryByRole('heading', { name: 'Sri Lanka' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Wellness & Spa/)).not.toBeInTheDocument();
  });

  it('opens the enquiry from the hero', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /Send an enquiry/ }));
    expect(screen.getByRole('heading', { name: 'Plan a stay' })).toBeInTheDocument();
  });
});
