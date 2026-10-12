import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { SanityImage } from './SanityImage';

describe('SanityImage', () => {
  it('renders alt text, explicit dimensions and a sized Sanity CDN URL', () => {
    render(<SanityImage image={imageFixture('Garden at Serenity')} width={800} />);
    const img = screen.getByRole('img', { name: 'Garden at Serenity' });
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '500'); // 800 / aspect 1.6
    const src = img.getAttribute('src') ?? '';
    expect(src).toContain('cdn.sanity.io');
    expect(src).toContain('auto=format');
    expect(src).toContain('w=800');
    expect(src).toContain('h=500');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img.getAttribute('srcset')).toContain('1600w');
  });

  it('loads the priority image eagerly', () => {
    render(<SanityImage image={imageFixture('Hero')} width={1200} height={750} priority />);
    const img = screen.getByRole('img', { name: 'Hero' });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('height', '750');
  });

  it('renders nothing without an asset or without alt text', () => {
    const { container, rerender } = render(<SanityImage image={null} width={400} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<SanityImage image={{ ...imageFixture('x'), alt: '   ' }} width={400} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<SanityImage image={{ ...imageFixture('x'), asset: null }} width={400} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the caption in a figure when asked', () => {
    render(
      <SanityImage
        image={{ ...imageFixture('Courtyard'), caption: 'The courtyard in the morning' }}
        width={600}
        showCaption
      />,
    );
    expect(screen.getByText('The courtyard in the morning').tagName).toBe('FIGCAPTION');
  });
});
