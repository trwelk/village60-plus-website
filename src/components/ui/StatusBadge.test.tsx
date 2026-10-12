import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('shows the exact spec label', () => {
    render(<StatusBadge status="in-development" />);
    expect(screen.getByText('In development')).toBeInTheDocument();
  });
  it('uses text-safe colours on light and dark tones', () => {
    const { rerender } = render(<StatusBadge status="coming-soon" />);
    expect(screen.getByText('Coming soon').className).toContain('text-bronze');
    rerender(<StatusBadge status="coming-soon" tone="dark" />);
    expect(screen.getByText('Coming soon').className).toContain('text-pale-gold');
  });
});
