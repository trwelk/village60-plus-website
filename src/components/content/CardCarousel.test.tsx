import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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

describe('CardCarousel', () => {
  it('scrolls one card at a time and does not autoplay', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(HTMLElement.prototype, 'scrollBy').mockImplementation(() => {});
    renderStrip(3);

    expect(screen.getByRole('button', { name: 'Previous home' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next home' }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as ScrollToOptions).left).toBeGreaterThan(0);
    spy.mockRestore();
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
