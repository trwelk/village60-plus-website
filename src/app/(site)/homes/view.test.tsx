import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import type { ResidenceCardData } from '@/components/content/ResidenceCard';
import { HomesView } from './view';

const residences: ResidenceCardData[] = [
  {
    _id: 'residence.serenity',
    name: 'Serenity',
    slug: 'serenity',
    status: 'available',
    shortLocation: 'Colombo',
    summary: 'A smaller home.',
    heroImage: imageFixture('Serenity exterior'),
    careTypes: [{ _id: 'care.residential-care', name: 'Residential Care', slug: 'residential-care' }],
  },
  {
    _id: 'residence.the-grove',
    name: 'The Grove',
    slug: 'the-grove',
    status: 'coming-soon',
    shortLocation: 'Kottawa',
    summary: 'Not open yet.',
    heroImage: imageFixture('The Grove'),
    careTypes: [],
  },
];

describe('HomesView', () => {
  it('filters by location, care type and status, and keeps The Grove labelled', async () => {
    render(<HomesView title="Our homes" intro="Different homes, one philosophy." residences={residences} contact={contactFixture} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const grove = screen.getByRole('heading', { name: 'The Grove' }).closest('article');
    expect(within(grove as HTMLElement).getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Find the Right Care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(screen.getByRole('heading', { name: 'Which home may suit you?' })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Location'), 'kottawa');
    expect(screen.getByRole('heading', { name: 'The Grove' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Serenity' })).not.toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText('Location'));
    await userEvent.selectOptions(screen.getByLabelText('Care type'), 'residential-care');
    expect(screen.getByRole('heading', { name: 'Serenity' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'The Grove' })).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Care type'), '');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'coming-soon');
    expect(screen.getByRole('heading', { name: 'The Grove' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Serenity' })).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Status'), '');
    await userEvent.type(screen.getByLabelText('Location'), 'zzzz');
    expect(screen.getByText('No homes match those filters.')).toBeInTheDocument();
  });
});
