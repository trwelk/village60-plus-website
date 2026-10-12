import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { CareServiceCard, type CareServiceCardData } from '@/components/content/CareServiceCard';
import { ResidenceCard, type ResidenceCardData } from '@/components/content/ResidenceCard';
import { VideoHero, type HeroVideo } from '@/components/media/VideoHero';
import type { CmsImage } from '@/components/media/SanityImage';
import { ContactActions } from '@/components/site/ContactActions';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHero } from '@/components/content/PageHero';
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
        {video ? <VideoHero video={video} /> : null}
        <PageHero title="Live well. Age exceptionally." intro={home?.intro} image={video ? null : home?.heroImage} tone="ivory">
          <Button href="/find-the-right-care">Find the Right Care</Button>
          <ContactActions contact={contact} context="Village 60 Plus" showNumber={false} includeWhatsApp={false} />
        </PageHero>
      </Region>

      <Region name="pathways">
        <Section tone="sand" labelledBy="home-pathways">
          <Heading as="h2" id="home-pathways">Find the Right Care</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {PATHWAYS.map((path) => (
              <li key={path.href} className="rounded-panel border border-stone bg-paper p-6">
                <h3>{path.title}</h3>
                <p className="mt-2 max-w-prose-site">{path.body}</p>
                <div className="mt-4">
                  <Button href={path.href} variant="text">{path.title}</Button>
                </div>
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
          <Heading as="h2" id="home-homes">Our homes</Heading>
          {residences.length === 0 ? <p className="mt-4">Residence details will appear here once they are published.</p> : null}
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {residences.map((residence) => (
              <li key={residence._id}><ResidenceCard residence={residence} /></li>
            ))}
          </ul>
        </Section>
      </Region>

      <Region name="care">
        <Section tone="paper" labelledBy="home-care">
          <Heading as="h2" id="home-care">Living and care</Heading>
          {careServices.length === 0 ? <p className="mt-4">Care descriptions will appear here once they are published.</p> : null}
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {careServices.map((service) => (
              <li key={service._id}><CareServiceCard service={service} /></li>
            ))}
          </ul>
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
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {secondary.map((item) => (
              <li key={item.slug} className="rounded-panel border border-stone bg-paper p-6">
                {isContentStatus(item.status) && !isOperating(item.status) ? <StatusBadge status={item.status} /> : null}
                <h3 className="mt-2">{item.name}</h3>
                {item.summary ? <p className="mt-2 max-w-prose-site">{item.summary}</p> : null}
                <div className="mt-4">
                  <Button href={offeringPath(item.slug)} variant="text">{item.name}</Button>
                </div>
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
