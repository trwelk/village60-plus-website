import type { ReactNode } from 'react';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Heading } from '@/components/ui/Heading';
import { Section, isDarkTone, type SectionTone } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  status,
  tone = 'ivory',
  children,
}: {
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  image?: CmsImage | null;
  status?: string | null;
  tone?: SectionTone;
  children?: ReactNode;
}) {
  const onDark = isDarkTone(tone);
  const showImage = Boolean(image?.asset?.url && image?.alt?.trim());
  return (
    <Section tone={tone} labelledBy="page-title">
      <div className={showImage ? 'grid items-center gap-8 lg:grid-cols-2' : 'max-w-prose-site'}>
        <div className="flex flex-col gap-4">
          {isContentStatus(status) && <StatusBadge status={status} tone={onDark ? 'dark' : 'light'} />}
          <Heading as="h1" id="page-title" eyebrow={eyebrow ?? undefined} onDark={onDark}>
            {title}
          </Heading>
          {intro && <p className="max-w-prose-site">{intro}</p>}
          {children && <div className="flex flex-wrap gap-3">{children}</div>}
        </div>
        {showImage && <SanityImage image={image} width={800} height={500} priority sizes="(min-width: 1200px) 600px, 100vw" />}
      </div>
    </Section>
  );
}
