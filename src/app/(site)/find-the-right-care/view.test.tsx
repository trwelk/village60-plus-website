import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { FindCareView, pathwayDefaults } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

describe('pathwayDefaults', () => {
  it('maps the homepage pathways onto whoFor or helpType', () => {
    expect(pathwayDefaults('parent')).toEqual({ whoFor: 'parent' });
    expect(pathwayDefaults('myself')).toEqual({ whoFor: 'myself' });
    expect(pathwayDefaults('after-hospital')).toEqual({ helpType: 'recovery' });
    expect(pathwayDefaults('diagnosis')).toEqual({});
    expect(pathwayDefaults(undefined)).toEqual({});
  });
});

describe('FindCareView', () => {
  it('states that the form is not a medical assessment and offers call and WhatsApp', () => {
    render(
      <FindCareView
        title="Find the right care"
        intro="You do not need to know the name of the care you are looking for."
        contact={contactFixture}
        defaults={{}}
      />,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Find the right care' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('You do not need to know the name of the care you are looking for.')).toBeInTheDocument();
    expect(screen.getByText('This form is not a medical assessment.')).toBeInTheDocument();
    expect(screen.queryByLabelText(/diagnosis/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Message')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'privacy notice' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Find%20the%20Right%20Care'));
  });

  it('preselects who the enquiry is for from the homepage pathway', () => {
    render(
      <FindCareView title="Find the right care" intro="Tell us a little." contact={contactFixture} defaults={pathwayDefaults('parent')} />,
    );
    expect(screen.getByLabelText('Who is this for?')).toHaveValue('parent');
    expect(screen.getByLabelText('What kind of help are you considering?')).toHaveValue('');
  });
});
