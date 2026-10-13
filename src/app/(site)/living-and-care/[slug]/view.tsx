import type { ReactNode } from 'react';
import Link from 'next/link';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { provisionLabel, type CapabilityItem } from '@/components/content/CapabilityList';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import type { StepItem } from '@/components/content/StepList';
import { type CmsImage } from '@/components/media/SanityImage';
import { ContactActions } from '@/components/site/ContactActions';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { SiteContact } from '@/lib/contact';
import { cn } from '@/lib/cn';
import { isContentStatus } from '@/lib/content-status';
import { asFormKind } from '@/lib/forms/kinds';
import { residencePath } from '@/lib/routes';

export type CareDetail = {
  name: string;
  slug: string;
  status?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  whoItSuits?: Array<string | null> | null;
  typicalDuration?: string | null;
  included?: Array<CapabilityItem | null> | null;
  process?: Array<StepItem | null> | null;
  notRightFit?: string | null;
  faqs?: Array<FaqItem | null> | null;
  formKind?: string | null;
  residences?: Array<{ _id: string; name?: string | null; slug?: string | null; status?: string | null; shortLocation?: string | null } | null> | null;
};

function Region({ name, className, children }: { name: string; className?: string; children?: ReactNode }) {
  return (
    <div data-care-section={name} className={className}>
      {children}
    </div>
  );
}

function markedStatus(status: string | null | undefined) {
  return isContentStatus(status) && status !== 'available' ? status : null;
}

export function CareDetailView({ service, contact }: { service: CareDetail | null; contact: SiteContact }) {
  if (!service) {
    return (
      <main id="main">
        <PageHero title="This service" intro="Details will appear here once they are published." tone="ivory" />
      </main>
    );
  }

  const suits = (service.whoItSuits ?? []).filter((item): item is string => Boolean(item));
  const duration = service.typicalDuration?.trim() || null;
  const included = (service.included ?? []).filter((item): item is CapabilityItem & { title: string } => Boolean(item?.title));
  const homes = (service.residences ?? []).filter((item): item is NonNullable<typeof item> & { name: string; slug: string } => Boolean(item?.name && item.slug));
  const steps = (service.process ?? []).filter((item): item is StepItem & { title: string } => Boolean(item?.title));
  const notRightFit = service.notRightFit?.trim() || null;
  const faqs = (service.faqs ?? []).filter((item) => Boolean(item?.question));
  const pairClose = Boolean(notRightFit) && faqs.length === 0;
  const factCount = suits.length + (duration ? 1 : 0);
  const factGrid =
    factCount >= 4 ? 'md:grid-cols-2 xl:grid-cols-4' : factCount === 3 ? 'md:grid-cols-3' : factCount === 2 ? 'md:grid-cols-2' : '';

  return (
    <main id="main">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Living & Care', href: '/living-and-care' }, { label: service.name }]} />
      <Region name="hero">
        <PageHero
          eyebrow="Living & Care"
          title={service.name}
          intro={service.summary}
          image={service.heroImage}
          status={service.status}
          tone="ivory"
          align="center"
          offset={false}
          className="hero-to-band"
        >
          <EnquiryButton kind={asFormKind(service.formKind)} context={service.name}>
            Enquire
          </EnquiryButton>
        </PageHero>
      </Region>

      {suits.length > 0 || duration ? (
        <Section tone="sand" labelledBy={suits.length > 0 ? 'who-it-suits' : undefined} className="band-from-hero">
          <div className={cn('grid gap-4', factGrid)}>
            <Region name="suits" className={suits.length > 0 ? 'contents' : 'hidden'}>
              {suits.length > 0 ? (
                <>
                  <Heading as="h2" id="who-it-suits" className="col-span-full mb-4">
                    Who it suits
                  </Heading>
                  <ul role="list" className="contents">
                    {suits.map((item, index) => (
                      <li key={item} className="flex h-full flex-col rounded-panel border border-stone bg-paper p-6">
                        <span
                          aria-hidden="true"
                          className="grid size-10 place-items-center rounded-full border border-gold bg-ivory font-display text-[15px] leading-none text-green"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="mt-4">{item}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </Region>
            <Region name="duration" className={duration ? 'contents' : 'hidden'}>
              {duration ? (
                <aside aria-labelledby="duration" className="flex h-full flex-col justify-center rounded-panel bg-green px-6 py-7 text-ivory on-dark">
                  <p id="duration" className="text-[14px] font-semibold uppercase tracking-[0.08em] text-pale-gold">
                    Typical duration
                  </p>
                  <p className="mt-3 font-display text-[clamp(26px,2.2vw,36px)] leading-[1.15] text-balance">{duration}</p>
                </aside>
              ) : null}
            </Region>
          </div>
        </Section>
      ) : (
        <>
          <Region name="suits" className="hidden" />
          <Region name="duration" className="hidden" />
        </>
      )}

      <Region name="included">
        {included.length > 0 ? (
          <Section tone="paper" labelledBy="included">
            <Heading as="h2" id="included">
              What is included
            </Heading>
            <ul className="m-0 mt-8 grid list-none gap-4 p-0 md:grid-cols-2">
              {included.map((item) => {
                const provision = provisionLabel(item.provision);
                const status = markedStatus(item.status);
                return (
                  <li key={item._key} className="flex h-full flex-col rounded-panel border border-stone bg-ivory p-6">
                    {provision || status ? (
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        {provision ? <Chip>{provision}</Chip> : null}
                        {status ? <StatusBadge status={status} /> : null}
                      </div>
                    ) : null}
                    <h3 className="text-[22px] leading-snug md:text-[24px]">{item.title}</h3>
                    {item.description ? <p className="mt-2">{item.description}</p> : null}
                  </li>
                );
              })}
            </ul>
          </Section>
        ) : null}
      </Region>

      <Region name="residences">
        {homes.length > 0 ? (
          <Section tone="mist" labelledBy="residences">
            <Heading as="h2" id="residences">
              Residences that offer this
            </Heading>
            <ul
              className={cn(
                'm-0 mt-8 grid list-none gap-4 p-0',
                homes.length === 3 ? 'md:grid-cols-3' : homes.length >= 2 ? 'md:grid-cols-2' : '',
              )}
            >
              {homes.map((home) => {
                const status = markedStatus(home.status);
                return (
                  <li key={home._id} className={cn('h-full', homes.length === 1 && 'md:max-w-md')}>
                    <Link
                      href={residencePath(home.slug)}
                      className="flex h-full flex-col rounded-panel border border-stone bg-paper p-6 no-underline transition-colors hover:border-green"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-[24px] leading-snug text-green md:text-[26px]">{home.name}</h3>
                        {status ? <StatusBadge status={status} /> : null}
                      </div>
                      {home.shortLocation ? <p className="mt-3">{home.shortLocation}</p> : null}
                      <span className="mt-auto pt-6 font-semibold text-green underline decoration-gold underline-offset-4">View home</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Section>
        ) : null}
      </Region>

      <Region name="process">
        {steps.length > 0 ? (
          <Section tone="sand" labelledBy="process">
            <Heading as="h2" id="process">
              Enquiry and assessment
            </Heading>
            <ol className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step._key} className="flex h-full flex-col rounded-panel border border-stone bg-paper p-6">
                  <span
                    aria-hidden="true"
                    className="grid size-12 place-items-center rounded-full border border-gold bg-ivory font-display text-[18px] leading-none text-green"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-[22px] leading-snug">{step.title}</h3>
                  {step.description ? <p className="mt-2">{step.description}</p> : null}
                </li>
              ))}
            </ol>
          </Section>
        ) : null}
      </Region>

      <Section tone="ivory">
        <div className={cn('grid gap-10 lg:gap-16', pairClose && 'lg:grid-cols-2 lg:items-center')}>
          <Region name="fit" className={notRightFit ? undefined : 'hidden'}>
            {notRightFit ? (
              <div className="border-l-2 border-gold pl-6 md:pl-8">
                <Heading as="h2" id="fit">
                  If this is not the right fit
                </Heading>
                <p className="mt-4">{notRightFit}</p>
              </div>
            ) : null}
          </Region>
          <Region name="faqs" className={faqs.length > 0 ? undefined : 'hidden'}>
            {faqs.length > 0 ? <FaqList items={service.faqs} /> : null}
          </Region>
          <Region name="enquiry" className={pairClose ? 'lg:col-start-2 lg:row-start-1' : undefined}>
            <div className="rounded-panel border border-stone bg-paper p-6 shadow-panel md:p-8">
              <Heading as="h2" id="speak-with-the-team">
                Speak with the team
              </Heading>
              <p className="mt-4">Ask about {service.name} by phone, WhatsApp, or a short note.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <EnquiryButton kind={asFormKind(service.formKind)} context={service.name}>
                  Enquire
                </EnquiryButton>
                <ContactActions contact={contact} context={service.name} />
              </div>
            </div>
          </Region>
        </div>
      </Section>
    </main>
  );
}
