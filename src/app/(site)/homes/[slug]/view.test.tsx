import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import { ResidenceView, type ResidenceContent } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

const block = (text: string) => [
  { _type: 'block' as const, _key: 'b', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's', text, marks: [] }] },
];

const operating: ResidenceContent = {
  name: 'Serenity',
  slug: 'serenity',
  status: 'available',
  shortLocation: 'Colombo',
  summary: 'A smaller home.',
  heroImage: imageFixture('Serenity exterior'),
  description: block('Serenity is a small household.'),
  careTypes: [{ _id: 'care.residential-care', name: 'Residential Care', slug: 'residential-care' }],
  audienceFit: ['People who prefer a small household'],
  atmosphere: block('Mornings start at your own pace.'),
  sharedSpaces: ['Dining room'],
  rooms: [{ _key: 'room-1', name: 'Garden room', house: null, summary: 'A quiet room.', facts: ['Verified size is not published yet'], image: imageFixture('Garden room') }],
  careAndSupport: [{ _key: 'care-1', title: 'Care team on site', description: 'A team nearby.', provision: 'included', status: 'available' }],
  everydayLife: [{ _key: 'day-1', title: 'Meals', description: 'Home-cooked meals.', provision: 'included', status: 'available' }],
  gallery: [{ ...imageFixture('Serenity garden'), _key: 'g1' }],
  team: [
    { _id: 'team.amara', name: 'Amara Perera', role: 'Care lead', credentials: ['Registered nurse'], image: imageFixture('Amara Perera') },
    { _id: 'team.blank', name: 'No Photo', role: 'Coordinator', credentials: [], image: { ...imageFixture('hidden'), alt: ' ' } },
  ],
  address: { line1: '12 Example Lane', city: 'Colombo', country: 'Sri Lanka' },
  faqs: [{ _id: 'faq.visit', question: 'Can we visit before deciding?', answer: block('Yes. Visits are by appointment.') }],
  formKind: 'general',
  comingSoonNote: null,
};

const future: ResidenceContent = {
  ...operating,
  name: 'The Grove',
  slug: 'the-grove',
  status: 'coming-soon',
  comingSoonNote: 'The Grove is not yet open. Register your interest and the team will share verified news.',
  formKind: 'grove-interest',
};

function renderResidence(residence: ResidenceContent | null) {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <ResidenceView residence={residence} contact={contactFixture} mapsKey={null} />
    </EnquiryProvider>,
  );
}

describe('ResidenceView', () => {
  it('renders the operating sections in order and a single h1', () => {
    const { container } = renderResidence(operating);
    expect([...container.querySelectorAll('[data-residence-section]')].map((node) => node.getAttribute('data-residence-section'))).toEqual([
      'hero', 'gallery', 'audience', 'atmosphere', 'spaces', 'care', 'everyday', 'team', 'map', 'faqs', 'enquiry',
    ]);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Serenity' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByRole('heading', { name: 'A look through the house' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Serenity garden' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Who this home suits' })).toBeInTheDocument();
    const audience = container.querySelector('[data-residence-section="audience"]');
    expect(audience?.querySelector('svg')).toBeTruthy();
    expect(audience?.querySelector('.rounded-panel')).toBeNull();
    expect(screen.getByText('People who prefer a small household')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Atmosphere and daily life' })).toBeInTheDocument();
    expect(screen.getByText('Mornings start at your own pace.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByText('Garden room')).toBeInTheDocument();
    expect(screen.getByText('Care team on site')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'A caregiver sitting with a resident over tea' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore care & support' })).toHaveAttribute('href', '/living-and-care#health');
    expect(screen.getByText('Meals')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'A dining table beside open doors to the garden' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore meals & dining' })).toHaveAttribute('href', '/living-and-care#good-food');
    expect(screen.getByRole('img', { name: 'Amara Perera' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'hidden' })).not.toBeInTheDocument();
    expect(screen.getByText('Can we visit before deciding?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get directions' })).toHaveAttribute('href', expect.stringContaining('https://www.google.com/maps/search/'));
    expect(screen.getByText('Serenity', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Register your interest' })).not.toBeInTheDocument();
  });

  it('replaces operational sections with the coming-soon note and one interest form', () => {
    const { container } = renderResidence(future);
    expect(container.querySelector('[data-residence-section="spaces"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="gallery"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="team"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="map"]')).toBeNull();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText(/not yet open/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Register your interest' })).toBeInTheDocument();
    expect(screen.queryByText('Garden room')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('omits team, gallery and questions when nothing is published', () => {
    const { container } = renderResidence({ ...operating, team: [], gallery: [], faqs: [] });
    expect(container.querySelector('[data-residence-section="team"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="gallery"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="faqs"]')).toBeNull();
    expect(screen.queryByRole('heading', { name: /^The team$/ })).not.toBeInTheDocument();
  });

  it('explains missing rooms and still lists shared spaces', () => {
    renderResidence({ ...operating, rooms: [] });
    expect(screen.getByText(/published once they are verified/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Shared spaces' })).toBeInTheDocument();
    expect(screen.getByText('Dining room')).toBeInTheDocument();
  });

  it('renders an empty state when the document is missing', () => {
    renderResidence(null);
    expect(screen.getByRole('heading', { level: 1, name: 'This home' })).toBeInTheDocument();
    expect(screen.getByText(/once they are published/i)).toBeInTheDocument();
  });
});
