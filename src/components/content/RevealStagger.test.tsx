import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RevealStagger } from './RevealStagger';

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

describe('RevealStagger', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rises each item once the list enters view', () => {
    mockMotion(false);
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(private callback: IntersectionObserverCallback) {}
        observe() {
          this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
        }
        disconnect() {}
        unobserve() {}
      },
    );

    render(
      <RevealStagger>
        <p>Independent Living</p>
        <p>Residential Care</p>
      </RevealStagger>,
    );

    const items = screen.getAllByRole('listitem');
    expect(items[0].className).toContain('care-rise');
    expect(items[1]).toHaveStyle({ animationDelay: '110ms' });
  });

  it('leaves items still when motion is reduced', () => {
    mockMotion(true);
    render(
      <RevealStagger>
        <p>Recovery</p>
      </RevealStagger>,
    );
    const item = screen.getByRole('listitem');
    expect(item.className).not.toContain('care-rise');
    expect(item.className).not.toContain('opacity-0');
  });
});
