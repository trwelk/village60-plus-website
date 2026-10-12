import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LegalView } from './view';

const body = [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text: 'Draft notice for counsel review.', marks: [] }] },
];

describe('LegalView', () => {
  it('renders one h1, the body and the review date', () => {
    render(<LegalView title="Privacy notice" body={body} lastReviewed="2026-10-12" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('Draft notice for counsel review.')).toBeInTheDocument();
    expect(screen.getByText('Last reviewed 2026-10-12')).toBeInTheDocument();
  });
});
