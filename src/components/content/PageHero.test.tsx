import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { PageHero } from './PageHero';

describe('PageHero', () => {
  it('renders a single h1, the intro and a priority image', () => {
    render(
      <PageHero title="Our homes" intro="Different homes, one philosophy." image={imageFixture('A garden')} status="available">
        <a href="tel:+94112504838">Call</a>
      </PageHero>,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Our homes' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('Different homes, one philosophy.')).toBeInTheDocument();
    expect(screen.getByText('Available now')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'A garden' })).toHaveAttribute('fetchpriority', 'high');
    expect(screen.getByRole('link', { name: 'Call' })).toBeInTheDocument();
  });

  it('uses the dark badge on a night hero', () => {
    render(<PageHero title="Oracle" tone="night" status="limited" />);
    expect(screen.getByText('Limited availability').className).toContain('text-pale-gold');
  });
});
