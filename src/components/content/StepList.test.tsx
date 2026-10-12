import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepList } from './StepList';

describe('StepList', () => {
  it('renders an ordered list and skips untitled steps', () => {
    render(
      <StepList
        items={[
          { _key: '1', title: 'Call or WhatsApp', description: 'Tell us what you need.' },
          { _key: '2', title: 'Visit', description: null },
          { _key: '3', title: null, description: 'skipped' },
        ]}
      />,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('skipped')).not.toBeInTheDocument();
  });
});
