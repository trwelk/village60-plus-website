import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StaticMap } from './StaticMap';

const address = {
  line1: '133/19 Nawala Road',
  line2: null,
  city: 'Colombo 05',
  postcode: null,
  country: 'Sri Lanka',
  landmarks: ['Near the park'],
  location: { lat: 6.91, lng: 79.88 },
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Serenity',
  visitingNotes: 'Visits are by appointment.',
};

describe('StaticMap', () => {
  it('shows the address and directions before any map is loaded', () => {
    const { container } = render(<StaticMap address={address} mapsKey="test-key" label="Serenity" />);
    expect(screen.getByText(/133\/19 Nawala Road/)).toBeInTheDocument();
    expect(screen.getByText('Visits are by appointment.')).toBeInTheDocument();
    expect(screen.getByText('Nearby: Near the park')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get directions' })).toHaveAttribute('href', address.directionsUrl);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByRole('button', { name: 'Load interactive map' })).toBeInTheDocument();
  });

  it('inserts the embed only after the button is pressed', async () => {
    const user = userEvent.setup();
    const { container } = render(<StaticMap address={address} mapsKey="test-key" label="Serenity" />);
    await user.click(screen.getByRole('button', { name: 'Load interactive map' }));
    const frame = container.querySelector('iframe');
    expect(frame).toHaveAttribute('title', 'Map of Serenity');
    expect(frame?.getAttribute('src')).toContain('maps/embed/v1/place');
    expect(frame?.getAttribute('src')).toContain('q=6.91%2C79.88');
    expect(screen.queryByRole('button', { name: 'Load interactive map' })).not.toBeInTheDocument();
  });

  it('shows a pinned map without an API key, and keeps directions when there are no coordinates', () => {
    const { rerender, container } = render(<StaticMap address={address} mapsKey={null} label="Serenity" />);
    expect(screen.getByRole('link', { name: 'Get directions' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load interactive map' })).not.toBeInTheDocument();
    const frame = container.querySelector('iframe');
    expect(frame).toHaveAttribute('title', 'Map of Serenity');
    expect(frame?.getAttribute('src')).toContain('output=embed');
    expect(frame?.getAttribute('src')).toContain('q=6.91%2C79.88');
    rerender(<StaticMap address={{ ...address, location: null }} mapsKey="test-key" label="Serenity" />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get directions' })).toBeInTheDocument();
  });
});
