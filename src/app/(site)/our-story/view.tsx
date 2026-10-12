import type { PortableTextBlock } from '@portabletext/react';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';

export type StoryPerson = {
  _id: string;
  name?: string | null;
  role?: string | null;
  credentials?: Array<string | null> | null;
  image?: CmsImage | null;
};

function storySections(sections: Array<ContentSectionData | null> | null | undefined) {
  let greenUsed = false;
  return (sections ?? []).map((section) => {
    if (!section) return section;
    if (section.tone === 'night') return { ...section, tone: 'ivory' };
    if (section.tone !== 'green') return section;
    if (greenUsed) return { ...section, tone: 'ivory' };
    greenUsed = true;
    return section;
  });
}

export function OurStoryView({
  title,
  intro,
  body,
  sections,
  foundedYear,
  team,
}: {
  title: string;
  intro?: string | null;
  body?: PortableTextBlock[] | null;
  sections?: Array<ContentSectionData | null> | null;
  foundedYear?: number | null;
  team: StoryPerson[];
}) {
  const people = team.filter((person): person is StoryPerson & { name: string } => Boolean(person.name));
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory" />
      {foundedYear != null ? (
        <Section tone="paper">
          <p>Established {foundedYear}</p>
        </Section>
      ) : null}
      <Section tone="ivory">
        <PortableText value={body} />
      </Section>
      <SectionList sections={storySections(sections)} />
      {people.length > 0 ? (
        <Section tone="sand" labelledBy="leadership">
          <Heading as="h2" id="leadership">Leadership</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <li key={person._id}>
                <SanityImage image={person.image} width={480} height={480} sizes="240px" />
                <h3 className="mt-3">{person.name}</h3>
                {person.role ? <p>{person.role}</p> : null}
                <ul>
                  {(person.credentials ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </main>
  );
}
