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

const MISSION =
  'V60+\u2019s Mission is to be the premier Home and Residential Elder care solution provider for you or your loved ones in the South Asian Region. With a decade and plus years of successive experience in caring for the wellbeing of loved ones, we are culminating Home and Residential Elder Care into the 21st Century / Twenty-Twenties, digitizing our amenities and services so that families may bond and be closer with loved ones, while providing family and or guardians ultimate access and control over the care of their loved ones.';

const VISION = [
  'Our goal is to provide State-of-the-art care and amenities to our residents and home care clients while investing heavily on training and development to maintain well trained and skilled nursing guilds.',
  'Our vision is to be the front runner for Geriatric care in the South Asian region and to be recognized globally for our quality service towards our stakeholders.',
] as const;

const CORE_VALUES = [
  {
    name: 'Empathy',
    body: 'We believe that acknowledging each one of our residents and clients is key to their wellbeing securing a sense of comfort and peace of mind in knowing that behind the empathy is integrity and care.',
  },
  {
    name: 'Knowledge and expertise',
    body: 'surrounding the caregiving of each of our Residents, clients and other stakeholders.',
  },
  {
    name: 'Integrity',
    body: 'We hold ourselves accountable to our residents, clients and employees. We endeavor to demonstrate honesty, professionalism, and sincerity. We will stay true to our promise to always act in the best interest of our stakeholders.',
  },
  {
    name: 'Service',
    body: 'Service is the cornerstone of our organization.',
  },
] as const;

function CharterRule({ onDark = false }: { onDark?: boolean }) {
  return (
    <div aria-hidden="true" className="mt-4 flex w-14 flex-col gap-1">
      <span className={cn('h-0.5', onDark ? 'bg-pale-gold' : 'bg-gold')} />
      <span className={cn('h-px', onDark ? 'bg-pale-gold/45' : 'bg-stone')} />
    </div>
  );
}

function PurposeCharter() {
  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <div className="grid overflow-hidden rounded-panel shadow-panel md:grid-cols-[minmax(0,1.4fr)_minmax(17.5rem,0.92fr)]">
        <article aria-labelledby="mission" className="bg-paper px-6 py-8 sm:px-10 sm:py-12">
          <h2 id="mission" className="scroll-mt-28">
            Mission
          </h2>
          <CharterRule />
          <p className="mt-6 text-[17px] leading-relaxed md:text-[18px]">{MISSION}</p>
        </article>
        <article aria-labelledby="vision" className="on-dark border-t-2 border-pale-gold bg-green px-6 py-8 text-ivory sm:px-10 sm:py-12 md:border-t-0 md:border-l-2">
          <h2 id="vision" className="scroll-mt-28">
            Vision
          </h2>
          <CharterRule onDark />
          <div className="mt-6 flex flex-col gap-5 text-[17px] leading-relaxed md:text-[18px]">
            {VISION.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>

      <div className="rounded-panel border border-stone bg-paper px-6 py-8 shadow-panel sm:px-10 sm:py-12">
        <h2 id="core-values" className="scroll-mt-28">
          Our Core Values
        </h2>
        <CharterRule />
        <ul className="m-0 mt-8 list-none border-b border-stone p-0">
          {CORE_VALUES.map((value) => (
            <li key={value.name} className="border-t border-stone">
              <div className="grid gap-3 py-7 md:grid-cols-[minmax(13.5rem,18rem)_minmax(0,68ch)] md:items-baseline md:gap-x-12 md:py-8">
                <h3 className="border-l-2 border-gold pl-4">{value.name}</h3>
                <p className="text-[17px] leading-relaxed md:text-[18px]">{value.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
      <Section tone="ivory" className={hasBody ? 'border-t border-stone' : undefined}>
        <PurposeCharter />
      </Section>
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
