import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import type { ResidenceCardData } from '@/components/content/ResidenceCard';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import { HomesView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

function photo(alt: string, id: string) {
  const image = imageFixture(alt);
  return {
    ...image,
    asset: {
      ...image.asset,
      _id: `image-${id}000000000000-1600x1000-jpg`,
      url: `https://cdn.sanity.io/images/test/${id}-1600x1000.jpg`,
    },
  };
}

const residences: ResidenceCardData[] = [
  {
    _id: 'residence.oracle',
    name: 'Oracle',
    slug: 'oracle',
    status: 'limited',
    shortLocation: 'Pepiliyana',
    summary: 'Ten rooms.',
    heroImage: photo('Oracle exterior', 'oracle'),
    careTypes: [],
  },
  {
    _id: 'residence.the-grove',
    name: 'The Grove',
    slug: 'the-grove',
    status: 'coming-soon',
    shortLocation: 'Kottawa',
    summary: 'Not open yet.',
    heroImage: photo('The Grove', 'grove'),
    careTypes: [],
  },
  {
    _id: 'residence.tranquility',
    name: 'Tranquility',
    slug: 'tranquility',
    status: 'available',
    shortLocation: 'Narahenpita, Colombo',
    summary: 'A city home.',
    heroImage: photo('Tranquility', 'tranquility'),
    careTypes: [],
  },
  {
    _id: 'residence.serenity',
    name: 'Serenity',
    slug: 'serenity',
    status: 'available',
    shortLocation: 'Railway Avenue',
    summary: 'A smaller home.',
    heroImage: photo('Serenity exterior', 'serenity'),
    careTypes: [],
  },
  {
    _id: 'residence.house-on-the-hill',
    name: 'House on the Hill',
    slug: 'house-on-the-hill',
    status: 'available',
    shortLocation: 'Kirulapone, Colombo',
    summary: 'A quieter home.',
    heroImage: photo('House on the Hill', 'hill'),
    careTypes: [],
  },
  {
    _id: 'residence.enchanted-fields',
    name: 'Enchanted Fields',
    slug: 'enchanted-fields',
    status: 'available',
    shortLocation: 'Homagama',
    summary: 'A greener setting.',
    heroImage: photo('Enchanted Fields', 'fields'),
    careTypes: [],
  },
];

function renderHomes(props: Partial<Parameters<typeof HomesView>[0]> = {}) {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <HomesView residences={residences} {...props} />
    </EnquiryProvider>,
  );
}

describe('HomesView', () => {
  it('presents the portfolio, with Oracle, The Grove and the established homes', () => {
    renderHomes();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'A Place for Every Chapter.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore our homes' })).toHaveAttribute('href', '#portfolio');
    expect(screen.getAllByRole('button', { name: 'Enquire' })).toHaveLength(2);

    expect(screen.getByRole('heading', { name: 'Oracle' })).toBeInTheDocument();
    expect(screen.getByText('Pepiliyana')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discover Oracle' })).toHaveAttribute('href', '/oracle');
    expect(screen.getByRole('link', { name: 'View the rooms' })).toHaveAttribute('href', '/oracle#oracle-rooms');
    expect(screen.getByText('Ten unique rooms')).toBeInTheDocument();
    expect(screen.getByText('Independent living')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'The Grove' })).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText('80 New Rooms')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discover The Grove' })).toHaveAttribute('href', '/homes/the-grove');
    expect(screen.getByRole('button', { name: 'Register your interest' })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Homes With Their Own Character.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tranquility' })).toBeInTheDocument();
    expect(screen.getByText('Narahenpita')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn more about Serenity' })).toHaveAttribute('href', '/homes/serenity');
    expect(screen.getByRole('link', { name: 'Learn more about House on the Hill' })).toHaveAttribute('href', '/homes/house-on-the-hill');
    expect(screen.getByRole('link', { name: 'Learn more about Enchanted Fields' })).toHaveAttribute('href', '/homes/enchanted-fields');

    expect(screen.getByRole('heading', { name: "Let's Find the Right Option." })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get guidance' })).toHaveAttribute('href', '/find-the-right-care');
    expect(screen.queryByRole('heading', { name: 'Which home may suit you?' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Location')).not.toBeInTheDocument();
  });

  it('omits a featured home that has not been published', () => {
    renderHomes({ residences: residences.filter((residence) => residence.slug !== 'oracle' && residence.slug !== 'the-grove') });
    expect(screen.queryByRole('heading', { name: 'Oracle' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'The Grove' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tranquility' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore our homes' })).toHaveAttribute('href', '#portfolio');
  });
});
