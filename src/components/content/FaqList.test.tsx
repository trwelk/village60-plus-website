import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaqList } from './FaqList';

const answer = [
  {
    _type: 'block' as const,
    _key: 'b',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span' as const, _key: 's', text: 'No. Describe the situation and the team will explain the options.', marks: [] }],
  },
];

describe('FaqList', () => {
  it('uses a disclosure for each question and skips blanks', () => {
    render(
      <FaqList
        items={[
          { _id: 'faq.1', question: 'Do I need to know which type of care?', answer },
          { _id: 'faq.2', question: null, answer },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Questions' })).toBeInTheDocument();
    const summary = screen.getByText('Do I need to know which type of care?');
    expect(summary.tagName).toBe('SUMMARY');
    expect(screen.getByText(/Describe the situation/)).toBeInTheDocument();
    expect(screen.getAllByText(/Describe the situation/)).toHaveLength(1);
  });

  it('renders nothing when there are no questions', () => {
    const { container } = render(<FaqList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
