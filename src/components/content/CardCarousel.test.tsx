import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CardCarousel } from './CardCarousel';

function renderStrip(count: number) {
  return render(
    <CardCarousel label="home" heading={<h2>Our homes</h2>}>
      {Array.from({ length: count }, (_, index) => (
        <article key={index}>Home {index + 1}</article>
      ))}
    </CardCarousel>,
  );
}

function mockMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  })) as unknown as typeof window.matchMedia;
}

describe('CardCarousel', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'matchMedia');
  });

  it('drifts continuously, like the room row, and loops by repeating the cards', () => {
    mockMotion(false);
    renderStrip(3);
    const lists = screen.getAllByRole('list');
    expect(lists[0].className).toContain('animate-room-marquee');
    expect(lists[0].querySelectorAll('li')).toHaveLength(6);
    expect(lists[0].querySelectorAll('li[aria-hidden="true"]')).toHaveLength(3);
  });

  it('stops when asked, then steps one card from the buttons', async () => {
    mockMotion(false);
    const user = userEvent.setup();
    renderStrip(3);
    await user.click(screen.getByRole('button', { name: 'Pause automatic movement' }));
    const list = screen.getByRole('list');
    expect(list.className).toContain('snap-x');
    expect(list.className).not.toContain('animate-room-marquee');

    const scrollBy = vi.spyOn(HTMLElement.prototype, 'scrollBy').mockImplementation(() => {});
    await user.click(screen.getByRole('button', { name: 'Next home' }));
    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect((scrollBy.mock.calls[0][0] as ScrollToOptions).left).toBeGreaterThan(0);
    scrollBy.mockRestore();
  });

  it('stays still when motion is reduced', () => {
    mockMotion(true);
    renderStrip(3);
    const list = screen.getByRole('list');
    expect(list.className).not.toContain('animate-room-marquee');
    expect(list.querySelectorAll('li')).toHaveLength(3);
    expect(screen.queryByRole('button', { name: 'Pause automatic movement' })).not.toBeInTheDocument();
  });

  it('hides the controls for a single card and shows the empty note when there are none', () => {
    const { rerender } = renderStrip(1);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <CardCarousel label="home" heading={<h2>Our homes</h2>} empty={<p>Nothing published</p>}>
        {null}
      </CardCarousel>,
    );
    expect(screen.getByText('Nothing published')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
