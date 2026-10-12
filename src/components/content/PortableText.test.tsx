import { render, screen } from '@testing-library/react';
import type { PortableTextBlock } from '@portabletext/react';
import { describe, expect, it } from 'vitest';
import { PortableText, safeHref } from './PortableText';

function block(text: string, style = 'normal', marks: PortableTextBlock['markDefs'] = []): PortableTextBlock {
  return {
    _type: 'block',
    _key: style + text.slice(0, 6),
    style,
    markDefs: marks,
    children: [{ _type: 'span', _key: 's', text, marks: marks?.[0]?._key ? [marks[0]._key] : [] }],
  };
}

describe('safeHref', () => {
  it('allows site paths and ordinary URL schemes', () => {
    expect(safeHref('/homes/serenity')).toBe('/homes/serenity');
    expect(safeHref('https://example.com/a')).toBe('https://example.com/a');
    expect(safeHref('mailto:hello@example.com')).toBe('mailto:hello@example.com');
    expect(safeHref('tel:+94112504838')).toBe('tel:+94112504838');
  });
  it('rejects scripts, protocol-relative URLs and non-strings', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull();
    expect(safeHref('//evil.example')).toBeNull();
    expect(safeHref('data:text/html,hi')).toBeNull();
    expect(safeHref(undefined)).toBeNull();
  });
});

describe('PortableText', () => {
  it('renders paragraphs, h2 and h3, and never an h1', () => {
    render(<PortableText value={[block('A paragraph.'), block('A heading', 'h2'), block('Smaller', 'h3')]} />);
    expect(screen.getByText('A paragraph.').tagName).toBe('P');
    expect(screen.getByRole('heading', { level: 2, name: 'A heading' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Smaller' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('renders a safe link and drops an unsafe one', () => {
    render(
      <PortableText
        value={[
          block('Visit', 'normal', [{ _key: 'ok', _type: 'link', href: '/contact' }]),
          block('Bad', 'normal', [{ _key: 'bad', _type: 'link', href: 'javascript:alert(1)' }]),
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute('href', '/contact');
    expect(screen.getByText('Bad').closest('a')).toBeNull();
  });

  it('opens http links in a new tab', () => {
    render(<PortableText value={[block('Map', 'normal', [{ _key: 'm', _type: 'link', href: 'https://maps.example/x' }])]} />);
    const link = screen.getByRole('link', { name: 'Map' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders nothing for empty input', () => {
    const { container, rerender } = render(<PortableText value={null} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<PortableText value={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
