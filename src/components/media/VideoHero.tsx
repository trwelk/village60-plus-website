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

export function VideoHero({ video, width = 1280 }: { video: HeroVideo | null | undefined; width?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!video?.videoUrl) return;
    if (!shouldAutoplayVideo(readPrefs())) return;
    queueMicrotask(() => {
      setShowVideo(true);
      setPlaying(true);
    });
  }, [video?.videoUrl]);

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
    <div className="relative">
      {showVideo && video.videoUrl ? (
        <video
          ref={ref}
          className="h-auto w-full rounded-card"
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
      ) : (
        video.poster && <SanityImage image={video.poster} width={width} priority />
      )}
      {video.videoUrl && (
        <div className="mt-3">
          {playing ? (
            <Button variant="secondary" onClick={pause}>
              Pause video
            </Button>
          ) : (
            <Button variant="secondary" onClick={play}>
              Play video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
