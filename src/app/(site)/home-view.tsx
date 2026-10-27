import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { CardCarousel } from '@/components/content/CardCarousel';
import { CareServiceCard, type CareServiceCardData } from '@/components/content/CareServiceCard';
import { PreviewCard } from '@/components/content/PreviewCard';
import { ResidenceCard, type ResidenceCardData } from '@/components/content/ResidenceCard';
import type { HeroVideo } from '@/components/media/VideoHero';
import type { CmsImage } from '@/components/media/SanityImage';
import { AwardRecognition } from '@/components/content/AwardRecognition';
import { HomeHero } from '@/components/content/HomeHero';
import { HomeStory } from '@/components/content/HomeStory';
import { OracleSpotlight } from '@/components/content/OracleSpotlight';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture, isOperating } from '@/lib/content-status';
import { offeringPath } from '@/lib/routes';

export type HomePageFields = {
  title?: string | null;
  intro?: string | null;
  heroImage?: CmsImage | null;
  heroVideo?: HeroVideo | null;
};

export type HomeOffering = {
  slug: string;
  name: string;
  summary?: string | null;
  status?: string | null;
  heroImage?: CmsImage | null;
};

export type HomeViewProps = {
  home: HomePageFields | null;
  residences: ResidenceCardData[];
  careServices: CareServiceCardData[];
  offerings: HomeOffering[];
  contact: SiteContact;
  /** Gallery and hero frames for the Oracle portraits. Falls back to the residence card image. */
  oracleImages?: Array<CmsImage | null> | null;
};

export function toResidenceCards(rows: Array<ResidenceCardData | null> | null | undefined): ResidenceCardData[] {
  return (rows ?? []).filter((row): row is ResidenceCardData => Boolean(row?._id));
}

export function toCareCards(rows: Array<CareServiceCardData | null> | null | undefined): CareServiceCardData[] {
  return (rows ?? []).filter((row): row is CareServiceCardData => Boolean(row?._id));
}

export function toHomeOfferings(
  rows: Array<{ slug?: string | null; name?: string | null; summary?: string | null; status?: string | null; heroImage?: CmsImage | null } | null> | null | undefined,
): HomeOffering[] {
  return (rows ?? []).flatMap((row) =>
    row?.slug && row.name
      ? [{ slug: row.slug, name: row.name, summary: row.summary ?? null, status: row.status ?? null, heroImage: row.heroImage ?? null }]
      : [],
  );
}

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-home-section={name}>{children}</div>;
}

export function HomeView({ home, residences, careServices, offerings, contact, oracleImages }: HomeViewProps) {
  const video = home?.heroVideo?.videoUrl || home?.heroVideo?.poster?.asset?.url ? home.heroVideo : null;
  const oracle = residences.find((item) => item.slug === 'oracle');
  const silver = offerings.find((item) => item.slug === 'silver-roots');
  const secondary = offerings.filter((item) => item.slug === 'destination-retirement' || item.slug === 'sage');

  return (
    <main id="main">
      <Region name="hero">
        <HomeHero video={video} />
      </Region>

      <Region name="story">
        <HomeStory />
      </Region>

      <Region name="recognition">
        <AwardRecognition />
      </Region>

      <Region name="oracle">
        <OracleSpotlight
          name={oracle?.name}
          summary={oracle?.summary || 'Oracle is the flagship residence. The team confirms what is available today.'}
          images={oracleImages?.length ? oracleImages : oracle?.heroImage ? [oracle.heroImage] : []}
        />
      </Region>

      <Region name="homes">
        <Section tone="ivory" labelledBy="home-homes">
          <CardCarousel
            label="home"
            heading={<Heading as="h2" id="home-homes">Our homes</Heading>}
            empty={<p>Residence details will appear here once they are published.</p>}
          >
            {residences.map((residence) => (
              <ResidenceCard key={residence._id} residence={residence} />
            ))}
          </CardCarousel>
        </Section>
      </Region>

      <Region name="care">
        <Section tone="green" labelledBy="home-care">
          <CardCarousel
            label="care option"
            reverse
            onDark
            heading={<Heading as="h2" id="home-care" onDark>Living and care</Heading>}
            empty={<p>Care descriptions will appear here once they are published.</p>}
          >
            {careServices.map((service) => (
              <CareServiceCard key={service._id} service={service} />
            ))}
          </CardCarousel>
        </Section>
      </Region>

      <Region name="silver-roots">
        <Section tone="mist" labelledBy="home-silver">
          <Heading as="h2" id="home-silver">Silver Roots</Heading>
          {silver && isContentStatus(silver.status) && isFuture(silver.status) ? <StatusBadge status={silver.status} /> : null}
          <p className="mt-4 max-w-prose-site">{silver?.summary || 'Silver Roots extends support beyond the residences. What exists today is labelled on its page.'}</p>
          <div className="mt-6">
            <Button href="/silver-roots" variant="secondary">Read about Silver Roots</Button>
          </div>
        </Section>
      </Region>

      <Region name="ecosystem">
        <Section tone="sand" labelledBy="home-ecosystem">
          <Heading as="h2" id="home-ecosystem">
            Destination Retirement<span className="hidden md:inline"> and SAGE</span>
          </Heading>
          <ul className="mt-8 grid gap-8 md:grid-cols-2">
            {secondary.map((item) => (
              <li key={item.slug} className={item.slug === 'sage' ? 'hidden md:block' : undefined}>
                <PreviewCard
                  href={offeringPath(item.slug)}
                  title={item.name}
                  eyebrow="Beyond the homes"
                  description={item.summary}
                  overlay={item.summary}
                  image={item.heroImage}
                  fill={item.slug === 'sage' ? 'bg-night' : 'bg-leaf'}
                >
                  {isContentStatus(item.status) && !isOperating(item.status) ? <StatusBadge status={item.status} /> : null}
                </PreviewCard>
              </li>
            ))}
          </ul>
        </Section>
      </Region>

      <Region name="trust">
        <Section tone="ivory" labelledBy="home-trust">
          <Heading as="h2" id="home-trust">Talk with us</Heading>
          {home?.intro ? <p className="mt-4 max-w-prose-site">{home.intro}</p> : null}
          <div className="mt-6">
            <EnquiryButton kind="general" context="Home">Send an enquiry</EnquiryButton>
          </div>
        </Section>
      </Region>
    </main>
  );
}
