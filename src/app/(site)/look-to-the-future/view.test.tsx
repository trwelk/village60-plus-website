import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LookToTheFutureView } from './view';

function renderPage() {
  return render(<LookToTheFutureView />);
}

describe('LookToTheFutureView', () => {
  it('opens with a hero, then The Grove and The Heritage', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Two Residences/ })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: /The Grove/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /The Heritage/ })).toBeInTheDocument();
    expect(screen.getByText(/Keunaman Bungalow Estate in Matara — the same personal care/)).toBeInTheDocument();
    expect(screen.getByText(/Forty private rooms/)).toBeInTheDocument();
    const order = [...document.querySelectorAll('[data-future-section]')].map((node) => node.getAttribute('data-future-section'));
    expect(order).toEqual(['hero', 'grove', 'heritage']);
    expect(screen.getByRole('link', { name: /^The Grove/ })).toHaveAttribute('href', '/look-to-the-future/grove');
    expect(screen.getByRole('link', { name: /^The Heritage/ })).toHaveAttribute('href', '#heritage');
    expect(screen.getByRole('link', { name: /Discover The Grove/ })).toHaveAttribute('href', '/look-to-the-future/grove');
    expect(screen.getByRole('link', { name: /Discover The Heritage/ })).toHaveAttribute('href', '/look-to-the-future/heritage');
    expect(screen.getByRole('img', { name: /The Grove at dusk/ })).toHaveAttribute('src', '/homes/grove.jpg');
    expect(screen.getByRole('img', { name: /The Grove entrance/ })).toHaveAttribute('src', '/look-to-the-future/grove.jpg');
    expect(screen.getByRole('img', { name: /The Heritage estate/ })).toHaveAttribute('src', '/look-to-the-future/heritage.jpg');
  });

});
