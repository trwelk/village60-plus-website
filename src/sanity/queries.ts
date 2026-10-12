import { defineQuery } from 'next-sanity';

const IMAGE = /* groq */ `
  ...,
  asset->{ _id, url, metadata { lqip, dimensions { width, height, aspectRatio } } }
`;

const SEO = /* groq */ `seo{ ..., image{ ${IMAGE} } }`;

const FAQS = /* groq */ `faqs[]->{ _id, question, answer }`;

const CAPABILITY = /* groq */ `{ _key, title, description, provision, status }`;

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    brandName, tagline, legalName, foundedYear,
    phone, phoneDisplay, whatsapp, email, openingHours, responseTime, emergencyNotice,
    headOffice, socialLinks, formRecipients,
    defaultSeo{ ..., image{ ${IMAGE} } }
  }
`);

export const PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, intro, body, lastReviewed,
    heroImage{ ${IMAGE} },
    heroVideo{ description, poster{ ${IMAGE} }, "videoUrl": video.asset->url, "captionsUrl": captions.asset->url },
    sections[]{ _key, eyebrow, heading, body, tone, cta, status, image{ ${IMAGE} } },
    ${FAQS},
    ${SEO}
  }
`);

const RESIDENCE_CARD = /* groq */ `
  _id, name, "slug": slug.current, status, isFlagship, shortLocation, summary,
  heroImage{ ${IMAGE} },
  careTypes[]->{ _id, name, "slug": slug.current, status }
`;

export const RESIDENCES_QUERY = defineQuery(/* groq */ `
  *[_type == "residence"] | order(isFlagship desc, name asc){ ${RESIDENCE_CARD} }
`);

export const RESIDENCE_QUERY = defineQuery(/* groq */ `
  *[_type == "residence" && slug.current == $slug][0]{
    ${RESIDENCE_CARD},
    description, audienceFit, atmosphere, sharedSpaces, formKind, comingSoonNote,
    rooms[]{ _key, name, house, summary, facts, image{ ${IMAGE} } },
    careAndSupport[]${CAPABILITY},
    everydayLife[]${CAPABILITY},
    gallery[]{ ${IMAGE} },
    team[]->[approvedForPublication == true]{ _id, name, role, credentials, bio, image{ ${IMAGE} } },
    address,
    ${FAQS},
    ${SEO},
    "testimonials": *[_type == "testimonial" && approved == true && residence._ref == ^._id]{ _id, quote, displayName, relationship }
  }
`);

const CARE_SERVICE_CARD = /* groq */ `
  _id, name, "slug": slug.current, status, summary, typicalDuration,
  heroImage{ ${IMAGE} }
`;

export const CARE_SERVICES_QUERY = defineQuery(/* groq */ `
  *[_type == "careService"] | order(name asc){ ${CARE_SERVICE_CARD} }
`);

export const CARE_SERVICE_QUERY = defineQuery(/* groq */ `
  *[_type == "careService" && slug.current == $slug][0]{
    ${CARE_SERVICE_CARD},
    whoItSuits, notRightFit, formKind,
    included[]${CAPABILITY},
    process[]{ _key, title, description },
    ${FAQS},
    ${SEO},
    "residences": *[_type == "residence" && references(^._id)] | order(isFlagship desc, name asc){
      _id, name, "slug": slug.current, status, shortLocation
    }
  }
`);

const OFFERING_CARD = /* groq */ `
  _id, name, "slug": slug.current, status, tagline, distinction, summary, heroTone, ctaLabel, formKind,
  heroImage{ ${IMAGE} }
`;

export const OFFERINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "ecosystemOffering"] | order(name asc){ ${OFFERING_CARD} }
`);

export const OFFERING_QUERY = defineQuery(/* groq */ `
  *[_type == "ecosystemOffering" && slug.current == $slug][0]{
    ${OFFERING_CARD},
    currentCapabilities[]${CAPABILITY},
    plannedCapabilities[]${CAPABILITY},
    howItWorks[]{ _key, title, description },
    benefitGroups[]{ _key, audience, points },
    sections[]{ _key, eyebrow, heading, body, tone, cta, status, image{ ${IMAGE} } },
    ${FAQS},
    ${SEO}
  }
`);

export const TEAM_QUERY = defineQuery(/* groq */ `
  *[_type == "teamMember" && approvedForPublication == true] | order(order asc, name asc){
    _id, name, role, credentials, bio, image{ ${IMAGE} }
  }
`);

export const FAQS_FOR_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "faq" && $page in pages] | order(question asc){ _id, question, answer }
`);

export const SITEMAP_QUERY = defineQuery(/* groq */ `{
  "residences": *[_type == "residence" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "careServices": *[_type == "careService" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "offerings": *[_type == "ecosystemOffering" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, _updatedAt, "noIndex": seo.noIndex }
}`);

export const SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == $type && defined(slug.current)].slug.current
`);
