import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));
import { Footer } from './Footer';
import { contactFixture } from '@/test/contact-fixture';

describe('Footer', () => {
  it('lists legal links, contact details and the legal name', () => {
    render(<Footer contact={contactFixture} legalName="Village 60 Plus (Pvt) Ltd" address="133/19 Nawala Road, Narahenpita, Colombo 05" />);
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
    expect(screen.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
    expect(screen.getByText(/Village 60 Plus \(Pvt\) Ltd/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: contactFixture.email })).toHaveAttribute('href', `mailto:${contactFixture.email}`);
    const whatsapp = screen.getByRole('link', { name: 'WhatsApp +94 74 100 3994' });
    const landline = screen.getByRole('link', { name: contactFixture.phoneDisplay });
    expect(whatsapp.compareDocumentPosition(landline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it('omits the founding year when unconfirmed', () => {
    render(<Footer contact={contactFixture} legalName="Village 60 Plus" address="Colombo" />);
    expect(screen.queryByText(/Established/)).not.toBeInTheDocument();
  });
});
