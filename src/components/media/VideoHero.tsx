'use client';

import { useEffect, useRef, useState } from 'react';
import type { SanityImageSource } from '@sanity/image-url';
import { Button } from '@/components/ui/Button';
import { urlFor } from '@/sanity/image';
import { SanityImage, type CmsImage } from './SanityImage';

export type HeroVideo = {
  description?: string | null;
  poster?: CmsImage | null;
  videoUrl?: string | null;
  captionsUrl?: string | null;
};

/** Spec §18: no autoplay for reduced-motion or data-saver visitors. */
export function shouldAutoplayVideo(prefs: { reducedMotion: boolean; saveData: boolean }): boolean {
  return !prefs.reducedMotion && !prefs.saveData;
}

function readPrefs(): { reducedMotion: boolean; saveData: boolean } {
  let reducedMotion = true;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    reducedMotion = true;
  }
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return { reducedMotion, saveData: connection?.saveData === true };
}

export function VideoHero({
  video,
  width = 1280,
  fill = false,
  appearance = 'button',
}: {
  video: HeroVideo | null | undefined;
  width?: number;
  fill?: boolean;
  /** `watch` leaves the still photograph in place until the visitor presses play. */
  appearance?: 'button' | 'watch';
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (appearance === 'watch') return;
    if (!video?.videoUrl) return;
    if (!shouldAutoplayVideo(readPrefs())) return;
    queueMicrotask(() => {
      setShowVideo(true);
      setPlaying(true);
    });
  }, [appearance, video?.videoUrl]);

  if (!video?.poster?.asset?.url && !video?.videoUrl) return null;

  function play() {
    setShowVideo(true);
    setPlaying(true);
    queueMicrotask(() => {
      void ref.current?.play();
    });
  }

  function pause() {
    ref.current?.pause();
    setPlaying(false);
  }

  const posterUrl =
    video.poster?.asset?.url && video.poster.alt?.trim()
      ? urlFor(video.poster as SanityImageSource)
          .width(width)
          .height(Math.round(width / (video.poster.asset.metadata?.dimensions?.aspectRatio || 1.6)))
          .fit('crop')
          .url()
      : undefined;

  return (
    <div className={fill ? 'absolute inset-0' : 'relative'}>
      {showVideo && video.videoUrl ? (
        <video
          ref={ref}
          className={fill ? 'h-full w-full object-cover' : 'h-auto w-full rounded-card'}
          autoPlay
          muted
          playsInline
          loop
          poster={posterUrl}
          aria-label={video.description ?? undefined}
        >
          <source src={video.videoUrl} type="video/mp4" />
          {video.captionsUrl ? <track kind="captions" src={video.captionsUrl} srcLang="en" label="English" default /> : null}
        </video>
      ) : appearance === 'watch' ? null : (
        video.poster && <SanityImage image={video.poster} width={fill ? 1920 : width} height={fill ? 1080 : undefined} priority cover={fill} sizes={fill ? '100vw' : undefined} />
      )}
      {video.videoUrl && (
        <div className={fill ? (appearance === 'watch' ? 'absolute right-6 bottom-24 z-20 md:bottom-8' : 'absolute right-6 bottom-6 z-20') : 'mt-3'}>
          {appearance === 'watch' ? (
            <button
              type="button"
              onClick={playing ? pause : play}
              className="inline-flex items-center gap-3 text-[13px] font-medium tracking-[0.16em] text-ivory uppercase"
            >
              <span aria-hidden className="grid size-11 place-items-center rounded-full border border-ivory/80">
                {playing ? (
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="ml-0.5 size-3.5" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                )}
              </span>
              {playing ? 'Pause video' : 'Watch the video'}
            </button>
          ) : playing ? (
            <Button variant="secondary" onDark={fill} onClick={pause}>
              Pause video
            </Button>
          ) : (
            <Button variant="secondary" onDark={fill} onClick={play}>
              Play video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
