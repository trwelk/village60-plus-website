import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { FindCareView, pathwayDefaults } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
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
    expect(screen.getByRole('heading', { level: 2, name: 'You do not have to arrive knowing the name.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Say who it is for' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Name the shape of the help' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'A person calls you back' })).toBeInTheDocument();
    expect(screen.queryByText('You started here')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Begin with a few questions' })).toHaveAttribute('href', '#care-enquiry');
  });

  it('answers the pathway the visitor arrived on', () => {
    const { rerender } = render(
      <FindCareView title="Find the right care" intro="Tell us a little." contact={contactFixture} defaults={pathwayDefaults('myself')} />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Start with the day you want.' })).toBeInTheDocument();
    expect(screen.getByText('You started here')).toBeInTheDocument();

    rerender(
      <FindCareView title="Find the right care" intro="Tell us a little." contact={contactFixture} defaults={pathwayDefaults('parent')} />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'You do not need the care category.' })).toBeInTheDocument();

    rerender(
      <FindCareView title="Find the right care" intro="Tell us a little." contact={contactFixture} defaults={pathwayDefaults('after-hospital')} />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Leaving hospital is enough to say.' })).toBeInTheDocument();
  });

  it('preselects who the enquiry is for from the homepage pathway', () => {
    render(
      <FindCareView title="Find the right care" intro="Tell us a little." contact={contactFixture} defaults={pathwayDefaults('parent')} />,
    );
    expect(screen.getByLabelText('Who is this for?')).toHaveValue('parent');
    expect(screen.getByLabelText('What kind of help are you considering?')).toHaveValue('');
  });
});
