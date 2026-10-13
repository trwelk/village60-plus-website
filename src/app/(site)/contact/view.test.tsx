import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { ContactView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

const office = { line1: '133/19 Nawala Road', line2: 'Narahenpita', city: 'Colombo 05', country: 'Sri Lanka' };

describe('ContactView', () => {
  it('shows the office, a residence directions link and the general form', () => {
    render(
      <ContactView
        title="Contact us"
        intro="A person will reply."
        contact={contactFixture}
        openingHours="Monday to Saturday, 9am–6pm"
        emergencyNotice={null}
        headOffice={office}
        mapsKey={null}
        residences={[{ name: 'Serenity', address: { line1: '12 Example Lane', city: 'Colombo', country: 'Sri Lanka' } }]}
      />,
    );
    expect(screen.getByRole('link', { name: `Call ${contactFixture.phoneDisplay}` })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Contact'));
    expect(screen.getByRole('link', { name: contactFixture.email })).toHaveAttribute('href', 'mailto:hello@example.com');
    expect(screen.getByText(/133\/19 Nawala Road/)).toBeInTheDocument();
    expect(screen.getByText('Monday to Saturday, 9am–6pm')).toBeInTheDocument();
    expect(screen.getByText(contactFixture.responseTime)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Directions to Serenity' })).toHaveAttribute('href', expect.stringContaining('https://www.google.com/maps/search/'));
    expect(screen.getByRole('heading', { name: 'Talk to the team' })).toBeInTheDocument();
    expect(screen.queryByText(/ambulance/)).not.toBeInTheDocument();
  });

  it('shows the emergency notice only when the CMS field is set', () => {
    render(
      <ContactView
        title="Contact us"
        intro={null}
        contact={contactFixture}
        openingHours={null}
        emergencyNotice="This website is not an emergency service. Call 1990 for an ambulance."
        headOffice={office}
        mapsKey={null}
        residences={[]}
      />,
    );
    expect(screen.getByText(/Call 1990 for an ambulance/)).toBeInTheDocument();
  });
});
