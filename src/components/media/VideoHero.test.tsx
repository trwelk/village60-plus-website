import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { shouldAutoplayVideo, VideoHero, type HeroVideo } from './VideoHero';

const video: HeroVideo = {
  description: 'A quiet morning at the residence',
  poster: imageFixture('Morning light across the verandah'),
  videoUrl: 'https://cdn.sanity.io/files/test/hero.mp4',
  captionsUrl: 'https://cdn.sanity.io/files/test/hero.vtt',
};

function mockMedia({ matches, saveData = false }: { matches: boolean; saveData?: boolean }) {
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
  Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData } });
}

describe('shouldAutoplayVideo', () => {
  it('autoplays only when the visitor has neither reduced motion nor data saver', () => {
    expect(shouldAutoplayVideo({ reducedMotion: false, saveData: false })).toBe(true);
    expect(shouldAutoplayVideo({ reducedMotion: true, saveData: false })).toBe(false);
    expect(shouldAutoplayVideo({ reducedMotion: false, saveData: true })).toBe(false);
  });
});

describe('VideoHero', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, 'connection');
  });

  it('shows the poster and a play button, and does not mount a video, when motion is reduced', async () => {
    mockMedia({ matches: true });
    const { container } = render(<VideoHero video={video} />);
    expect(screen.getByRole('img', { name: 'Morning light across the verandah' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play video' })).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector('video')).toBeNull());
  });

  it('autoplays a muted video with captions when motion and data saver allow it', async () => {
    mockMedia({ matches: false });
    const { container } = render(<VideoHero video={video} />);
    await waitFor(() => expect(container.querySelector('video')).not.toBeNull());
    const el = container.querySelector('video') as HTMLVideoElement;
    expect(el.autoplay).toBe(true);
    expect(el.muted).toBe(true);
    expect(el.playsInline).toBe(true);
    expect(el).toHaveAttribute('aria-label', 'A quiet morning at the residence');
    const track = el.querySelector('track');
    expect(track).toHaveAttribute('kind', 'captions');
    expect(track).toHaveAttribute('src', video.captionsUrl);
    expect(track).toHaveAttribute('srclang', 'en');
    expect(screen.getByRole('button', { name: 'Pause video' })).toBeInTheDocument();
  });

  it('pauses from the button', async () => {
    mockMedia({ matches: false });
    const user = userEvent.setup();
    const { container } = render(<VideoHero video={video} />);
    await waitFor(() => expect(container.querySelector('video')).not.toBeNull());
    const el = container.querySelector('video') as HTMLVideoElement;
    const pause = vi.spyOn(el, 'pause').mockImplementation(() => {});
    await user.click(screen.getByRole('button', { name: 'Pause video' }));
    expect(pause).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Play video' })).toBeInTheDocument();
  });

  it('renders the poster only when there is no video file', () => {
    mockMedia({ matches: false });
    const { container } = render(<VideoHero video={{ ...video, videoUrl: null, captionsUrl: null }} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelector('video')).toBeNull();
  });
});
