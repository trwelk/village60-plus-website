/**
 * Development dataset. Deterministic _ids so `npm run seed` is idempotent.
 * All copy is unverified development filler adapted from docs/source/website-extract.md.
 * Nothing here may reach production without client confirmation (spec §20).
 */
import type { ContentStatus } from '@/lib/content-status';
import type { FormKind } from '@/lib/forms/kinds';
import { type CareServiceSlug, type OfferingSlug, type PageSlug, type ResidenceSlug } from '@/lib/routes';
import { STOCK_PHOTOS, type StockPhotoKey } from './stock-photos';

export const PLACEHOLDER_REPLACE_BY = '2027-01-31';

const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);

const REVIEW = {
  _type: 'editorial',
  reviewStatus: 'draft',
  requiresComplianceReview: true,
  reviewNotes: 'Seeded development content. Verify every fact against spec §20 before approving.',
} as const;

/** mediaImage without an asset. `seedPhoto` is stripped by scripts/seed.ts after the JPEG is uploaded. */
export function stockImage(photoKey: StockPhotoKey, keySuffix = 'image') {
  const photo = STOCK_PHOTOS[photoKey];
  return {
    _type: 'mediaImage' as const,
    _key: key(`${photoKey}-${keySuffix}`),
    alt: photo.alt,
    seedPhoto: photoKey,
    source: `${photo.photographer} — Unsplash (${photo.page})`,
    license: 'other',
    licenseNotes: 'Unsplash License (https://unsplash.com/license). Free for commercial use. Temporary development photograph, not a Village 60 Plus property, resident or staff member.',
    consent: photo.people ? 'obtained' : 'not-required',
    consentRecord: photo.people ? `Unsplash License model-release warranty — ${photo.page}` : undefined,
    placeholder: true,
    replaceBy: PLACEHOLDER_REPLACE_BY,
    ...('hotspot' in photo && photo.hotspot ? { hotspot: photo.hotspot } : {}),
  };
}

export function paragraphs(...texts: string[]) {
  return texts.map((text, i) => ({
    _type: 'block',
    _key: `p${i}-${key(text)}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
  }));
}

const ref = (id: string) => ({ _type: 'reference' as const, _ref: id, _key: key(id) });
const capability = (title: string, description: string, status: ContentStatus = 'available', provision: 'included' | 'optional-extra' | 'partner-arranged' = 'included') => ({
  _type: 'capability' as const,
  _key: key(title),
  title,
  description,
  provision,
  status,
});
const step = (title: string, description: string) => ({ _type: 'step' as const, _key: key(title), title, description });
const strings = (...items: string[]) => items;

// ---------- site settings ----------

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  brandName: 'Village 60 Plus',
  tagline: 'Live well. Age exceptionally.',
  legalName: 'Village 60 Plus (Pvt) Ltd',
  // foundedYear deliberately omitted until 2008 vs 2009 is confirmed.
  phone: '+94112504838',
  phoneDisplay: '+94 11 250 4838',
  whatsapp: '+94741003994',
  email: 'village60plus@gmail.com',
  openingHours: 'Monday to Saturday, 9am to 6pm (to be confirmed)',
  responseTime: 'within one working day',
  headOffice: {
    _type: 'address',
    line1: '133/19 Nawala Road',
    line2: 'Narahenpita',
    city: 'Colombo 05',
    country: 'Sri Lanka',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=133%2F19+Nawala+Road+Narahenpita+Colombo',
  },
  emergencyNotice: 'This website cannot respond to emergencies. If someone is in immediate danger, call 1990 (Suwa Seriya ambulance) or go to the nearest hospital.',
  formRecipients: [
    { _key: 'general', _type: 'formRecipient', kind: 'general', to: ['village60plus@gmail.com'] },
  ],
  defaultSeo: {
    _type: 'seo',
    title: 'Village 60 Plus — homes, care and support for later life in Sri Lanka',
    description: 'Residential care, independent living, respite, recovery and rehabilitation across Colombo. Speak to a person by phone or WhatsApp.',
  },
};

// ---------- care services ----------

type CareSeed = { slug: CareServiceSlug; name: string; status: ContentStatus; summary: string; whoItSuits: string[]; typicalDuration?: string; included: ReturnType<typeof capability>[] };

const careSeeds: CareSeed[] = [
  {
    slug: 'independent-living',
    name: 'Independent Living',
    status: 'limited',
    summary: 'A private home of your own with shared spaces, everyday services and support quietly available when you want it.',
    whoItSuits: strings('Adults who manage their own day and want fewer chores', 'People who value privacy but not isolation', 'Those planning ahead for changing needs'),
    included: [
      capability('Private room', 'An individually designed room you can make your own.'),
      capability('Dining', 'Meals prepared on site, with flexible timing.'),
      capability('Housekeeping and laundry', 'Regular cleaning and laundry so your time is your own.'),
      capability('Everyday assistance', 'Help with errands, appointments and small tasks when asked.', 'available', 'optional-extra'),
    ],
  },
  {
    slug: 'residential-care',
    name: 'Residential Care',
    status: 'available',
    summary: 'A comfortable home with a care team on hand around the clock for personal support, meals and daily routines.',
    whoItSuits: strings('People who need help with washing, dressing or moving about', 'Families who want the reassurance of a team nearby day and night', 'Those for whom living alone has become difficult'),
    included: [
      capability('Personal care', 'Support with washing, dressing, mobility and medication reminders.'),
      capability('Meals and dining', 'Three meals a day with attention to dietary needs.'),
      capability('Housekeeping and laundry', 'Rooms and linen cared for by the team.'),
      capability('Health and appointment coordination', 'Help arranging and attending appointments with your own doctors.', 'available', 'partner-arranged'),
    ],
  },
  {
    slug: 'respite-care',
    name: 'Respite Care',
    status: 'available',
    summary: 'A short, planned stay that gives a family carer a break while the person they care for is looked after.',
    whoItSuits: strings('Family carers who need rest or time away', 'People whose usual support is temporarily unavailable', 'Anyone wanting to try a residence before deciding'),
    typicalDuration: 'One to four weeks',
    included: [
      capability('Short-stay room', 'A furnished room for the agreed period.'),
      capability('Personal care and meals', 'The same daily support and meals as longer-term residents.'),
    ],
  },
  {
    slug: 'recovery',
    name: 'Recovery',
    status: 'available',
    summary: 'Supported time to regain strength after a hospital stay, illness or surgery before returning home.',
    whoItSuits: strings('People leaving hospital who are not yet ready to be at home alone', 'Families coordinating care from overseas', 'Anyone whose doctor has advised a period of supported rest'),
    typicalDuration: 'Two to six weeks',
    included: [
      capability('24-hour support', 'A care team nearby day and night.'),
      capability('Nutrition', 'Meals planned around recovery and dietary advice.'),
      capability('Therapy sessions', 'Physiotherapy or other therapy arranged with external practitioners.', 'available', 'partner-arranged'),
    ],
  },
  {
    slug: 'rehabilitation',
    name: 'Rehabilitation',
    status: 'available',
    summary: 'A structured programme of therapy and support, coordinated with your own medical team, to rebuild confidence and mobility.',
    whoItSuits: strings('People recovering from a stroke, fall or operation', 'Those whose medical team has recommended rehabilitation', 'Families who want progress communicated clearly'),
    typicalDuration: 'Agreed with your medical team',
    included: [
      capability('Therapy coordination', 'Scheduling and transport for therapy delivered by external specialists.', 'available', 'partner-arranged'),
      capability('Daily support', 'Personal care, meals and encouragement between sessions.'),
    ],
  },
];

const CARE_PHOTO: Record<CareServiceSlug, StockPhotoKey> = {
  'independent-living': 'bedroom',
  'residential-care': 'courtyard',
  'respite-care': 'lush-entrance',
  recovery: 'wicker',
  rehabilitation: 'tea-hills',
};

const careServices = careSeeds.map((c) => ({
  _id: `careService.${c.slug}`,
  _type: 'careService',
  name: c.name,
  slug: { _type: 'slug', current: c.slug },
  status: c.status,
  summary: c.summary,
  heroImage: stockImage(CARE_PHOTO[c.slug], c.slug),
  whoItSuits: c.whoItSuits,
  typicalDuration: c.typicalDuration,
  included: c.included,
  process: [
    step('Tell us a little', 'Call, message or send the short form. You do not need to know the care category.'),
    step('A conversation', 'A team member calls back to understand the situation and answer questions.'),
    step('Visit and assessment', 'A visit to a residence and, where needed, an assessment with the care lead.'),
    step('A clear next step', 'A written summary of what is included and how to proceed. No obligation.'),
  ],
  notRightFit: 'If Village 60 Plus is not the right fit, the team will say so and, where possible, suggest other services through Silver Roots.',
  formKind: 'general' satisfies FormKind,
  editorial: REVIEW,
  seo: { _type: 'seo', title: `${c.name} in Sri Lanka | Village 60 Plus`, description: c.summary.slice(0, 160) },
}));

// ---------- residences ----------

type ResidenceSeed = {
  slug: ResidenceSlug;
  name: string;
  status: ContentStatus;
  isFlagship?: boolean;
  shortLocation: string;
  summary: string;
  careTypes: CareServiceSlug[];
  audienceFit: string[];
  formKind: FormKind;
  comingSoonNote?: string;
  rooms?: Array<{ name: string; house?: string }>;
};

const residenceSeeds: ResidenceSeed[] = [
  {
    slug: 'tranquility',
    name: 'Tranquility',
    status: 'available',
    shortLocation: 'Narahenpita, Colombo',
    summary: 'A welcoming residence in the city, where residents keep their own routines with everyday support close at hand.',
    careTypes: ['residential-care', 'respite-care', 'recovery'],
    audienceFit: strings('People who want to stay connected to central Colombo', 'Families who visit often', 'Those who need daily support in a familiar, home-like setting'),
    formKind: 'general',
  },
  {
    slug: 'serenity',
    name: 'Serenity',
    status: 'available',
    shortLocation: 'Railway Avenue (location to be confirmed)',
    summary: 'A smaller home built around comfort and familiarity, where people settle in, build relationships and feel known.',
    careTypes: ['residential-care', 'respite-care'],
    audienceFit: strings('People who prefer a small household', 'Those who value calm and routine', 'Families looking for a close-knit team'),
    formKind: 'general',
  },
  {
    slug: 'house-on-the-hill',
    name: 'House on the Hill',
    status: 'available',
    shortLocation: 'Kirulapone, Colombo',
    summary: 'A quieter residence with the warmth and character of a traditional home, set within a residential neighbourhood.',
    careTypes: ['residential-care', 'recovery', 'rehabilitation'],
    audienceFit: strings('People who want a home with character rather than a facility', 'Those recovering after hospital', 'Families seeking a quiet neighbourhood setting'),
    formKind: 'general',
  },
  {
    slug: 'enchanted-fields',
    name: 'Enchanted Fields',
    status: 'available',
    shortLocation: 'Homagama',
    summary: 'A greener, more open setting away from the pace of central Colombo, combining residential living with outdoor space.',
    careTypes: ['residential-care', 'respite-care', 'recovery'],
    audienceFit: strings('People who value gardens and open air', 'Those who prefer a slower rhythm of life', 'Families in or near Homagama'),
    formKind: 'general',
  },
  {
    slug: 'oracle',
    name: 'Oracle',
    status: 'limited',
    isFlagship: true,
    shortLocation: 'Pepiliyana',
    summary: 'Ten individually designed rooms within a private residence for independent adults, with shared spaces and support quietly available.',
    careTypes: ['independent-living'],
    audienceFit: strings('Independent adults who want privacy without isolation', 'People who would like everyday chores taken care of', 'Those planning ahead so support can grow with them'),
    formKind: 'oracle-visit',
    rooms: [
      { name: 'Jade', house: 'House 1' }, { name: 'Onyx', house: 'House 1' }, { name: 'Ruby', house: 'House 1' }, { name: 'Ivory', house: 'House 1' }, { name: 'Coral', house: 'House 1' },
      { name: 'Pearl', house: 'House 2' }, { name: 'Amber', house: 'House 2' }, { name: 'Sapphire', house: 'House 2' }, { name: 'Opal', house: 'House 2' }, { name: 'Emerald', house: 'House 2' },
    ],
  },
  {
    slug: 'the-grove',
    name: 'The Grove',
    status: 'coming-soon',
    shortLocation: 'Kottawa',
    summary: 'The next stage of the Village 60 Plus residential expansion. Details will be published as they are confirmed.',
    careTypes: [],
    audienceFit: strings('Families planning ahead', 'People interested in the newer generation of Village 60 Plus homes'),
    formKind: 'grove-interest',
    comingSoonNote: 'The Grove is not yet open. Room numbers, care options and opening dates will be confirmed before they are published here. Register your interest and the team will contact you when there is verified news.',
  },
];

const RESIDENCE_PHOTO: Record<ResidenceSlug, { hero: StockPhotoKey; living?: StockPhotoKey; garden?: StockPhotoKey }> = {
  tranquility: { hero: 'timber-house', living: 'courtyard', garden: 'tropical-garden' },
  serenity: { hero: 'garden-bungalow', living: 'patio', garden: 'lush-entrance' },
  'house-on-the-hill': { hero: 'palm-verandah', living: 'wicker', garden: 'flower-path' },
  'enchanted-fields': { hero: 'tropical-garden', living: 'courtyard', garden: 'tea-hills' },
  oracle: { hero: 'bungalow', living: 'patio', garden: 'flower-path' },
  'the-grove': { hero: 'flower-path' },
};

const ORACLE_ROOM_PHOTOS: StockPhotoKey[] = ['bedroom', 'patio', 'wicker', 'courtyard'];

const residences = residenceSeeds.map((r) => ({
  _id: `residence.${r.slug}`,
  _type: 'residence',
  name: r.name,
  slug: { _type: 'slug', current: r.slug },
  status: r.status,
  isFlagship: r.isFlagship ?? false,
  shortLocation: r.shortLocation,
  summary: r.summary,
  heroImage: stockImage(RESIDENCE_PHOTO[r.slug].hero, r.slug),
  description: paragraphs(r.summary, 'The right home depends on the person. This page describes who the home suits, what daily life is like and what support is available, so a family can decide whether to visit.'),
  careTypes: r.careTypes.map((slug) => ref(`careService.${slug}`)),
  audienceFit: r.audienceFit,
  atmosphere: r.status === 'coming-soon' ? undefined : paragraphs('Mornings start at your own pace. Meals are shared or taken in your room. Family are welcome to visit, and the team is nearby without hovering.'),
  rooms: r.rooms?.map((room, index) => ({
    _type: 'room',
    _key: key(room.name),
    name: room.name,
    house: room.house,
    summary: 'Room details and photography will be added.',
    image: stockImage(ORACLE_ROOM_PHOTOS[index % ORACLE_ROOM_PHOTOS.length], room.name),
  })),
  sharedSpaces: r.status === 'coming-soon' ? undefined : strings('Living room', 'Dining room', 'Garden or terrace'),
  careAndSupport: r.status === 'coming-soon' ? undefined : [
    capability('Care team on site', r.isFlagship ? 'Everyday assistance on request, with care arranged as needs change.' : 'A care team on hand day and night.'),
    capability('Medication reminders', 'Prompts and support with medication the resident already takes, as agreed with their doctor.'),
    capability('Appointment coordination', 'Help arranging transport to and from appointments.', 'available', 'partner-arranged'),
  ],
  everydayLife: r.status === 'coming-soon' ? undefined : [
    capability('Meals', 'Home-cooked meals with attention to dietary needs.'),
    capability('Housekeeping and laundry', 'Rooms and clothing looked after.'),
    capability('Activities', 'Gentle, optional activities and outings.'),
    capability('Family visits', 'Visitors welcome during agreed hours.'),
  ],
  gallery: (() => {
    const photos = RESIDENCE_PHOTO[r.slug];
    if (r.status === 'coming-soon' || !photos.living || !photos.garden) return undefined;
    return [stockImage(photos.living, `${r.slug}-living`), stockImage(photos.garden, `${r.slug}-garden`)];
  })(),
  address: {
    _type: 'address',
    line1: 'Street address to be confirmed',
    city: r.shortLocation.replace(/ \(.*\)$/, ''),
    country: 'Sri Lanka',
    visitingNotes: 'Visits are by appointment. Call or WhatsApp to arrange a time.',
  },
  formKind: r.formKind,
  comingSoonNote: r.comingSoonNote,
  editorial: REVIEW,
  seo: { _type: 'seo', title: `${r.name} — ${r.shortLocation.replace(/ \(.*\)$/, '')} | Village 60 Plus`, description: r.summary.slice(0, 160) },
}));

// ---------- ecosystem offerings ----------

type OfferingSeed = { slug: OfferingSlug; name: string; status: ContentStatus; tagline: string; distinction: string; summary: string; heroTone: 'ivory' | 'night'; formKind: FormKind; current: ReturnType<typeof capability>[]; planned: ReturnType<typeof capability>[]; howItWorks: ReturnType<typeof step>[]; benefitGroups: Array<{ audience: string; points: string[] }> };

const offeringSeeds: OfferingSeed[] = [
  {
    slug: 'silver-roots',
    name: 'Silver Roots',
    status: 'in-development',
    tagline: 'Support that reaches beyond our residences.',
    distinction: 'Village 60 Plus runs homes; Silver Roots helps families find and coordinate care and everyday services wherever someone lives.',
    summary: 'A care-discovery and services platform in development. Today the team helps families by phone; the platform features below are labelled by status.',
    heroTone: 'ivory',
    formKind: 'silver-roots-partner',
    current: [capability('Help finding care by phone', 'Speak to the team about options inside and outside Village 60 Plus.', 'available')],
    planned: [
      capability('Support at home', 'Vetted carers and companions visiting at home.', 'planned', 'partner-arranged'),
      capability('Transport and appointment escorts', 'Someone to accompany appointments.', 'planned', 'partner-arranged'),
      capability('Everyday services', 'Meals, housekeeping and small repairs.', 'planned', 'partner-arranged'),
    ],
    howItWorks: [step('Tell us what is needed', 'A short conversation about the person and the situation.'), step('We suggest options', 'Services from Village 60 Plus or trusted partners.'), step('You choose', 'Nothing is arranged without the family agreeing.')],
    benefitGroups: [
      { audience: 'Families', points: strings('One place to ask about care', 'Options explained in plain language') },
      { audience: 'Providers', points: strings('Reach families who are actively looking', 'Clear referral expectations') },
    ],
  },
  {
    slug: 'destination-retirement',
    name: 'Destination Retirement',
    status: 'planned',
    tagline: 'Longer stays in Sri Lanka, not fast tourism.',
    distinction: 'Destination Retirement is a stay concept for people living abroad; it is not a residence and nothing is bookable yet.',
    summary: 'A planned concept for extended stays in Sri Lanka with practical support. Enquiries are welcome; no properties, packages, healthcare, visas or insurance are offered at this stage.',
    heroTone: 'ivory',
    formKind: 'destination-retirement',
    current: [],
    planned: [capability('Trial stays', 'A shorter first stay before committing to longer periods.', 'planned'), capability('Practical services', 'Transport, housekeeping and local orientation.', 'planned', 'partner-arranged')],
    howItWorks: [step('Register interest', 'Tell us roughly when and for how long.'), step('A conversation', 'The team explains what is realistic today.'), step('Updates', 'We contact you when something concrete exists.')],
    benefitGroups: [{ audience: 'Prospective guests', points: strings('Honest information before you plan', 'A named contact in Sri Lanka') }],
  },
  {
    slug: 'sage',
    name: 'SAGE',
    status: 'pilot',
    tagline: 'Technology in the background. Life in the foreground.',
    distinction: 'SAGE is the technology layer that supports Village 60 Plus teams; it is not a product families buy.',
    summary: 'Tools that help care teams communicate and keep records organised. Capabilities are labelled by status; nothing here replaces people.',
    heroTone: 'night',
    formKind: 'general',
    current: [capability('Team communication', 'Shift notes and handovers within the care team.', 'pilot')],
    planned: [capability('Family updates', 'Agreed, permission-based updates for families.', 'planned'), capability('Connection to Silver Roots', 'Coordinating partner services from the same tools.', 'planned')],
    howItWorks: [],
    benefitGroups: [
      { audience: 'Residents', points: strings('Preferences remembered by the whole team') },
      { audience: 'Families', points: strings('Clearer communication, with permission') },
      { audience: 'Care teams', points: strings('Less paperwork, more time with people') },
    ],
  },
];

const OFFERING_PHOTO: Record<OfferingSlug, StockPhotoKey> = {
  'silver-roots': 'jaffna',
  'destination-retirement': 'tea-hills',
  sage: 'patio',
};

const offerings = offeringSeeds.map((o) => ({
  _id: `ecosystemOffering.${o.slug}`,
  _type: 'ecosystemOffering',
  name: o.name,
  slug: { _type: 'slug', current: o.slug },
  status: o.status,
  tagline: o.tagline,
  distinction: o.distinction,
  summary: o.summary,
  heroImage: stockImage(OFFERING_PHOTO[o.slug], o.slug),
  heroTone: o.heroTone,
  currentCapabilities: o.current,
  plannedCapabilities: o.planned,
  howItWorks: o.howItWorks,
  benefitGroups: o.benefitGroups.map((g) => ({ _type: 'benefitGroup', _key: key(g.audience), audience: g.audience, points: g.points })),
  sections: [
    { _type: 'contentSection', _key: 'privacy', eyebrow: 'Privacy', heading: 'Privacy and permissions', body: paragraphs('Personal information is shared only with the consent of the person it concerns, or their authorised representative.'), tone: 'sand' },
  ],
  formKind: o.formKind,
  ctaLabel: o.formKind === 'silver-roots-partner' ? 'Register partner interest' : 'Enquire',
  editorial: REVIEW,
  seo: { _type: 'seo', title: `${o.name} | Village 60 Plus`, description: o.summary.slice(0, 160) },
}));

// ---------- pages ----------

const pageSeeds: Array<{ slug: PageSlug; title: string; intro?: string; body?: ReturnType<typeof paragraphs>; sections?: Array<{ eyebrow?: string; heading: string; body: string; tone?: string }> }> = [
  { slug: 'home', title: 'Live well. Age exceptionally.', intro: 'Homes, care and practical support for later life in Sri Lanka, built around the person rather than the institution.' },
  { slug: 'find-the-right-care', title: 'Find the right care', intro: 'You do not need to know the name of the care you are looking for. Tell us a little and a person will call you back.' },
  { slug: 'homes', title: 'Our homes', intro: 'Different homes, one philosophy. Compare location, type of support and current status, then visit the one that feels right.' },
  { slug: 'living-and-care', title: 'Living and care', intro: 'Plain explanations of independent living, residential care, respite, recovery and rehabilitation, and how the team helps you choose.' },
  {
    slug: 'our-story',
    title: 'Our story',
    intro: 'We did not start with a vision of an ecosystem. We started with a home.',
    sections: [
      { eyebrow: 'Beginnings', heading: 'A home first', body: 'Village 60 Plus began with a single residence and a simple idea: people should grow older with dignity, feel safe, and continue to feel that their life belongs to them. The founding year will be confirmed with the client before publication.' },
      { eyebrow: 'Today', heading: 'Several homes, one philosophy', body: 'Tranquility, Serenity, House on the Hill and Enchanted Fields each offer a different setting and level of support.' },
      { eyebrow: 'Next', heading: 'The next chapter', body: 'Oracle, The Grove, Silver Roots, SAGE and Destination Retirement extend the same values. Each is labelled with its current status so families know what exists today.', tone: 'green' },
    ],
  },
  { slug: 'contact', title: 'Contact us', intro: 'Call, message on WhatsApp or send a short note. A person will reply, usually within one working day.' },
  { slug: 'privacy', title: 'Privacy notice', body: paragraphs('DRAFT — to be replaced with the notice approved by the client and Sri Lankan counsel.', 'We collect only the details needed to respond to your enquiry: your name, how to contact you and what you are asking about. We do not ask for medical histories or identification numbers on this website.') },
  { slug: 'terms', title: 'Terms of use', body: paragraphs('DRAFT — to be replaced with terms approved by the client and counsel.', 'Information on this website describes services as they stand on the date shown and is not an offer, a medical recommendation or a promise of availability.') },
  { slug: 'accessibility', title: 'Accessibility statement', body: paragraphs('Village 60 Plus wants everyone to be able to use this website. It is designed to meet WCAG 2.2 Level AA.', 'If something does not work for you, call us or email and we will help you another way and fix the problem.') },
];

const PAGE_PHOTO: Partial<Record<PageSlug, StockPhotoKey>> = {
  home: 'patio',
  'find-the-right-care': 'flower-path',
  homes: 'timber-house',
  'living-and-care': 'courtyard',
  'our-story': 'jaffna',
  contact: 'lush-entrance',
};

const pages = pageSeeds.map((p) => {
  const photo = PAGE_PHOTO[p.slug];
  return {
  _id: `page.${p.slug}`,
  _type: 'page',
  title: p.title,
  slug: { _type: 'slug', current: p.slug },
  intro: p.intro,
  heroImage: photo ? stockImage(photo, p.slug) : undefined,
  sections: p.sections?.map((s) => ({ _type: 'contentSection', _key: key(s.heading), eyebrow: s.eyebrow, heading: s.heading, body: paragraphs(s.body), tone: s.tone ?? 'ivory' })),
  body: p.body,
  lastReviewed: p.body ? '2026-10-12' : undefined,
  editorial: REVIEW,
  seo: { _type: 'seo', title: p.slug === 'home' ? 'Village 60 Plus — homes, care and support for later life in Sri Lanka' : `${p.title} | Village 60 Plus`, description: (p.intro ?? p.title).slice(0, 160) },
  };
});

// ---------- FAQs ----------

const faqSeeds = [
  { q: 'Do I need to know which type of care my parent needs before I call?', a: 'No. Describe the situation and the team will explain the options in plain language. The website form is not a medical assessment.', pages: ['home', 'find-the-right-care', 'living-and-care'] },
  { q: 'Can we visit before deciding?', a: 'Yes. Visits are by appointment so that someone can show you around and answer questions. Call or WhatsApp to arrange a time.', pages: ['homes', 'contact'] },
  { q: 'Is Oracle open now?', a: 'Oracle has limited availability. Request a private visit and the team will confirm current room availability directly with you.', pages: ['oracle'] },
  { q: 'When will The Grove open?', a: 'The Grove is coming soon. Dates will be published only once confirmed. Register your interest to be contacted.', pages: ['homes'] },
  { q: 'Can Silver Roots arrange a carer at home today?', a: 'Not yet through the platform. The team can discuss options by phone while Silver Roots is in development.', pages: ['silver-roots'] },
];

const faqs = faqSeeds.map((f) => ({
  _id: `faq.${key(f.q)}`,
  _type: 'faq',
  question: f.q,
  answer: paragraphs(f.a),
  pages: f.pages,
  reviewDate: '2027-01-31',
}));

// Attach FAQs to the documents they belong to.
const faqId = (q: string) => `faq.${key(q)}`;
const withFaqs = <T extends { _id: string }>(doc: T, questions: string[]) => ({ ...doc, faqs: questions.map((q) => ref(faqId(q))) });

export const seedDocuments = [
  siteSettings,
  ...careServices,
  ...residences.map((r) =>
    r.slug.current === 'oracle' ? withFaqs(r, [faqSeeds[2].q]) : r.slug.current === 'the-grove' ? withFaqs(r, [faqSeeds[3].q]) : withFaqs(r, [faqSeeds[1].q]),
  ),
  ...offerings.map((o) => (o.slug.current === 'silver-roots' ? withFaqs(o, [faqSeeds[4].q]) : o)),
  ...pages.map((p) => (p.slug.current === 'find-the-right-care' ? withFaqs(p, [faqSeeds[0].q]) : p)),
  ...faqs,
];
