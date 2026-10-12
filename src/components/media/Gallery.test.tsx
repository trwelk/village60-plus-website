import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { Gallery } from './Gallery';

const images = [imageFixture('Front garden'), imageFixture('Dining room'), imageFixture('Verandah')];

describe('Gallery', () => {
  it('renders each usable image inside a labelled region', () => {
    render(<Gallery images={images} label="Photographs of Serenity" />);
    expect(screen.getByRole('region', { name: 'Photographs of Serenity' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Front garden' })).toHaveAttribute('loading', 'lazy');
  });

  it('skips images with no alt and renders nothing when none remain', () => {
    render(<Gallery images={[{ ...imageFixture('x'), alt: '' }, null]} label="Photographs" />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('hides the controls when there is only one image', () => {
    render(<Gallery images={[images[0]]} label="Photographs of Serenity" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('scrolls the strip from the buttons and never starts a timer', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(HTMLElement.prototype, 'scrollBy').mockImplementation(() => {});
    render(<Gallery images={images} label="Photographs of Serenity" />);
    await user.click(screen.getByRole('button', { name: 'Next photograph' }));
    await user.click(screen.getByRole('button', { name: 'Previous photograph' }));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0]).toMatchObject({ left: expect.any(Number) });
    expect((spy.mock.calls[0][0] as ScrollToOptions).left).toBeGreaterThan(0);
    expect((spy.mock.calls[1][0] as ScrollToOptions).left).toBeLessThan(0);
    spy.mockRestore();
  });
});
