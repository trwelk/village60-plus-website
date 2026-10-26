import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { HOME_PORTRAITS } from '@/lib/site-photos';
import { imageFixture } from '@/test/fixtures';
import { HomeView, type HomeOffering, type HomeViewProps } from './home-view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
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
  it('renders the story after the hero, then the remaining sections, without Find the Right Care', () => {
    const { container } = renderHome();
    expect([...container.querySelectorAll('[data-home-section]')].map((node) => node.getAttribute('data-home-section'))).toEqual([
      'hero',
      'story',
      'recognition',
      'oracle',
      'homes',
      'care',
      'silver-roots',
      'ecosystem',
      'trust',
    ]);
    const oracle = screen.getAllByRole('heading', { name: 'Oracle' })[0];
    const story = screen.getByRole('heading', { name: /A More Meaningful Tomorrow/ });
    expect(story.compareDocumentPosition(oracle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Find the Right Care' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Village 60 Plus/ })).toHaveAttribute('href', '/homes');
    expect(screen.getByRole('button', { name: /Arrange a private visit/ })).toBeInTheDocument();
    const spotlight = container.querySelector('[data-home-section="oracle"]');
    expect(spotlight).not.toBeNull();
    expect(within(spotlight as HTMLElement).getByText('Ten rooms for independent adults.')).toBeInTheDocument();
    expect(within(spotlight as HTMLElement).getByRole('link', { name: 'Learn More' })).toHaveAttribute('href', '/oracle');
    expect(within(spotlight as HTMLElement).getByRole('img', { name: 'Oracle exterior' })).toBeInTheDocument();
    expect(within(spotlight as HTMLElement).queryByRole('button', { name: /private visit/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Live well. Age exceptionally.');
    const recognition = container.querySelector('[data-home-section="recognition"]');
    expect(recognition).not.toBeNull();
    expect(within(recognition as HTMLElement).getByRole('region', { name: /Excellence in Elder Care/ })).toBeInTheDocument();
    expect(within(recognition as HTMLElement).getByText(/Global Business Excellence Awards 2026/)).toBeInTheDocument();
  });

  it('overlaps the two tallest Oracle photographs', () => {
    const wide = imageFixture('Oracle exterior');
    wide.asset.url = 'https://cdn.sanity.io/images/testproject/test/wide-1600x1000.jpg';
    const verandah = imageFixture('A long wooden verandah');
    verandah.asset.url = 'https://cdn.sanity.io/images/testproject/test/verandah-2400x3606.jpg';
    verandah.asset.metadata.dimensions = { width: 2400, height: 3606, aspectRatio: 2400 / 3606 };
    const bungalow = imageFixture('A white bungalow and bougainvillea');
    bungalow.asset.url = 'https://cdn.sanity.io/images/testproject/test/bungalow-2299x2838.jpg';
    bungalow.asset.metadata.dimensions = { width: 2299, height: 2838, aspectRatio: 2299 / 2838 };
    const { container } = renderHome({ oracleImages: [wide, bungalow, verandah] });
    const spotlight = container.querySelector('[data-home-section="oracle"]') as HTMLElement;
    const photos = within(spotlight).getAllByRole('img');
    expect(photos.map((photo) => photo.getAttribute('alt'))).toEqual([
      'A long wooden verandah',
      'A white bungalow and bougainvillea',
    ]);
  });

  it('shows photographs of the Oracle home in the spotlight', () => {
    const { container } = renderHome({ oracleImages: HOME_PORTRAITS });
    const spotlight = container.querySelector('[data-home-section="oracle"]') as HTMLElement;
    expect(within(spotlight).getAllByRole('img').map((photo) => photo.getAttribute('src'))).toEqual([
      '/home/oracle-sign.jpg',
      '/homes/court.jpg',
    ]);
  });

  it('links Oracle to /oracle and labels The Grove as coming soon', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /Ten rooms for independent adults/ })).toHaveAttribute('href', '/oracle');
    const grove = screen.getByRole('heading', { name: 'The Grove' }).closest('article');
    expect(grove).not.toBeNull();
    expect(within(grove as HTMLElement).getByText('Coming soon')).toBeInTheDocument();
    expect(within(grove as HTMLElement).getByRole('link')).toHaveAttribute('href', '/look-to-the-future');
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

  it('keeps the homes row moving and does not ask for a diagnosis', () => {
    const { container } = renderHome();
    expect(screen.getByRole('button', { name: 'Pause automatic movement' })).toBeEnabled();
    const homes = container.querySelector('[data-home-section="homes"] ul');
    expect(homes?.className).toContain('animate-room-marquee');
    expect(screen.queryByLabelText(/diagnosis/i)).not.toBeInTheDocument();
    expect(screen.getByText('You.')).toBeInTheDocument();
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
