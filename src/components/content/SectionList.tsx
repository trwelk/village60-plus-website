import type { PortableTextBlock } from '@portabletext/react';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section, isDarkTone, type SectionTone } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/cn';
import { isContentStatus } from '@/lib/content-status';
import { PortableText, safeHref } from './PortableText';

const TONES: SectionTone[] = ['ivory', 'sand', 'paper', 'mist', 'green', 'night'];

function asTone(value: string | null | undefined): SectionTone {
  return TONES.includes(value as SectionTone) ? (value as SectionTone) : 'ivory';
}

export type ContentSectionData = {
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
  tone?: string | null;
  status?: string | null;
  image?: CmsImage | null;
  cta?: { label?: string | null; href?: string | null } | null;
};

export function SectionList({
  sections,
  layout = 'stack',
}: {
  sections: Array<ContentSectionData | null> | null | undefined;
  /** `split` places a text-only heading beside the copy so a short paragraph does not sit under a full-width title. */
  layout?: 'stack' | 'split';
}) {
  const rows = (sections ?? []).filter((section): section is ContentSectionData & { heading: string } => Boolean(section?.heading));
  return (
    <>
      {rows.map((section) => {
        const tone = asTone(section.tone);
        const onDark = isDarkTone(tone);
        const href = safeHref(section.cta?.href);
        const showImage = Boolean(section.image?.asset?.url && section.image?.alt?.trim());
        const split = layout === 'split' && !showImage;
        const hasCopy = Boolean(section.body?.length) || Boolean(section.cta?.label && href);
        const copy = (
          <>
            <PortableText value={section.body} onDark={onDark} />
            {section.cta?.label && href ? (
              <div className={split ? 'mt-6' : undefined}>
                <Button href={href} onDark={onDark}>
                  {section.cta.label}
                </Button>
              </div>
            ) : null}
          </>
        );
        return (
          <Section key={section._key} tone={tone}>
            {split ? (
              <div className={cn(!onDark && 'rounded-panel border border-stone bg-paper px-6 py-8 md:px-10 md:py-12')}>
                <div className="grid items-center gap-6 lg:grid-cols-[minmax(16rem,24rem)_minmax(0,1fr)] lg:gap-x-14">
                  <div className="flex flex-col gap-4">
                    {isContentStatus(section.status) && <StatusBadge status={section.status} tone={onDark ? 'dark' : 'light'} />}
                    <Heading as="h2" eyebrow={section.eyebrow ?? undefined} onDark={onDark}>
                      {section.heading}
                    </Heading>
                  </div>
                  {hasCopy ? (
                    <div
                      className={cn(
                        'min-w-0 border-l-2 pl-6 md:pl-8',
                        onDark ? 'border-pale-gold' : 'border-gold',
                        '[&_p]:max-w-none [&_p]:text-[19px] [&_p]:leading-relaxed md:[&_p]:text-[22px] md:[&_p]:leading-snug',
                      )}
                    >
                      {copy}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {isContentStatus(section.status) && <StatusBadge status={section.status} tone={onDark ? 'dark' : 'light'} />}
                  <Heading as="h2" eyebrow={section.eyebrow ?? undefined} onDark={onDark}>
                    {section.heading}
                  </Heading>
                </div>
                <div className={showImage ? 'mt-8 grid items-start gap-8 lg:grid-cols-2' : 'mt-8'}>
                  <PortableText value={section.body} onDark={onDark} />
                  {showImage && <SanityImage image={section.image} width={640} height={400} sizes="(min-width: 1200px) 560px, 100vw" />}
                </div>
                {section.cta?.label && href && (
                  <div className="mt-6">
                    <Button href={href} onDark={onDark}>
                      {section.cta.label}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Section>
        );
      })}
    </>
  );
}
