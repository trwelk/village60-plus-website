import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionList } from './SectionList';

const body = [
  {
    _type: 'block' as const,
    _key: 'b',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span' as const, _key: 's', text: 'People should grow older with dignity.', marks: [] }],
  },
];

describe('SectionList', () => {
  it('renders each section heading and drops an unsafe call to action', () => {
    render(
      <SectionList
        sections={[
          { _key: 'a', heading: 'A home first', body, tone: 'ivory', cta: { label: 'Read more', href: '/our-story' } },
          { _key: 'b', heading: 'The next chapter', body: null, tone: 'green', status: 'coming-soon', cta: { label: 'Bad', href: 'javascript:alert(1)' } },
          { _key: 'c', heading: null, body },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'A home first' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/our-story');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Bad' })).not.toBeInTheDocument();
    expect(screen.queryByText('People should grow older with dignity.')).toBeInTheDocument();
  });
});
