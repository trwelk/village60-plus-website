'use client';

import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main">
      <Section tone="ivory">
        <h1 id="page-title">Something went wrong</h1>
        <p className="mt-4">Please call or WhatsApp us.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/contact">Contact</Button>
          <button type="button" className="inline-flex min-h-11 items-center font-semibold text-green underline" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </Section>
    </main>
  );
}
