import type { PortableTextBlock } from '@portabletext/react';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { Section } from '@/components/ui/Section';

export function LegalView({
  title,
  body,
  lastReviewed,
}: {
  title: string;
  body?: PortableTextBlock[] | null;
  lastReviewed?: string | null;
}) {
  return (
    <main id="main">
      <PageHero title={title} tone="ivory" />
      <Section tone="paper">
        <PortableText value={body} />
        {lastReviewed ? <p className="mt-8">Last reviewed {lastReviewed}</p> : null}
      </Section>
    </main>
  );
}
