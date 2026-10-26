import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { OurStoryView } from './view';

describe('OurStoryView', () => {
  it('follows the journey from the first home to the next generation', async () => {
    const { container } = render(<OurStoryView />);

    const title = screen.getByRole('heading', { level: 1, name: 'From Care Home to Care Ecosystem.' });
    const journey = screen.getByRole('heading', { name: 'A Story of People, Purpose and Possibilities.' });
    const beginning = screen.getByRole('heading', { name: 'The Beginning' });
    const homes = screen.getByRole('heading', { name: 'Growing Our Homes' });
    const education = screen.getByRole('heading', { name: 'Education & Training' });
    const health = screen.getByRole('heading', { name: 'Health & Wellbeing' });
    const life = screen.getByRole('heading', { name: 'Life at Home' });
    const community = screen.getByRole('heading', { name: 'Community' });
    const accreditations = screen.getByRole('heading', { name: 'International Accreditations' });
    const global = screen.getByRole('heading', { name: 'Global Opportunities' });
    const next = screen.getByRole('heading', { name: 'The Next Generation' });
    const silver = screen.getByRole('heading', { name: 'Care, connected.' });
    const oracle = screen.getByRole('heading', { name: 'An enlightened retirement residence.' });
    const destination = screen.getByRole('heading', { name: 'Your next chapter.' });
    const close = screen.getByRole('heading', { name: 'Nearly Two Decades. One Purpose.' });

    for (const [earlier, later] of [
      [title, journey],
      [journey, beginning],
      [beginning, homes],
      [homes, education],
      [education, health],
      [health, life],
      [life, community],
      [community, accreditations],
      [accreditations, global],
      [global, next],
      [next, silver],
      [silver, oracle],
      [oracle, destination],
      [destination, close],
    ] as const) {
      expect(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }

    expect(screen.getByText(/One purpose\. Many branches\./)).toBeInTheDocument();
    expect(screen.getByText('One journey since 2008.')).toBeInTheDocument();
    expect(screen.getByText('CILS')).toBeInTheDocument();
    expect(screen.getByText('PLATINUM 60')).toBeInTheDocument();
    expect(screen.getByText('Encourage SL')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn more about Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByRole('link', { name: 'View Oracle' })).toHaveAttribute('href', '/oracle');
    expect(screen.getByRole('link', { name: 'Explore Destination Retirement' })).toHaveAttribute('href', '/destination-retirement');
    expect(screen.getByRole('img', { name: 'A cliffside pool looking out to the ocean' })).toHaveAttribute('src', '/destination-retirement/hero.jpg');
    expect(screen.getByRole('link', { name: 'Explore Our Homes' })).toHaveAttribute('href', '/homes');
    expect(screen.getByRole('link', { name: 'Discover Living & Care' })).toHaveAttribute('href', '/living-and-care');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('img', { name: /pink bougainvillea along the verandah/ }).length).toBeGreaterThan(0);
    expect(await axe(container)).toHaveNoViolations();
  }, 20000);
});
