import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SiteError from './error';

describe('SiteError', () => {
  it('points to contact and hides the exception text', () => {
    render(<SiteError error={new Error('secret stack')} reset={() => undefined} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('Please call or WhatsApp us.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(screen.queryByText(/secret stack/)).not.toBeInTheDocument();
  });
});
