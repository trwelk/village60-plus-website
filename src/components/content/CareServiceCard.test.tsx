import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CareServiceCard } from './CareServiceCard';

describe('CareServiceCard', () => {
  it('links to the care page and shows the status', () => {
    render(
      <CareServiceCard
        service={{
          _id: 'c',
          name: 'Respite care',
          slug: 'respite-care',
          status: 'available',
          summary: 'A short stay while the family is away.',
          typicalDuration: 'A few days to a few weeks',
        }}
      />,
    );
    expect(screen.getByText('Available now')).toBeInTheDocument();
    expect(screen.getByText('A few days to a few weeks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Respite care/ })).toHaveAttribute('href', '/living-and-care/respite-care');
  });
});
