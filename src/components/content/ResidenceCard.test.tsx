import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { ResidenceCard } from './ResidenceCard';

describe('ResidenceCard', () => {
  it('links Oracle to /oracle and shows status, location and care chips', () => {
    render(
      <ResidenceCard
        residence={{
          _id: 'residence.oracle',
          name: 'Oracle',
          slug: 'oracle',
          status: 'limited',
          shortLocation: 'Battaramulla',
          summary: 'A flagship residence with limited availability.',
          heroImage: imageFixture('Oracle residence'),
          careTypes: [{ _id: 'c1', name: 'Independent living', slug: 'independent-living', status: 'available' }],
        }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Oracle residence' })).toBeInTheDocument();
    expect(screen.getByText('Limited availability')).toBeInTheDocument();
    expect(screen.getByText('Battaramulla')).toBeInTheDocument();
    expect(screen.getByText('Independent living')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Oracle/ })).toHaveAttribute('href', '/oracle');
  });

  it('links other homes under /homes', () => {
    render(
      <ResidenceCard
        residence={{ _id: 'r', name: 'Serenity', slug: 'serenity', status: 'available', heroImage: null, careTypes: null }}
      />,
    );
    expect(screen.getByRole('link', { name: /Serenity/ })).toHaveAttribute('href', '/homes/serenity');
  });
});
