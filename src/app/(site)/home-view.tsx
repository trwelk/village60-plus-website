import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { CardCarousel } from '@/components/content/CardCarousel';
import { CareServiceCard, type CareServiceCardData } from '@/components/content/CareServiceCard';
import { PreviewCard } from '@/components/content/PreviewCard';
import { ResidenceCard, type ResidenceCardData } from '@/components/content/ResidenceCard';
import { RevealStagger } from '@/components/content/RevealStagger';
import type { HeroVideo } from '@/components/media/VideoHero';
import type { CmsImage } from '@/components/media/SanityImage';
import { HomeHero } from '@/components/content/HomeHero';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture, isOperating } from '@/lib/content-status';
import { offeringPath } from '@/lib/routes';

const PATHWAYS = [
  { title: 'For a parent or relative', body: 'You do not need to know the care category. Tell us who you are asking about.', href: '/find-the-right-care?for=parent' },
  { title: 'For myself', body: 'Start with the kind of day you want, and a person will talk it through with you.', href: '/find-the-right-care?for=myself' },
  { title: 'After hospital or surgery', body: 'If someone is leaving hospital, we can explain respite, recovery and rehabilitation in plain language.', href: '/find-the-right-care?for=after-hospital' },
] as const;

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
};

export type HomeViewProps = {
  home: HomePageFields | null;
  residences: ResidenceCardData[];
  careServices: CareServiceCardData[];
  offerings: HomeOffering[];
  contact: SiteContact;
};

export function toResidenceCards(rows: Array<ResidenceCardData | null> | null | undefined): ResidenceCardData[] {
  return (rows ?? []).filter((row): row is ResidenceCardData => Boolean(row?._id));
}

export function toCareCards(rows: Array<CareServiceCardData | null> | null | undefined): CareServiceCardData[] {
  return (rows ?? []).filter((row): row is CareServiceCardData => Boolean(row?._id));
}

export function toHomeOfferings(rows: Array<{ slug?: string | null; name?: string | null; summary?: string | null; status?: string | null } | null> | null | undefined): HomeOffering[] {
  return (rows ?? []).flatMap((row) => (row?.slug && row.name ? [{ slug: row.slug, name: row.name, summary: row.summary ?? null, status: row.status ?? null }] : []));
}

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-home-section={name}>{children}</div>;
}

export function HomeView({ home, residences, careServices, offerings, contact }: HomeViewProps) {
  const video = home?.heroVideo?.videoUrl || home?.heroVideo?.poster?.asset?.url ? home.heroVideo : null;
  const oracle = residences.find((item) => item.slug === 'oracle');
  const silver = offerings.find((item) => item.slug === 'silver-roots');
  const secondary = offerings.filter((item) => item.slug === 'destination-retirement' || item.slug === 'sage');

  return (
    <main id="main">
      <Region name="hero">
        <HomeHero title="Live well. Age exceptionally." intro={home?.intro} image={video ? null : home?.heroImage} video={video} contact={contact} />
      </Region>

      <Region name="pathways">
        <Section tone="sand" labelledBy="home-pathways">
          <Heading as="h2" id="home-pathways">Find the Right Care</Heading>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {PATHWAYS.map((path, index) => (
              <li key={path.href}>
                <PreviewCard
                  href={path.href}
                  title={path.title}
                  eyebrow="Find the right care"
                  description={path.body}
                  overlay={path.body}
                  fill={['bg-green', 'bg-leaf', 'bg-night'][index]}
                />
              </li>
            ))}
          </ul>
        </Section>
      </Region>

      <Region name="oracle">
        <Section tone="night" labelledBy="home-oracle">
          {isContentStatus(oracle?.status) ? <StatusBadge status={oracle.status} tone="dark" /> : null}
          <Heading as="h2" id="home-oracle" onDark>Oracle</Heading>
          <p className="mt-4 max-w-prose-site">{oracle?.summary || 'Oracle is the flagship residence. The team confirms what is available today.'}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/oracle" onDark>Explore Oracle</Button>
            <EnquiryButton kind="oracle-visit" context="Oracle">Arrange a private visit</EnquiryButton>
          </div>
        </Section>
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
          <Heading as="h2" id="home-care" onDark>Living and care</Heading>
          {careServices.length === 0 ? (
            <p className="mt-4">Care descriptions will appear here once they are published.</p>
          ) : (
            <RevealStagger className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {careServices.map((service) => (
                <CareServiceCard key={service._id} service={service} />
              ))}
            </RevealStagger>
          )}
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
          <Heading as="h2" id="home-ecosystem">Destination Retirement and SAGE</Heading>
          <ul className="mt-8 grid gap-8 md:grid-cols-2">
            {secondary.map((item) => (
              <li key={item.slug}>
                <PreviewCard
                  href={offeringPath(item.slug)}
                  title={item.name}
                  eyebrow="Beyond the homes"
                  description={item.summary}
                  overlay={item.summary}
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
