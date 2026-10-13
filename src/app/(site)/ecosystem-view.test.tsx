import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { EcosystemView, type OfferingContent } from './ecosystem-view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const silver: OfferingContent = {
  name: 'Silver Roots',
  slug: 'silver-roots',
  status: 'in-development',
  distinction: 'Village 60 Plus runs homes. Silver Roots helps people find support wherever they live.',
  summary: 'The team helps by phone today.',
  currentCapabilities: [{ _key: 'phone', title: 'Help by phone', description: 'A conversation with the team.', provision: 'included', status: 'available' }],
  plannedCapabilities: [{ _key: 'home', title: 'Support at home', description: 'Visits at home.', provision: 'partner-arranged', status: 'planned' }],
  howItWorks: [
    { _key: 's1', title: 'Tell us what is needed', description: 'A short conversation.' },
    { _key: 's2', title: 'You choose', description: 'Nothing is arranged without agreement.' },
  ],
  benefitGroups: [{ _key: 'families', audience: 'Families', points: ['One place to ask'] }],
  sections: [],
  faqs: [],
};

function renderOffering(slug: OfferingContent['slug'], offering: OfferingContent | null) {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <EcosystemView slug={slug} offering={offering} contact={contactFixture} />
    </EnquiryProvider>,
  );
}

describe('EcosystemView', () => {
  it('keeps planned Silver Roots capabilities labelled and offers both enquiries', () => {
    renderOffering('silver-roots', silver);
    expect(screen.getByText('In development')).toBeInTheDocument();
    expect(screen.getByText('In development').className).not.toContain('text-pale-gold');
    expect(screen.getByRole('heading', { name: 'Planned', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Planned', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How it works' })).toBeInTheDocument();
    expect(screen.getByText('Tell us what is needed')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Partner with Silver Roots' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send a general enquiry' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('uses the destination form and no partner form', () => {
    renderOffering('destination-retirement', {
      ...silver,
      name: 'Destination Retirement',
      slug: 'destination-retirement',
      status: 'planned',
      howItWorks: [],
    });
    expect(screen.getByRole('heading', { name: 'Plan a stay' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Partner with Silver Roots' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'How it works' })).not.toBeInTheDocument();
  });

  it('omits an empty current-capabilities band', () => {
    renderOffering('destination-retirement', {
      ...silver,
      name: 'Destination Retirement',
      slug: 'destination-retirement',
      currentCapabilities: [],
      howItWorks: [],
    });
    expect(screen.queryByRole('heading', { name: 'What exists today' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Planned', level: 2 })).toBeInTheDocument();
  });

  it('gives SAGE a dark hero and no product interface', () => {
    renderOffering('sage', {
      name: 'SAGE',
      slug: 'sage',
      status: 'pilot',
      distinction: 'SAGE supports the care team. It is not a product families buy.',
      summary: 'Tools for the team, labelled by status.',
      currentCapabilities: [{ _key: 'notes', title: 'Team communication', description: 'Shift notes.', provision: 'included', status: 'pilot' }],
      plannedCapabilities: [{ _key: 'family', title: 'Family updates', description: 'Permission-based updates.', provision: 'included', status: 'in-development' }],
      howItWorks: [],
      benefitGroups: [{ _key: 'teams', audience: 'Care teams', points: ['Less paperwork'] }],
      sections: [],
      faqs: [],
    });
    expect(screen.getAllByText('Pilot')[0].className).toContain('text-pale-gold');
    expect(screen.getByText('In development')).toBeInTheDocument();
    expect(screen.queryByText('Available now')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Plan a stay' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enquire' })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/voice interface/i);
  });
});
