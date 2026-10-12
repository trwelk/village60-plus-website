import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CapabilityList, provisionLabel } from './CapabilityList';

describe('CapabilityList', () => {
  it('names the three ways a service is provided', () => {
    expect(provisionLabel('included')).toBe('Included');
    expect(provisionLabel('optional-extra')).toBe('Quoted separately');
    expect(provisionLabel('partner-arranged')).toBe('Arranged through a partner');
    expect(provisionLabel('mystery')).toBeNull();
  });

  it('shows status and provision on every item and skips untitled ones', () => {
    render(
      <CapabilityList
        items={[
          { _key: 'a', title: 'Meals', description: 'Three meals a day.', provision: 'included', status: 'available' },
          { _key: 'b', title: 'Physiotherapy', description: null, provision: 'partner-arranged', status: 'pilot' },
          { _key: 'c', title: null, description: 'ignored', provision: 'included', status: 'available' },
        ]}
      />,
    );
    expect(screen.getByText('Meals')).toBeInTheDocument();
    expect(screen.getByText('Included')).toBeInTheDocument();
    expect(screen.getByText('Available now')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Arranged through a partner')).toBeInTheDocument();
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });

  it('renders nothing for an empty list', () => {
    const { container } = render(<CapabilityList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
