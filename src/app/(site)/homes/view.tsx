import Link from 'next/link';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import type { ResidenceCardData } from '@/components/content/ResidenceCard';
import { residencePath } from '@/lib/routes';

const ESTABLISHED = ['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields'] as const;

const ESTABLISHED_COPY: Record<(typeof ESTABLISHED)[number], string> = {
  tranquility: 'A comfortable residence offering familiar living with everyday support nearby.',
  serenity: 'A welcoming residence with a relaxed atmosphere and personal support.',
  'house-on-the-hill': 'A quieter home with character offering calm and spacious surroundings.',
  'enchanted-fields': 'A greener setting with more space, nature and a slower rhythm of life.',
};

const HERO_PHOTO = { src: '/homes/hero.jpg', alt: 'A residence entrance at dusk, with warm light in the windows' };
const ORACLE_PHOTO = { src: '/home/oracle-sign.jpg', alt: 'Oracle at dusk, with the illuminated residence sign' };
const HERITAGE_PHOTO = {
  src: '/look-to-the-future/heritage.jpg',
  alt: 'The Heritage estate in Matara, a colonial bungalow and gardens above the coast at sunset',
};
const GUIDANCE_PHOTO = { src: '/people/lounge.jpg', alt: 'A nurse sitting with a resident in the lounge' };

const ORACLE_TILES = [
  { src: '/homes/bedroom.jpg', alt: 'A private bedroom opening onto the garden', caption: 'Ten unique rooms' },
  { src: '/home/living-room.jpg', alt: 'A shared lounge looking onto palms', caption: 'Elegant shared spaces' },
  { src: '/homes/court.jpg', alt: 'A quiet courtyard beside the residence', caption: 'Private and peaceful' },
  { src: '/homes/sitting.jpg', alt: 'A private sitting room beside the garden', caption: 'Independent living' },
] as const;

const ESTABLISHED_PHOTOS: Record<(typeof ESTABLISHED)[number], { src: string; alt: string }> = {
  tranquility: {
    src: '/homes/tranquility.jpg',
    alt: 'Tranquility at Nawala Road at dusk, a white building with a peaked roof and glass entrance',
  },
  serenity: {
    src: '/homes/serenity/serenity-verandah.jpg',
    alt: 'The verandah at Serenity in the evening light, with purple bougainvillea along the roofline',
  },
  'house-on-the-hill': {
    src: '/homes/hill.jpg',
    alt: 'House on the Hill at dusk, with the illuminated entrance sign and driveway up to the white residence',
  },
  'enchanted-fields': {
    src: '/homes/fields.jpg',
    alt: 'Enchanted Fields retirement villas on a sunny afternoon, with a green roof, white verandah and wide lawn',
  },
};

const HERITAGE_TILES = [
  { src: '/destination-retirement/beach.jpg', alt: 'A quiet beach at sunset on the southern coast', caption: 'Southern coast' },
  { src: '/destination-retirement/bedroom.jpg', alt: 'A bright bedroom opening onto a tropical garden', caption: '50 private chalets' },
  { src: '/destination-retirement/spa.jpg', alt: 'A spa treatment in a quiet treatment room', caption: 'Spa and wellness' },
  { src: '/destination-retirement/hero.jpg', alt: 'A cliffside pool looking out to the ocean', caption: 'Wellness destination' },
] as const;

const filled =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-night px-5 text-[11px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-green';
const outline =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-night/70 bg-transparent px-5 text-[11px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-sand';
const filledOnDark =
  'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full bg-ivory px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-pale-gold';
const outlineOnDark =
  'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-ivory/80 bg-transparent px-5 text-[12px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';
const learnMore =
  'inline-flex min-h-10 items-center gap-2 rounded-[3px] bg-gold px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-pale-gold';
const heroGold =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold';
const heroGhost =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] border border-ivory/80 px-5 text-[12px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 32 32" className="mx-auto size-8" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <path d="M5 14.5 16 6l11 8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 13.5V26h15V13.5" strokeLinejoin="round" />
      <path d="M13.5 26v-6.5h5V26" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 32 32" className="mx-auto size-8" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <path d="M16 24.5s-6.2-3.7-6.2-8.1a3.5 3.5 0 0 1 6.2-2.2 3.5 3.5 0 0 1 6.2 2.2c0 4.4-6.2 8.1-6.2 8.1z" strokeLinejoin="round" />
      <path d="M7 15.5c0-5.4 3.6-8.2 9-8.2" strokeLinecap="round" />
      <path d="M25 15.5c0-5.4-3.6-8.2-9-8.2" strokeLinecap="round" />
    </svg>
  );
}

function MealIcon() {
  return (
    <svg viewBox="0 0 32 32" className="mx-auto size-8" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <path d="M8 6.5v7a2.5 2.5 0 0 0 5 0v-7M10.5 6.5V26" strokeLinecap="round" />
      <path d="M20 6.5c2.2 2.4 3 5 3 7.2 0 2-.8 3.3-3 3.3V26" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 32 32" className="mx-auto size-8" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <circle cx="16" cy="9" r="3" />
      <path d="M9.5 25.5v-2.2c0-2.8 2.6-4.8 6.5-4.8s6.5 2 6.5 4.8v2.2" strokeLinecap="round" />
      <path d="M23.5 11.5v4M21.5 13.5h4" strokeLinecap="round" />
    </svg>
  );
}

const PROMISES: Array<{ title: string; icon: () => ReactNode }> = [
  { title: 'Beautiful Places to Live', icon: HouseIcon },
  { title: 'A True Sense of Home', icon: HomeIcon },
  { title: 'Home-Cooked Meals', icon: MealIcon },
  { title: 'Support When You Need It', icon: SupportIcon },
];

function placeLabel(location?: string | null) {
  return location?.split(',')[0]?.trim() || '';
}

function findResidence(residences: ResidenceCardData[], slug: string) {
  return residences.find((residence) => residence.slug === slug && residence.name) ?? null;
}

function Frame({ src, alt, priority = false, className = '' }: { src: string; alt: string; priority?: boolean; className?: string }) {
  return <img src={src} alt={alt} fetchPriority={priority ? 'high' : 'auto'} className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
}

export function HomesView({ residences }: { residences: ResidenceCardData[] }) {
  const oracle = findResidence(residences, 'oracle');
  const established = ESTABLISHED.flatMap((slug) => {
    const residence = findResidence(residences, slug);
    return residence ? [residence] : [];
  });
  const portfolio = oracle ? 'oracle' : 'heritage';

  return (
    <main id="main">
      <section aria-labelledby="page-title" data-homes-section="hero" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <img src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="max-w-[40rem]">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase">Our homes</p>
              <h1 id="page-title" className="mt-4 font-display text-[clamp(2.6rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.02em] text-ivory">
                A Place for Every Chapter.
              </h1>
              <p className="mt-6 max-w-[36rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
                Different homes. Different settings. The same purpose, to help you live well, in comfort, with the right support around you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={portfolio ? '#portfolio' : '#guidance'} className={heroGold}>
                  Explore our homes
                  <Arrow />
                </a>
                <EnquiryButton kind="general" context="Our homes" className={heroGhost}>
                  Enquire
                  <Arrow />
                </EnquiryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="What the homes share" className="border-t border-stone bg-ivory" data-homes-section="promises">
        <ul className="mx-auto grid max-w-site grid-cols-2 gap-y-8 gutter py-10 md:grid-cols-4 md:divide-x md:divide-stone md:py-14">
          {PROMISES.map((promise) => {
            const Icon = promise.icon;
            return (
              <li key={promise.title} className="px-4 text-center text-charcoal">
                <Icon />
                <p className="mx-auto mt-4 max-w-[12rem] text-[15px] leading-snug">{promise.title}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {oracle ? (
        <section aria-labelledby="oracle-title" className="bg-ivory" data-homes-section="oracle" id={portfolio === 'oracle' ? 'portfolio' : undefined}>
          <div className="grid items-center lg:grid-cols-2">
            <div className="mx-auto w-full max-w-[40rem] gutter py-14 lg:ml-auto lg:py-20 lg:pr-16">
              {placeLabel(oracle.shortLocation) ? (
                <p className="text-[12px] font-semibold tracking-[0.18em] text-bronze uppercase">{placeLabel(oracle.shortLocation)}</p>
              ) : null}
              <h2 id="oracle-title" className="mt-3 font-display text-[clamp(52px,6vw,84px)] leading-none font-medium tracking-[0.04em] uppercase">
                {oracle.name}
              </h2>
              <p className="mt-4 font-display text-[clamp(26px,3vw,34px)] leading-tight">A New Standard of Living.</p>
              <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-charcoal/80">
                Ten individually designed private rooms for independent adults who value their privacy, freedom and way of life. Beautiful spaces, thoughtful details and supportive services, all within an elegant private residence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/oracle" className={filled}>
                  Discover Oracle
                  <Arrow />
                </Link>
                <Link href="/oracle#oracle-rooms" className={outline}>
                  View the rooms
                  <Arrow />
                </Link>
              </div>
            </div>
            <div className="relative min-h-[20rem] sm:min-h-[28rem] lg:min-h-[36rem]">
              <Frame src={ORACLE_PHOTO.src} alt={ORACLE_PHOTO.alt} className="object-[72%_center]" />
            </div>
          </div>
          <ul className="mx-auto grid max-w-site grid-cols-2 gap-4 gutter pt-8 pb-14 md:grid-cols-4 lg:pb-20">
            {ORACLE_TILES.map((photo) => (
              <li key={photo.caption}>
                <div className="relative aspect-[3/2] bg-sand">
                  <Frame src={photo.src} alt={photo.alt} />
                </div>
                <p className="mt-3 text-center text-[11px] font-semibold tracking-[0.16em] text-charcoal uppercase">{photo.caption}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        aria-labelledby="heritage-title"
        className="bg-night text-ivory on-dark"
        data-homes-section="heritage"
        id={portfolio === 'heritage' ? 'portfolio' : undefined}
      >
        <div className="grid items-center lg:grid-cols-2">
          <div className="mx-auto w-full max-w-[40rem] gutter py-14 lg:ml-auto lg:py-20 lg:pr-16">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-pale-gold uppercase">Coming 2027</p>
            <h2 id="heritage-title" className="mt-3 font-display text-[clamp(52px,6vw,84px)] leading-none font-medium tracking-[0.04em] text-ivory uppercase">
              The Heritage
            </h2>
            <p className="mt-4 font-display text-[clamp(26px,3vw,34px)] leading-tight text-ivory">Where History Meets a New Era.</p>
            <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-ivory/85">
              A luxury retirement and wellness destination on the historic Keunaman Bungalow Estate in Matara — gardens, the old bungalow, and the same personal approach that has defined Village 60 Plus since 2008.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/look-to-the-future/heritage" className={filledOnDark}>
                Discover The Heritage
                <Arrow />
              </Link>
              <EnquiryButton kind="destination-retirement" context="The Heritage" className={outlineOnDark}>
                Register your interest
                <Arrow />
              </EnquiryButton>
            </div>
          </div>
          <div className="relative min-h-[20rem] sm:min-h-[28rem] lg:min-h-[36rem]">
            <Frame src={HERITAGE_PHOTO.src} alt={HERITAGE_PHOTO.alt} className="object-[center_55%]" />
          </div>
        </div>
        <ul className="mx-auto grid max-w-site grid-cols-2 gap-4 gutter pt-8 pb-14 md:grid-cols-4 lg:pb-16">
          {HERITAGE_TILES.map((photo) => (
            <li key={photo.caption}>
              <div className="relative aspect-[3/2] bg-night">
                <Frame src={photo.src} alt={photo.alt} />
              </div>
              <p className="mt-3 text-center text-[11px] font-semibold tracking-[0.16em] text-ivory/90 uppercase">{photo.caption}</p>
            </li>
          ))}
        </ul>
      </section>

      {established.length > 0 ? (
        <section aria-labelledby="established-title" className="bg-ivory" data-homes-section="established">
          <div className="mx-auto max-w-site gutter py-16 lg:py-24">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-bronze uppercase">Our established residences</p>
            <h2 id="established-title" className="mt-3 max-w-[16ch] font-display text-[clamp(36px,4.4vw,58px)] leading-[1.05] font-medium">
              Homes With Their Own Character.
            </h2>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-charcoal/80">
              Our existing residences continue to welcome residents and families, each with its own atmosphere, community and way of living.
            </p>
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
              {established.map((residence) => {
                const slug = residence.slug as (typeof ESTABLISHED)[number];
                const place = placeLabel(residence.shortLocation);
                const shot = ESTABLISHED_PHOTOS[slug];
                return (
                  <li key={residence._id}>
                    <article className="flex h-full flex-col">
                      <div className="relative aspect-[4/3] bg-sand">
                        {shot ? <Frame src={shot.src} alt={shot.alt} /> : null}
                      </div>
                      <h3 className="mt-4 font-display text-[26px] leading-tight">{residence.name}</h3>
                      {place ? <p className="mt-1 text-[11px] font-semibold tracking-[0.16em] text-bronze uppercase">{place}</p> : null}
                      <p className="mt-3 text-[15px] leading-relaxed text-charcoal/80">{ESTABLISHED_COPY[slug] || residence.summary}</p>
                      <div className="mt-5">
                        <Link href={residencePath(residence.slug || '')} aria-label={`Learn more about ${residence.name}`} className={learnMore}>
                          Learn more
                          <Arrow />
                        </Link>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="guidance-title" className="border-t border-stone bg-ivory" data-homes-section="guidance" id="guidance">
        <div className="grid items-center lg:grid-cols-2">
          <div className="mx-auto w-full max-w-[40rem] gutter py-14 lg:ml-auto lg:py-20 lg:pr-16">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-bronze uppercase">Not sure which home is right?</p>
            <h2 id="guidance-title" className="mt-3 max-w-[14ch] font-display text-[clamp(36px,4.4vw,56px)] leading-[1.05] font-medium">
              Let&apos;s Find the Right Option.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-charcoal/80">
              Every person&apos;s circumstances are different. We can help you explore the most suitable home or support option, whether within Village 60 Plus or through our wider network via Silver Roots.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/find-the-right-care" className={filled}>
                Get guidance
                <Arrow />
              </Link>
              <EnquiryButton kind="general" context="Our homes" className={outline}>
                Enquire
                <Arrow />
              </EnquiryButton>
            </div>
          </div>
          <div className="relative min-h-[20rem] sm:min-h-[26rem] lg:min-h-[32rem]">
            <Frame src={GUIDANCE_PHOTO.src} alt={GUIDANCE_PHOTO.alt} className="object-[center_30%]" />
          </div>
        </div>
      </section>
    </main>
  );
}
