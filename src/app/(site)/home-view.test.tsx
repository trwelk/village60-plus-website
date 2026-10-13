import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import { HomeView, type HomeOffering, type HomeViewProps } from './home-view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const offerings: HomeOffering[] = [
  { slug: 'silver-roots', name: 'Silver Roots', summary: 'A services platform in development. The team helps by phone today.', status: 'in-development' },
  { slug: 'destination-retirement', name: 'Destination Retirement', summary: 'A planned stay concept. Nothing is bookable yet.', status: 'planned' },
  { slug: 'sage', name: 'SAGE', summary: 'Technology that stays in the background.', status: 'pilot' },
];

const props: HomeViewProps = {
  home: {
    title: 'Live well. Age exceptionally.',
    intro: 'Homes, care and practical support for later life in Sri Lanka.',
    heroImage: imageFixture('A verandah'),
    heroVideo: null,
  },
  residences: [
    { _id: 'residence.oracle', name: 'Oracle', slug: 'oracle', status: 'limited', shortLocation: 'Pepiliyana', summary: 'Ten rooms for independent adults.', heroImage: imageFixture('Oracle exterior'), careTypes: [] },
    { _id: 'residence.the-grove', name: 'The Grove', slug: 'the-grove', status: 'coming-soon', shortLocation: 'Kottawa', summary: 'Not open yet.', heroImage: imageFixture('The Grove'), careTypes: [] },
  ],
  careServices: [
    { _id: 'care.independent-living', name: 'Independent Living', slug: 'independent-living', status: 'available', summary: 'Your own routine.', heroImage: null },
  ],
  offerings,
  contact: contactFixture,
};

function renderHome(overrides: Partial<HomeViewProps> = {}) {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <HomeView {...props} {...overrides} />
    </EnquiryProvider>,
  );
}

describe('HomeView', () => {
  it('renders the eight sections in order, with Find the Right Care before Oracle', () => {
    const { container } = renderHome();
    expect([...container.querySelectorAll('[data-home-section]')].map((node) => node.getAttribute('data-home-section'))).toEqual([
      'hero',
      'pathways',
      'oracle',
      'homes',
      'care',
      'silver-roots',
      'ecosystem',
      'trust',
    ]);
    const find = screen.getAllByRole('link', { name: /Find the Right Care/i })[0];
    const oracle = screen.getAllByRole('heading', { name: 'Oracle' })[0];
    expect(find.compareDocumentPosition(oracle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Live well. Age exceptionally.');
  });

  it('links Oracle to /oracle and labels The Grove as coming soon', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /Ten rooms for independent adults/ })).toHaveAttribute('href', '/oracle');
    const grove = screen.getByRole('heading', { name: 'The Grove' }).closest('article');
    expect(grove).not.toBeNull();
    expect(within(grove as HTMLElement).getByText('Coming soon')).toBeInTheDocument();
  });

  it('does not describe Silver Roots marketplace, payments, or accounts as live', () => {
    const { container } = renderHome();
    const silver = container.querySelector('[data-home-section="silver-roots"]');
    expect(silver?.textContent).toMatch(/In development/);
    expect(silver?.textContent).not.toMatch(/marketplace|payments|accounts/i);
    expect(screen.getByRole('link', { name: /Destination Retirement/ })).toHaveAttribute('href', '/destination-retirement');
    expect(screen.getByRole('link', { name: /SAGE/ })).toHaveAttribute('href', '/sage');
    expect(screen.getByText('Planned')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
  });

  it('sends the three pathways to Find the Right Care without a clinical field', () => {
    const { container } = renderHome();
    expect(screen.getByRole('button', { name: 'Pause automatic movement' })).toBeEnabled();
    const homes = container.querySelector('[data-home-section="homes"] ul');
    expect(homes?.className).toContain('animate-room-marquee');
    expect(screen.getByRole('link', { name: /For a parent or relative/i })).toHaveAttribute('href', '/find-the-right-care?for=parent');
    expect(screen.getByRole('link', { name: /For myself/i })).toHaveAttribute('href', '/find-the-right-care?for=myself');
    expect(screen.getByRole('link', { name: /After hospital or surgery/i })).toHaveAttribute('href', '/find-the-right-care?for=after-hospital');
    expect(screen.queryByLabelText(/diagnosis/i)).not.toBeInTheDocument();
  });

  it('drifts living and care the opposite way from the homes row', () => {
    const { container } = renderHome({
      careServices: [
        props.careServices[0],
        { _id: 'care.recovery', name: 'Recovery', slug: 'recovery', status: 'available', summary: 'Time to regain strength.', heroImage: null },
      ],
    });
    const homes = container.querySelector('[data-home-section="homes"] ul');
    const care = container.querySelector('[data-home-section="care"] ul');
    expect(homes).toHaveStyle({ animationDirection: 'normal' });
    expect(care?.className).toContain('animate-room-marquee');
    expect(care).toHaveStyle({ animationDirection: 'reverse' });
  });
});
