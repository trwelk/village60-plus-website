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

function chapterGroups(sections: Array<ContentSectionData | null> | null | undefined) {
  const groups: Array<{ tone: 'light' | 'green'; items: StorySection[] }> = [];
  for (const section of storySections(sections)) {
    const tone = section.tone === 'green' ? 'green' : 'light';
    const last = groups.at(-1);
    if (last?.tone === tone) last.items.push(section);
    else groups.push({ tone, items: [section] });
  }
  return groups;
}

function storyId(section: StorySection) {
  return `story-${section._key}`;
}

function FramedImage({ image }: { image: CmsImage | null | undefined }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-sand">
      <SanityImage image={image} width={960} height={720} sizes="(min-width: 1200px) 560px, 100vw" cover className="absolute inset-0" />
    </div>
  );
}

function ChapterSupport({ section, onDark = false }: { section: StorySection; onDark?: boolean }) {
  const href = safeHref(section.cta?.href);
  const showImage = hasPhoto(section.image);
  return (
    <>
      <div className={cn('grid items-start gap-8', showImage && 'lg:grid-cols-2')}>
        <PortableText value={section.body} onDark={onDark} />
        {showImage ? <FramedImage image={section.image} /> : null}
      </div>
      {section.cta?.label && href ? (
        <div>
          <Button href={href} onDark={onDark}>
            {section.cta.label}
          </Button>
        </div>
      ) : null}
    </>
  );
}

function LightChapters({ items }: { items: StorySection[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {items.map((section, index) => {
        const showImage = hasPhoto(section.image);
        return (
          <li
            key={section._key}
            className={cn(
              'flex flex-col gap-4',
              !showImage && 'max-w-prose-site',
              index > 0 && 'mt-12 border-t border-stone pt-12 lg:mt-14 lg:pt-14',
            )}
          >
            {section.eyebrow ? <p className="text-[14px] font-semibold tracking-[0.08em] text-bronze uppercase">{section.eyebrow}</p> : null}
            {isContentStatus(section.status) ? <StatusBadge status={section.status} /> : null}
            <h2 id={storyId(section)}>{section.heading}</h2>
            <ChapterSupport section={section} />
          </li>
        );
      })}
    </ol>
  );
}

function GreenQuote({ section }: { section: StorySection }) {
  const href = safeHref(section.cta?.href);
  const hasAside = Boolean(section.body?.length || hasPhoto(section.image) || (section.cta?.label && href));
  return (
    <div className="rounded-panel bg-green -mx-5 px-5 py-10 text-ivory on-dark sm:-mx-6 sm:px-6 sm:py-12 lg:-mx-8 lg:px-8 lg:py-16">
      <div className={cn('grid items-start gap-8', hasAside && 'lg:grid-cols-2 lg:gap-16')}>
        <div className="flex flex-col gap-4">
          {isContentStatus(section.status) ? <StatusBadge status={section.status} tone="dark" /> : null}
          <Heading as="h2" id={storyId(section)} eyebrow={section.eyebrow ?? undefined} onDark>
            {section.heading}
          </Heading>
        </div>
        {hasAside ? (
          <div className="flex min-w-0 flex-col gap-6">
            <ChapterSupport section={section} onDark />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: StoryPerson & { name: string } }) {
  const credentials = (person.credentials ?? []).filter((item): item is string => Boolean(item));
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
      {hasPhoto(person.image) ? (
        <div className="relative aspect-square bg-sand">
          <SanityImage image={person.image} width={640} height={640} sizes="(min-width: 1200px) 380px, 100vw" cover className="absolute inset-0" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[24px] leading-snug">{person.name}</h3>
        {person.role ? <p className="mt-1 text-[15px] text-bronze">{person.role}</p> : null}
        {credentials.length > 0 ? (
          <ul className="mt-4 flex list-none flex-col gap-1 border-t border-stone pt-4 text-[15px] leading-snug">
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
  const groups = chapterGroups(sections);
  const people = team.filter((person): person is StoryPerson & { name: string } => Boolean(person.name));
  const hasStory = groups.length > 0 || people.length > 0;

  return (
    <main id="main">
      <PageHero
        title={title}
        intro={intro}
        image={heroImage}
        framed
        align="center"
        tone="ivory"
        eyebrow={foundedYear != null ? `Established ${foundedYear}` : undefined}
        className={hasStory || hasBody ? 'hero-to-band' : undefined}
      />
      {hasBody ? (
        <Section tone="ivory" className="band-from-hero">
          <PortableText value={body} />
        </Section>
      ) : null}
      {hasStory ? (
        <Section tone="sand" className={hasBody ? undefined : 'band-from-hero'} labelledBy={groups.length === 0 ? 'leadership' : undefined}>
          <div className="flex flex-col gap-12 lg:gap-16">
            {groups.map((group) =>
              group.tone === 'green' ? (
                group.items.map((section) => <GreenQuote key={section._key} section={section} />)
              ) : (
                <LightChapters key={group.items[0]._key} items={group.items} />
              ),
            )}
            {people.length > 0 ? (
              <div>
                <Heading as="h2" id="leadership">
                  Leadership
                </Heading>
                <ul className="m-0 mt-8 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
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
