import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';
import { contactFixture } from '@/test/contact-fixture';

describe('Footer', () => {
  it('lists legal links, contact details and the legal name', () => {
    render(<Footer contact={contactFixture} legalName="Village 60 Plus (Pvt) Ltd" address="133/19 Nawala Road, Narahenpita, Colombo 05" />);
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
    expect(screen.getByText(/Village 60 Plus \(Pvt\) Ltd/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: contactFixture.email })).toHaveAttribute('href', `mailto:${contactFixture.email}`);
  });
  it('omits the founding year when unconfirmed', () => {
    render(<Footer contact={contactFixture} legalName="Village 60 Plus" address="Colombo" />);
    expect(screen.queryByText(/Established/)).not.toBeInTheDocument();
  });
});
