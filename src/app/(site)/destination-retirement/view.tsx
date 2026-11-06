import { EnquiryButton } from '@/components/forms/EnquiryPanel';

const goldButton =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold';
const enquireButton =
  'inline-flex min-h-12 items-center gap-3 rounded-full bg-bronze py-1.5 pr-1.5 pl-5 text-[15px] font-medium text-ivory transition-colors duration-(--duration-fast) hover:bg-green';

function HeroArrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <span className="inline-flex size-9 items-center justify-center rounded-full bg-ivory text-bronze">
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const services: Array<{ title: string; body: string; src: string; alt: string; focus?: string }> = [
  {
    title: 'Comfortable Accommodation',
    body: 'Well-maintained, relaxing living spaces designed to provide comfort, privacy and convenience.',
    src: '/destination-retirement/bedroom.jpg',
    alt: 'A bright bedroom with a large bed and doors opening onto tropical greenery',
  },
  {
    title: 'Nutritious Meals',
    body: "Freshly prepared, balanced meals to support residents' health and wellbeing.",
    src: '/home/living-room.jpg',
    alt: 'A dining table beside open doors to the garden',
    focus: 'object-[78%_center]',
  },
  {
    title: 'Personal Care and Assistance',
    body: "Friendly support with everyday activities, according to each resident's individual needs.",
    src: '/people/hands.jpg',
    alt: 'A nurse holding hands with a resident',
    focus: 'object-[center_30%]',
  },
  {
    title: 'Recreation and Activities',
    body: 'Opportunities to enjoy hobbies, social gatherings, relaxation and outdoor activities.',
    src: '/homes/serenity/serenity-pool.jpg',
    alt: 'The swimming pool at Serenity, beside the white residence',
  },
  {
    title: 'Peaceful Environment',
    body: 'A pleasant and welcoming atmosphere where residents can relax and enjoy their surroundings.',
    src: '/destination-retirement/beach.jpg',
    alt: 'A palm-lined beach at sunset',
  },
  {
    title: 'Community and Companionship',
    body: 'Opportunities to build friendships, share experiences and feel part of a caring community.',
    src: '/people/social.jpg',
    alt: 'Residents singing together at a celebration',
    focus: 'object-[center_28%]',
  },
];

export function DestinationRetirementView() {
  return (
    <main id="main" className="bg-ivory text-charcoal">
      <section data-dr-section="hero" aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <img src="/destination-retirement/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="max-w-[44rem]">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase">Destination Retirement</p>
              <h1 id="page-title" className="mt-4 font-display text-[clamp(2.15rem,3.6vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.02em] text-ivory">
                Welcome to Destination Retirement, where comfort, care and peace of mind come together.
              </h1>
              <EnquiryButton kind="destination-retirement" context="Destination Retirement" className={`${goldButton} mt-8`}>
                Send an enquiry
                <HeroArrow />
              </EnquiryButton>
            </div>
          </div>
        </div>
      </section>

      <section data-dr-section="intro" aria-labelledby="intro-title" className="bg-ivory">
        <div className="mx-auto grid w-full max-w-[1520px] items-center gap-10 gutter py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <p className="text-[15px] font-medium text-bronze">Destination Retirement</p>
            <h2 id="intro-title" className="mt-3 max-w-[14ch] font-display text-[clamp(2.75rem,4.6vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.03em] text-charcoal">
              Welcome to Destination Retirement
            </h2>
            <ul aria-label="What we provide" className="mt-6 flex list-none flex-wrap gap-2 p-0">
              {services.map((service) => (
                <li key={service.title} className="rounded-full bg-sand px-3 py-1.5 text-[13px] leading-snug text-charcoal">
                  {service.title}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[38rem] text-[16px] leading-relaxed text-charcoal/90">
              Where comfort, care and peace of mind come together. We believe retirement should be a beautiful new chapter in life, filled with happiness, companionship, relaxation and meaningful experiences. Our aim is to provide a safe, comfortable and welcoming environment where senior citizens can enjoy their retirement years with dignity, independence and the support they need. At Destination Retirement, you are not simply choosing a place to live; you are choosing a lifestyle, a community and a place to relax.
            </p>
            <EnquiryButton kind="destination-retirement" context="Destination Retirement" className={`${enquireButton} mt-8`}>
              Enquire now
              <Arrow />
            </EnquiryButton>
          </div>
          <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] lg:min-h-[40rem]">
            <img
              src="/destination-retirement/hero.jpg"
              alt="A cliffside pool looking out to the ocean"
              className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
            />
          </div>
        </div>
      </section>

      <section data-dr-section="provide" aria-labelledby="provide-title" className="bg-ivory">
        <div className="mx-auto w-full max-w-[1520px] gutter py-14 lg:py-20">
          <h2 id="provide-title" className="font-display text-[clamp(2.35rem,3.4vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.025em] text-green">
            What We Provide
          </h2>
          <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {services.map((service) => (
              <Service key={service.title} {...service} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Service({ title, body, src, alt, focus }: { title: string; body: string; src: string; alt: string; focus?: string }) {
  return (
    <li className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-night">
      <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${focus ?? 'object-center'}`} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-night via-night/75 to-transparent" />
      <div className="relative flex h-full flex-col justify-end px-5 pb-6 text-center text-ivory">
        <h3 className="font-display text-[1.35rem] leading-tight font-medium text-balance text-ivory md:text-[1.55rem]">{title}</h3>
        <p className="mt-2 text-[14px] leading-snug text-ivory/90">{body}</p>
      </div>
    </li>
  );
}
