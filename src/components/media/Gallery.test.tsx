import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { Gallery } from './Gallery';

const images = [imageFixture('Front garden'), imageFixture('Dining room'), imageFixture('Verandah')];

describe('Gallery', () => {
  it('renders the first photograph in a labelled region and offers the rest', () => {
    render(<Gallery images={images} label="Photographs of Serenity" title="A look through the house" titleId="photographs" intro="The house, in pictures" />);
    expect(screen.getByRole('region', { name: 'Photographs of Serenity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'A look through the house' })).toHaveAttribute('id', 'photographs');
    expect(screen.getByText('The house, in pictures')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Front garden' })).toHaveAttribute('loading', 'lazy');
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Show Front garden' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Show Dining room' })).not.toHaveAttribute('aria-current');
  });

  it('prints a caption on the photograph when one is published', () => {
    render(<Gallery images={[{ ...images[0], caption: 'Morning on the verandah' }]} label="Photographs of Serenity" />);
    expect(screen.getByText('Morning on the verandah')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('skips images with no alt and renders nothing when none remain', () => {
    render(<Gallery images={[{ ...imageFixture('x'), alt: '' }, null]} label="Photographs" />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('hides the controls when there is only one image', () => {
    render(<Gallery images={[images[0]]} label="Photographs of Serenity" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('moves between photographs from the buttons and the chips, wrapping at the ends', async () => {
    const user = userEvent.setup();
    render(<Gallery images={images} label="Photographs of Serenity" />);
    await user.click(screen.getByRole('button', { name: 'Next photograph' }));
    expect(screen.getByRole('img', { name: 'Dining room' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Dining room' })).toHaveAttribute('aria-current', 'true');
    await user.click(screen.getByRole('button', { name: 'Show Verandah' }));
    expect(screen.getByRole('img', { name: 'Verandah' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next photograph' }));
    expect(screen.getByRole('img', { name: 'Front garden' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Previous photograph' }));
    expect(screen.getByRole('img', { name: 'Verandah' })).toBeInTheDocument();
  });

  it('reveals the photographs past the first row', async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 9 }, (_, i) => imageFixture(`Photograph ${i + 1}`));
    render(<Gallery images={many} label="Photographs of Serenity" />);
    expect(screen.queryByRole('button', { name: 'Show Photograph 9' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'View more' }));
    expect(screen.getByRole('button', { name: 'Show Photograph 9' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show less' }));
    expect(screen.queryByRole('button', { name: 'Show Photograph 9' })).not.toBeInTheDocument();
  });
});
