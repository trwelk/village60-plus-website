'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics, sendGAEvent } from '@next/third-parties/google';
import { consentCookie, parseConsent, TRACK_EVENT_NAME, trackName } from '@/lib/analytics';

function remember(choice: 'accepted' | 'rejected') {
  const secure = window.location.protocol === 'https:';
  document.cookie = consentCookie(choice, secure);
}

export function Analytics({ gaId }: { gaId: string | null }) {
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(parseConsent(document.cookie));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!gaId || consent !== 'accepted') return;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const name = trackName(target.closest('[data-track]')?.getAttribute('data-track'));
      if (name) sendGAEvent('event', name);
    }

    function onTrack(event: Event) {
      const name = trackName((event as CustomEvent<unknown>).detail);
      if (name) sendGAEvent('event', name);
    }

    document.addEventListener('click', onClick);
    document.addEventListener(TRACK_EVENT_NAME, onTrack);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener(TRACK_EVENT_NAME, onTrack);
    };
  }, [gaId, consent]);

  const loadGa = Boolean(gaId) && consent === 'accepted';

  return (
    <>
      {loadGa && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      {ready && consent === null ? (
        <div
          role="region"
          aria-label="Analytics cookies"
          className="fixed inset-x-0 bottom-16 z-40 border-t border-stone bg-paper px-4 py-3 text-charcoal md:bottom-0"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <p className="max-w-prose-site text-[16px]">Analytics cookies stay off until you accept. We do not send your name, phone, email or message.</p>
            <div className="flex gap-3">
              <button type="button" className="inline-flex min-h-11 items-center rounded-full bg-green px-5 font-semibold text-ivory" onClick={() => { remember('accepted'); setConsent('accepted'); }}>
                Accept
              </button>
              <button type="button" className="inline-flex min-h-11 items-center rounded-full border border-green px-5 font-semibold text-green" onClick={() => { remember('rejected'); setConsent('rejected'); }}>
                Reject
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
