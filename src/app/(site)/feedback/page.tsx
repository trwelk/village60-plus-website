import type { Metadata } from 'next';
import { PageHero } from '@/components/content/PageHero';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section } from '@/components/ui/Section';
import { getPublicEnv } from '@/lib/env';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/feedback';
const TITLE = 'Feedback and complaints';
const INTRO = 'Tell us what went well, or what we should put right. A member of the team will reply.';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl } = getPublicEnv();
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: TITLE,
    fallbackDescription: INTRO,
  });
}

export default async function FeedbackPage() {
  const { siteUrl } = getPublicEnv();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: TITLE, href: PATH }])} />
      <main id="main">
        <PageHero
          layout="overlay"
          title={TITLE}
          intro={INTRO}
          eyebrow="Village 60 Plus"
          tone="night"
          photo={{ src: '/people/lounge.jpg', alt: '' }}
        />
        <Section tone="paper" labelledBy="feedback-form">
          <EnquiryForm kind="feedback" context="Feedback" headingId="feedback-form" layout="aside" eyebrow="Write to us" />
        </Section>
      </main>
    </>
  );
}
