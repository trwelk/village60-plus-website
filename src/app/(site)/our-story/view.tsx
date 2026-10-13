import type { PortableTextBlock } from '@portabletext/react';
import { PageHero } from '@/components/content/PageHero';
import { PortableText, safeHref } from '@/components/content/PortableText';
import type { ContentSectionData } from '@/components/content/SectionList';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';
import { cn } from '@/lib/cn';

export type StoryPerson = {
  _id: string;
  name?: string | null;
  role?: string | null;
  credentials?: Array<string | null> | null;
  bio?: PortableTextBlock[] | null;
  image?: CmsImage | null;
};

type StorySection = ContentSectionData & { heading: string };

function hasPhoto(image?: CmsImage | null) {
  return Boolean(image?.asset?.url && image.alt?.trim());
}

/** Night is not used on this page. Only the first green section stays green. */
function storySections(sections: Array<ContentSectionData | null> | null | undefined): StorySection[] {
  let greenUsed = false;
  const rows: StorySection[] = [];
  for (const section of sections ?? []) {
    if (!section?.heading) continue;
    let tone = section.tone;
    if (tone === 'night') tone = 'ivory';
    else if (tone === 'green') {
      if (greenUsed) tone = 'ivory';
      else greenUsed = true;
    }
    rows.push({ ...section, heading: section.heading, tone });
  }
  return rows;
}

function storyId(section: StorySection) {
  return `story-${section._key}`;
}

function FramedImage({ image }: { image: CmsImage | null | undefined }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand">
      <SanityImage image={image} width={960} height={720} sizes="(min-width: 1200px) 640px, 100vw" cover className="absolute inset-0" />
    </div>
  );
}

function ChapterMark({ index }: { index: number }) {
  return (
    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full border border-gold bg-ivory font-display text-[15px] leading-none text-green">
      {String(index + 1).padStart(2, '0')}
    </span>
  );
}

function StoryChapter({ section, index }: { section: StorySection; index: number }) {
  const onDark = section.tone === 'green';
  const href = safeHref(section.cta?.href);
  const showImage = hasPhoto(section.image);
  const hasCopy = Boolean(section.body?.length || showImage || (section.cta?.label && href));
  return (
    <article
      aria-labelledby={storyId(section)}
      className={cn('rounded-panel px-6 py-8 sm:px-8 md:px-10 md:py-10', onDark ? 'bg-green text-ivory on-dark' : 'border border-stone bg-paper')}
    >
      <div className={cn('grid gap-6', hasCopy && 'lg:grid-cols-[minmax(16rem,24rem)_1px_minmax(0,1fr)] lg:items-stretch lg:gap-x-10')}>
        <div className="flex flex-col justify-center gap-3">
          {isContentStatus(section.status) ? <StatusBadge status={section.status} tone={onDark ? 'dark' : 'light'} /> : null}
          {section.eyebrow ? (
            <p className={cn('text-[14px] font-semibold tracking-[0.08em] uppercase', onDark ? 'text-pale-gold' : 'text-bronze')}>{section.eyebrow}</p>
          ) : null}
          <div className="flex items-center gap-4">
            <ChapterMark index={index} />
            <h2 id={storyId(section)} className="min-w-0 scroll-mt-28">
              {section.heading}
            </h2>
          </div>
        </div>
        {hasCopy ? (
          <>
            <div aria-hidden="true" className={cn('hidden lg:block', onDark ? 'bg-pale-gold/70' : 'bg-gold')} />
            <div className={cn('flex flex-col justify-center gap-6 border-t pt-6 lg:border-0 lg:pt-0', onDark ? 'border-pale-gold/45' : 'border-gold')}>
              <PortableText value={section.body} onDark={onDark} />
              {showImage ? <FramedImage image={section.image} /> : null}
              {section.cta?.label && href ? (
                <div>
                  <Button href={href} onDark={onDark}>
                    {section.cta.label}
                  </Button>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}

function PersonCard({ person }: { person: StoryPerson & { name: string } }) {
  const credentials = (person.credentials ?? []).filter((item): item is string => Boolean(item));
  const bio = person.bio && person.bio.length > 0 ? person.bio : null;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
      {hasPhoto(person.image) ? (
        <div className="relative aspect-[4/5] bg-sand">
          <SanityImage image={person.image} width={640} height={800} sizes="(min-width: 1200px) 380px, (min-width: 600px) 50vw, 100vw" cover className="absolute inset-0" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[24px] leading-snug">{person.name}</h3>
        {person.role ? <p className="mt-1.5 text-[16px] text-bronze">{person.role}</p> : null}
        {bio ? (
          <div className="mt-4 text-[16px] leading-relaxed [&_p]:max-w-none">
            <PortableText value={bio} />
          </div>
        ) : null}
        {credentials.length > 0 ? (
          <ul className="mt-4 flex list-none flex-col gap-1.5 border-t border-stone pt-4 text-[15px] leading-snug">
            {credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function OurStoryView({
  title,
  intro,
  body,
  sections,
  foundedYear,
  team,
  heroImage,
}: {
  title: string;
  intro?: string | null;
  body?: PortableTextBlock[] | null;
  sections?: Array<ContentSectionData | null> | null;
  foundedYear?: number | null;
  team: StoryPerson[];
  heroImage?: CmsImage | null;
}) {
  const hasBody = Boolean(body && body.length > 0);
  const chapters = storySections(sections);
  const people = team.filter((person): person is StoryPerson & { name: string } => Boolean(person.name));
  const hasStory = chapters.length > 0 || people.length > 0;

  return (
    <main id="main">
      <PageHero
        layout="overlay"
        title={title}
        eyebrow={foundedYear != null ? `Established ${foundedYear}` : null}
        intro={intro}
        image={heroImage}
        tone="night"
      />
      {hasBody ? (
        <Section tone="ivory">
          <div className="max-w-prose-site">
            <PortableText value={body} />
          </div>
        </Section>
      ) : null}
      {hasStory ? (
        <Section tone="sand" labelledBy={chapters.length === 0 ? 'leadership' : undefined}>
          <div className="flex flex-col gap-10 lg:gap-14">
            {chapters.length > 0 ? (
              <ol className="m-0 flex list-none flex-col gap-5 p-0 lg:gap-6">
                {chapters.map((section, index) => (
                  <li key={section._key}>
                    <StoryChapter section={section} index={index} />
                  </li>
                ))}
              </ol>
            ) : null}
            {people.length > 0 ? (
              <div className={cn(chapters.length > 0 && 'border-t border-stone pt-10 lg:pt-14')}>
                <Heading as="h2" id="leadership" titleClassName="scroll-mt-28">
                  Leadership
                </Heading>
                <ul
                  className={cn(
                    'm-0 mt-8 grid list-none gap-6 p-0',
                    people.length === 1 && 'max-w-sm',
                    people.length === 2 && 'sm:grid-cols-2',
                    people.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3',
                  )}
                >
                  {people.map((person) => (
                    <li key={person._id}>
                      <PersonCard person={person} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}
    </main>
  );
}
