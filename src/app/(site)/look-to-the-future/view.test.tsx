import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LookToTheFutureView } from './view';

function renderPage() {
  return render(<LookToTheFutureView />);
}

describe('LookToTheFutureView', () => {
  it('opens with a hero, then The Heritage and The Grove', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Two Residences/ })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: /The Grove/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /The Heritage/ })).toBeInTheDocument();
    expect(screen.getByText(/Keunaman Bungalow Estate in Matara/)).toBeInTheDocument();
    expect(screen.getByText(/The Grove is taking shape in Kottawa — the same personal care/)).toBeInTheDocument();
    expect(screen.getByText(/Forty private rooms/)).toBeInTheDocument();
    const order = [...document.querySelectorAll('[data-future-section]')].map((node) => node.getAttribute('data-future-section'));
    expect(order).toEqual(['hero', 'heritage', 'grove']);
    expect(screen.getByRole('link', { name: /^The Heritage/ })).toHaveAttribute('href', '/look-to-the-future/heritage');
    expect(screen.getByRole('link', { name: /^The Grove/ })).toHaveAttribute('href', '#grove');
    expect(screen.getByRole('link', { name: /Discover The Grove/ })).toHaveAttribute('href', '/look-to-the-future/grove');
    expect(screen.getByRole('link', { name: /Discover The Heritage/ })).toHaveAttribute('href', '/look-to-the-future/heritage');
    const hero = document.querySelector('[data-future-section="hero"]');
    expect(hero).toBeTruthy();
    expect(within(hero as HTMLElement).getByRole('img', { name: /The Heritage estate/ })).toHaveAttribute(
      'src',
      '/look-to-the-future/heritage.jpg',
    );
    expect(screen.getByRole('img', { name: /The Grove entrance/ })).toHaveAttribute('src', '/look-to-the-future/grove.jpg');
    const heritage = document.querySelector('[data-future-section="heritage"]');
    expect(heritage).toBeTruthy();
    expect(within(heritage as HTMLElement).getByRole('img', { name: /The Heritage estate/ })).toHaveAttribute(
      'src',
      '/look-to-the-future/heritage.jpg',
    );
  });

});
