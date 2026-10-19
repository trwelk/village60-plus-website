import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import { CareDetailView, type CareDetail } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

const answer = [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text: 'Visits are by appointment.', marks: [] }] },
];

const service: CareDetail = {
  name: 'Respite care',
  slug: 'respite-care',
  status: 'available',
  summary: 'A short stay while the usual carer rests.',
  heroImage: imageFixture('A quiet bedroom prepared for a short stay'),
  whoItSuits: ['Families who need a planned break'],
  typicalDuration: 'A few days to a few weeks',
  included: [
    { _key: 'stay', title: 'A short stay', description: 'Room and meals for the agreed period.', provision: 'included', status: 'available' },
    { _key: 'therapy', title: 'External therapy', description: 'Booked with the person’s own practitioner.', provision: 'partner-arranged', status: 'available' },
  ],
  process: [{ _key: 'talk', title: 'A conversation', description: 'The team calls back to understand the dates.' }],
  notRightFit: 'If a short stay is not suitable, the team will say so.',
  faqs: [{ _id: 'faq.visit', question: 'Can we visit first?', answer }],
  formKind: 'general',
  residences: [
    { _id: 'residence.serenity', name: 'Serenity', slug: 'serenity', status: 'available', shortLocation: 'Colombo', heroImage: imageFixture('Serenity exterior') },
    { _id: 'residence.the-grove', name: 'The Grove', slug: 'the-grove', status: 'coming-soon', shortLocation: 'Kottawa', heroImage: imageFixture('The Grove') },
  ],
};

describe('CareDetailView', () => {
  it('shows suitability, duration, provision, residences and one h1', () => {
    const { container } = render(
      <EnquiryProvider contact={contactFixture}>
        <CareDetailView service={service} contact={contactFixture} />
      </EnquiryProvider>,
    );
    expect([...container.querySelectorAll('[data-care-section]')].map((node) => node.getAttribute('data-care-section'))).toEqual([
      'hero', 'suits', 'duration', 'included', 'residences', 'process', 'fit', 'faqs', 'enquiry',
    ]);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('Families who need a planned break')).toBeInTheDocument();
    expect(screen.getByText('A few days to a few weeks')).toBeInTheDocument();
    expect(screen.getByText('Arranged through a partner')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'A quiet bedroom prepared for a short stay' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Serenity exterior' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'The Grove' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Serenity/ })).toHaveAttribute('href', '/homes/serenity');
    expect(screen.getByRole('link', { name: /The Grove/ })).toHaveAttribute('href', '/look-to-the-future');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText('Can we visit first?')).toBeInTheDocument();
    expect(screen.getByText('Respite care', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/guarantee/i);
  });

  it('does not invent a duration block when timing is unknown', () => {
    const { container } = render(
      <EnquiryProvider contact={contactFixture}>
        <CareDetailView service={{ ...service, typicalDuration: null }} contact={contactFixture} />
      </EnquiryProvider>,
    );
    expect(screen.queryByText(/talk through timing/i)).not.toBeInTheDocument();
    expect(container.querySelector('[data-care-section="duration"]')).toBeEmptyDOMElement();
  });

  it('renders an empty state when the document is missing', () => {
    render(
      <EnquiryProvider contact={contactFixture}>
        <CareDetailView service={null} contact={contactFixture} />
      </EnquiryProvider>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'This service' })).toBeInTheDocument();
  });
});
