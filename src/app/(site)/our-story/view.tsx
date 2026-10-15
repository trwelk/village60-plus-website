import Link from 'next/link';
import { cn } from '@/lib/cn';

const VERANDAH = {
  src: '/story/verandah.jpg',
  alt: 'A single-storey residence with a clay-tile roof and a verandah shaded by pink and purple bougainvillea',
};
const UPPER_HOUSE = {
  src: '/story/upper-house.jpg',
  alt: 'A two-storey white residence with a clay-tile roof, beside a verandah covered in purple bougainvillea',
};
const GARDEN = {
  src: '/story/garden.jpg',
  alt: 'Lawn and trees in the garden, looking toward a single-storey residence',
};
const LIVING_ROOM = {
  src: '/home/living-room.jpg',
  alt: 'A light-filled living room opening onto a tropical garden',
};
const ORACLE = {
  src: '/home/hero.jpg',
  alt: 'Oracle residence at dusk',
};

type Photo = { src: string; alt: string };
type Mark = 'cils' | 'platinum' | 'encourage' | 'accredit';
type Milestone = {
  year?: string;
  side: 'left' | 'right';
  title: string;
  body: string;
  more?: string;
  image?: Photo;
  mark?: Mark;
};

const MILESTONES: Milestone[] = [
  {
    year: '2008',
    side: 'right',
    title: 'The Beginning',
    body: 'Village 60 Plus was established in 2008 with a vision to create a better way to care for older people. Our first residence laid the foundation for everything that followed.',
    image: GARDEN,
  },
  {
    year: '2013',
    side: 'left',
    title: 'Growing Our Homes',
    body: 'We expanded our residential care network, developing different environments for different kinds of care.',
    image: UPPER_HOUSE,
  },
  {
    year: '2016',
    side: 'left',
    title: 'Education & Training',
    body: 'The Colombo Institute of Life Sciences (CILS) was established, extending our work into professional education, elder-care training, childcare and teacher training.',
    mark: 'cils',
  },
  {
    year: '2018',
    side: 'right',
    title: 'Health & Wellbeing',
    body: 'We introduced healthier food for our residents. Living well here is rooted in nutrition, wellbeing and quality of life at every stage.',
    image: LIVING_ROOM,
  },
  {
    year: '2020',
    side: 'left',
    title: 'Life at Home',
    body: 'Platinum 60 and our care at home began, so people could stay in their own homes with independence and support close by — medicine delivery, transport, household help and everyday companionship.',
    image: VERANDAH,
    mark: 'platinum',
  },
  {
    side: 'right',
    title: 'Community',
    body: 'Encourage SL brought generations together through volunteering. The aim is simple: meaningful connection and companionship for the people who live with us.',
    mark: 'encourage',
  },
  {
    year: '2022',
    side: 'left',
    title: 'International Accreditations',
    body: 'CILS achieved internationally recognised accreditation, strengthening our training standards and the credibility of that work.',
    mark: 'accredit',
  },
  {
    year: '2023',
    side: 'right',
    title: 'Global Opportunities',
    body: 'Training reached further, creating more opportunities for caregivers we have trained and a wider presence in the care sector.',
  },
  {
    year: '2026',
    side: 'right',
    title: 'The Next Generation',
    body: 'We launched Silver Roots, our digital platform for modern ageing — connecting people, services and support for life at home and beyond.',
    more: 'Alongside this, we begin Project Grove — a new purpose-built residence in Kottawa, bringing together private residences and exceptional care for a new generation of retirement living.',
    image: ORACLE,
  },
];

const filled =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ivory px-5 text-[12px] font-semibold tracking-[0.14em] text-green uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-paper';
const outline =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ivory/80 px-5 text-[12px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';
const cardLink =
  'mt-auto inline-flex min-h-10 items-center justify-center self-start rounded-full border border-ivory/70 px-4 text-[11px] font-semibold tracking-[0.16em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';

function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={className} fill="currentColor" aria-hidden>
      <path d="M2 16C10 4 28 2 46 12 34 16 18 24 2 16Z" />
      <path d="M6 16c10-1 22-2 34-3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
    </svg>
  );
}

function VineSegment({ flip }: { flip: boolean }) {
  const d = flip
    ? 'M70 0 C70 28 28 48 28 96 C28 140 70 164 70 200'
    : 'M70 0 C70 28 112 48 112 96 C112 140 70 164 70 200';
  return (
    <svg viewBox="0 0 140 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-y-0 left-1/2 hidden h-full w-[9.5rem] -translate-x-1/2 md:block" aria-hidden>
      <path d={d} fill="none" stroke="#8d6430" strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke="#c4a15a" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function VineLeaves({ flip }: { flip: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      <Leaf className={cn('absolute size-8 text-[#3c6b45]', flip ? '-left-3 top-[8%] -rotate-[42deg]' : '-right-3 top-[10%] rotate-[40deg]')} />
      <Leaf className={cn('absolute size-6 text-[#4e7a48]', flip ? '-left-1 top-[22%] rotate-[18deg]' : '-right-1 top-[24%] -rotate-[14deg]')} />
      <Leaf className={cn('absolute size-5 text-[#2c5336]', flip ? 'right-1 bottom-[20%] rotate-12' : 'left-1 bottom-[18%] -rotate-12')} />
      <Leaf className={cn('absolute size-7 text-[#2f5a38]', flip ? '-right-2 bottom-[8%] -rotate-[24deg]' : '-left-2 bottom-[10%] rotate-[22deg]')} />
      <Leaf className={cn('absolute size-4 text-[#6e8f52]', flip ? 'left-2 top-[48%] rotate-[20deg]' : 'right-2 top-[46%] -rotate-[16deg]')} />
    </div>
  );
}

function YearNode({ year, image, large }: { year?: string; image?: Photo; large?: boolean }) {
  return (
    <div className="relative z-10">
      <div
        className={cn(
          'overflow-hidden rounded-full bg-[#1b4334] ring-2 ring-[#c4a15a] ring-offset-[3px] ring-offset-ivory',
          large ? 'size-32 sm:size-36 md:size-[10.5rem]' : 'size-24 sm:size-28 md:size-[8.25rem]',
        )}
      >
        {image ? (
          <img src={image.src} alt={image.alt} className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#245743,#14352b)]">
            <Leaf className="size-10 text-[#d4b86a]" />
          </div>
        )}
      </div>
      {year ? (
        <time
          dateTime={`${year}-01-01`}
          className={cn(
            'absolute left-1/2 -translate-x-1/2 rounded-full bg-[#6f5a24] font-display leading-none text-ivory',
            large ? '-bottom-3 px-3 py-1.5 text-[15px]' : '-bottom-2.5 px-2.5 py-1 text-[13px]',
          )}
        >
          {year}
        </time>
      ) : null}
    </div>
  );
}

function Lotus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 36" className={className} aria-hidden>
      <path fill="currentColor" d="M32 34C24 26 14 16 12 4c8 3 14 10 20 30Z" />
      <path fill="currentColor" d="M32 34c8-8 18-18 20-30-8 3-14 10-20 30Z" />
      <path fill="currentColor" d="M32 33C26 24 22 12 24 2c3 8 6 16 8 31Z" opacity="0.85" />
      <path fill="currentColor" d="M32 33c6-9 10-21 8-31-3 8-6 16-8 31Z" opacity="0.85" />
      <path fill="currentColor" d="M32 32c-1-8-1-16 0-26 1 10 1 18 0 26Z" />
    </svg>
  );
}

function ClosingWreath() {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-8 hidden md:block">
      <Leaf className="absolute top-1 left-[20%] size-8 -rotate-[46deg] text-[#3c6b45]" />
      <Leaf className="absolute -top-1 left-1/2 size-6 -translate-x-1/2 rotate-[10deg] text-[#2f5a38]" />
      <Leaf className="absolute top-2 right-[16%] size-9 rotate-[40deg] text-[#4e7a48]" />
      <Leaf className="absolute top-[20%] left-0 size-5 -rotate-[18deg] text-[#6e8f52]" />
      <Leaf className="absolute top-[18%] right-0 size-6 rotate-[16deg] text-[#2c5336]" />
      <Leaf className="absolute bottom-[24%] -left-1 size-6 rotate-[22deg] text-[#3c6b45]" />
      <Leaf className="absolute right-0 bottom-[22%] size-5 -rotate-[20deg] text-[#4e7a48]" />
    </div>
  );
}

function StoryBranches() {
  const limbs = [
    'M586 0 C540 52 390 96 270 150 C200 188 190 208 190 220',
    'M600 0 C590 78 610 155 600 220',
    'M614 0 C660 52 810 96 930 150 C1000 188 1010 208 1010 220',
  ];
  return (
    <div aria-hidden className="pointer-events-none relative z-0 mx-auto -mt-14 hidden max-w-[1200px] gutter lg:block">
      <div className="relative aspect-[60/11] w-full">
        <svg viewBox="0 0 1200 220" className="absolute inset-0 h-full w-full">
          {limbs.map((d) => (
            <g key={d}>
              <path d={d} fill="none" stroke="#6b4e28" strokeWidth="9" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#b0843f" strokeWidth="5" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#f0d48a" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ))}
        </svg>
        <Leaf className="absolute top-[58%] left-[24%] size-7 -rotate-[36deg] text-[#3c6b45]" />
        <Leaf className="absolute top-[74%] left-[15%] size-5 rotate-[12deg] text-[#4e7a48]" />
        <Leaf className="absolute top-[56%] right-[24%] size-7 rotate-[34deg] text-[#2f5a38]" />
        <Leaf className="absolute top-[76%] right-[16%] size-5 -rotate-[14deg] text-[#3c6b45]" />
      </div>
    </div>
  );
}

function ClosingMilestone({ item }: { item: Milestone }) {
  return (
    <li className="relative grid grid-cols-1 justify-items-center gap-5 pt-4 pb-2 md:grid-cols-[minmax(0,1fr)_10.5rem_minmax(0,1fr)] md:items-center md:justify-items-stretch md:gap-x-6 md:pt-2 md:pb-1 lg:items-end">
      <div className="relative flex w-full max-w-[14rem] items-center justify-center md:col-start-2 md:max-w-none">
        <div className="relative">
          <svg viewBox="0 0 80 120" className="pointer-events-none absolute bottom-full left-1/2 hidden h-48 w-16 -translate-x-1/2 md:block" aria-hidden>
            <path d="M40 120 C34 78 62 48 40 0" fill="none" stroke="#8d6430" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M40 120 C34 78 62 48 40 0" fill="none" stroke="#c4a15a" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <ClosingWreath />
          <YearNode year={item.year} image={item.image} large />
        </div>
      </div>
      <div className="w-full md:col-start-3 md:self-center lg:pb-20">
        <MilestoneCopy item={item} />
      </div>
    </li>
  );
}

function MilestoneMark({ mark, align }: { mark: Mark; align: 'left' | 'right' }) {
  const row = cn('mt-4 flex flex-wrap items-center gap-3', align === 'left' ? 'md:justify-end' : 'md:justify-start');
  if (mark === 'cils') {
    return (
      <p className={row}>
        <span className="grid size-11 place-items-center rounded-full bg-[#1a6b86] font-display text-[11px] tracking-wide text-ivory">CILS</span>
        <span className="text-left text-[12px] leading-tight text-charcoal/75">
          Colombo Institute
          <br />
          of Life Sciences
        </span>
      </p>
    );
  }
  if (mark === 'platinum') {
    return (
      <p className={row}>
        <span className="inline-flex flex-col rounded-md bg-night px-3 py-1.5 text-ivory">
          <span className="font-display text-[12px] tracking-[0.16em]">PLATINUM 60</span>
          <span className="text-[9px] tracking-[0.14em] text-pale-gold uppercase">by Village 60 Plus</span>
        </span>
      </p>
    );
  }
  if (mark === 'encourage') {
    return (
      <p className={cn(row, 'font-display text-[15px] tracking-[0.14em] text-[#1f6b45] uppercase')}>
        <Leaf className="size-5" />
        Encourage SL
      </p>
    );
  }
  return (
    <ul className={cn(row, 'list-none p-0')}>
      <li className="grid size-12 place-items-center rounded-full border border-charcoal/25 text-center text-[9px] leading-tight font-bold tracking-wide">
        ISO
        <br />
        9001
      </li>
      <li className="font-display text-[22px] text-[#1d4e86] italic">athe</li>
      <li className="text-[12px] font-semibold tracking-[0.16em] text-[#0e6b4f] uppercase">Qualifi</li>
    </ul>
  );
}

function MilestoneCopy({ item }: { item: Milestone }) {
  return (
    <div className={cn('mx-auto w-full max-w-[34rem] text-center md:max-w-[36ch]', item.side === 'left' ? 'md:ml-auto md:text-right' : 'md:mr-auto md:text-left')}>
      <h3 className="font-display text-[clamp(1.45rem,2vw,1.85rem)] leading-tight">{item.title}</h3>
      <p className="mt-3 text-[16px] leading-relaxed text-charcoal/80 md:text-[17px]">{item.body}</p>
      {item.more ? <p className="mt-3 text-[16px] leading-relaxed text-charcoal/80 md:text-[17px]">{item.more}</p> : null}
      {item.mark ? <MilestoneMark mark={item.mark} align={item.side} /> : null}
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SilverRootsPhone() {
  const rows = ['Home nursing', 'Companionship', 'Family updates', 'Appointments'];
  return (
    <div className="flex flex-1 items-end justify-center pb-2" aria-hidden>
      <div className="w-[14.5rem] rounded-[1.8rem] border border-ivory/40 bg-[#0c1c17] p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <div className="overflow-hidden rounded-[1.4rem] bg-ivory text-charcoal">
          <div className="bg-green px-3 py-3 text-ivory">
            <p className="font-display text-[10px] tracking-[0.18em] uppercase">Silver Roots</p>
            <p className="mt-1 font-display text-[15px] leading-none">Care, connected</p>
          </div>
          <ul className="space-y-2.5 px-3 py-3.5">
            {rows.map((row) => (
              <li key={row} className="flex items-center gap-2 text-[12px]">
                <span className="size-1.5 rounded-full bg-[#3f6b4f]" />
                {row}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OurStoryView() {
  return (
    <main id="main">
      <section aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <img src={VERANDAH.src} alt={VERANDAH.alt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="care-rise max-w-[40rem]">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase">Our story</p>
              <h1 id="page-title" className="mt-4 font-display text-[clamp(2.7rem,5.4vw,5rem)] leading-[0.96] font-medium tracking-[-0.02em] text-ivory">
                From Care Home <span className="block">to Care Ecosystem.</span>
              </h1>
              <p className="mt-6 max-w-[38rem] text-[17px] leading-relaxed text-ivory/92 md:text-[18px]">
                Village 60 Plus began with a simple purpose: to create a better way to care for older people. We have grown into home support, wellbeing, partnerships, technology and new ways to live independently.
              </p>
              <p className="mt-6 font-display text-[clamp(1.35rem,2vw,1.7rem)] leading-snug text-ivory italic">
                One purpose. Many branches.
                <span className="block">One journey since 2008.</span>
              </p>
            </div>
          </div>
        </div>
        <p className="absolute right-8 bottom-10 z-10 hidden size-32 place-items-center rounded-full border border-pale-gold/80 text-center lg:grid">
          <span className="font-display text-[15px] leading-tight text-ivory italic">
            Better
            <br />
            Lives
            <br />
            After 60
          </span>
        </p>
      </section>

      <section aria-labelledby="journey-title" className="relative overflow-hidden bg-ivory">
        <Leaf className="pointer-events-none absolute top-16 -left-6 hidden size-24 -rotate-12 text-[#3f6b4f]/25 lg:block" />
        <Leaf className="pointer-events-none absolute top-28 right-6 hidden size-16 rotate-[28deg] text-[#3f6b4f]/20 lg:block" />
        <div className="mx-auto max-w-[1520px] gutter pt-16 pb-8 lg:pt-24 lg:pb-10">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.2em] text-bronze uppercase">Our journey</p>
              <h2 id="journey-title" className="mt-3 font-display text-[clamp(2.5rem,4.6vw,4.35rem)] leading-[1.02] font-medium tracking-[-0.02em]">
                A Story of <span className="block">People, Purpose</span> <span className="block">and Possibilities.</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-charcoal/80 lg:pb-3 md:text-[18px]">
              Over the years, Village 60 Plus has grown into a diverse ecosystem of services and partnerships, each branch supporting a different stage of the ageing journey — at home, in our residences, and beyond.
            </p>
          </div>
        </div>

        <ol className="relative z-10 mx-auto max-w-[1100px] gutter list-none pb-2 md:pb-3 lg:pb-0">
          <div aria-hidden className="pointer-events-none absolute top-4 bottom-4 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#c4a15a] to-transparent md:hidden" />
          {MILESTONES.map((item, index) =>
            index === MILESTONES.length - 1 ? (
              <ClosingMilestone key={item.title} item={item} />
            ) : (
            <li
              key={item.title}
              className="grid grid-cols-1 justify-items-center gap-5 py-8 md:grid-cols-[minmax(0,1fr)_10.5rem_minmax(0,1fr)] md:items-stretch md:justify-items-stretch md:gap-x-8 md:py-0"
            >
              <div className="relative flex w-full max-w-[10.5rem] items-center justify-center md:col-start-2 md:row-start-1 md:h-full md:max-w-none md:min-h-52">
                <VineSegment flip={index % 2 === 1} />
                <VineLeaves flip={index % 2 === 1} />
                <YearNode year={item.year} image={item.image} />
              </div>
              <div className={cn('w-full md:self-center', item.side === 'left' ? 'md:col-start-1 md:row-start-1' : 'md:col-start-3 md:row-start-1')}>
                <MilestoneCopy item={item} />
              </div>
            </li>
            ),
          )}
        </ol>
        <StoryBranches />
      </section>

      <section aria-label="Where the story leads" className="relative z-10 overflow-hidden bg-night text-ivory on-dark lg:-mt-3">
        <img src={GARDEN.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-[#0d221b]/84" />
        <div className="relative mx-auto max-w-[1200px] gutter pt-5 pb-16 lg:pt-0 lg:pb-24">
          <ul className="grid list-none gap-6 p-0 lg:grid-cols-3">
            <li>
              <article className="flex h-full flex-col overflow-hidden rounded-panel border border-ivory/15 bg-[#132e26]">
                <div className="flex min-h-80 flex-col bg-[#0e241c] px-6 pt-7">
                  <p className="text-center font-display text-[13px] tracking-[0.22em] text-pale-gold uppercase">Silver Roots</p>
                  <p className="text-center text-[10px] tracking-[0.18em] text-ivory/70 uppercase">by Village 60 Plus</p>
                  <SilverRootsPhone />
                </div>
                <div className="flex flex-1 flex-col gap-4 px-6 py-7">
                  <h2 className="font-display text-[clamp(1.7rem,2vw,2.1rem)] leading-tight">Care, connected.</h2>
                  <p className="mt-3 text-[16px] leading-relaxed text-ivory/85">
                    A digital ecosystem bringing families, older people, providers, services and partners together on one platform.
                  </p>
                  <p className="mt-3 text-[16px] leading-relaxed text-ivory/85">At home. In our residences. Wherever life happens.</p>
                  <Link href="/silver-roots" className={cardLink} aria-label="Learn more about Silver Roots">
                    Learn More
                  </Link>
                </div>
              </article>
            </li>
            <li>
              <article className="flex h-full flex-col overflow-hidden rounded-panel border border-ivory/15 bg-[#132e26]">
                <div className="relative min-h-80">
                  <img src={ORACLE.src} alt={ORACLE.alt} className="absolute inset-0 h-full w-full object-cover object-[28%_center]" />
                  <div className="absolute inset-0 bg-[#10241c]/35" />
                  <div className="absolute inset-0 grid place-items-center px-6 text-center text-pale-gold">
                    <div>
                      <Lotus className="mx-auto size-8" />
                      <p className="font-display text-[28px] tracking-[0.28em]">ORACLE</p>
                      <p className="mt-1 text-[11px] tracking-[0.22em]">60 PLUS</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 px-6 py-7">
                  <h2 className="font-display text-[clamp(1.7rem,2vw,2.1rem)] leading-tight">An enlightened retirement residence.</h2>
                  <p className="mt-3 text-[16px] leading-relaxed text-ivory/85">
                    Our flagship residence, with private rooms and a considered way of living. We warmly welcome you to visit.
                  </p>
                  <Link href="/oracle" className={cardLink}>
                    View Oracle
                    <Arrow />
                  </Link>
                </div>
              </article>
            </li>
            <li>
              <article className="flex h-full flex-col overflow-hidden rounded-panel border border-ivory/15 bg-[#132e26]">
                <div className="relative min-h-80">
                  <img src={GARDEN.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[#10241c]/40" />
                  <div className="absolute inset-0 grid place-items-center px-6 text-center text-pale-gold">
                    <div>
                      <Lotus className="mx-auto size-8" />
                      <p className="font-display text-[26px] tracking-[0.2em] text-ivory">THE GROVE</p>
                      <p className="mt-1 text-[10px] tracking-[0.18em]">BY VILLAGE 60 PLUS</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 px-6 py-7">
                  <h2 className="font-display text-[clamp(1.7rem,2vw,2.1rem)] leading-tight">Our next chapter.</h2>
                  <p className="mt-3 text-[16px] leading-relaxed text-ivory/85">
                    A purpose-built residence in Kottawa, with private homes, landscaped spaces and the same personal approach to care.
                  </p>
                  <Link href="/homes/the-grove" className={cardLink} aria-label="The Grove, coming soon">
                    Coming Soon
                  </Link>
                </div>
              </article>
            </li>
          </ul>

          <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.15fr)_minmax(0,0.72fr)] lg:gap-12">
            <figure className="hidden overflow-hidden border-4 border-ivory/90 shadow-panel lg:block lg:-rotate-3">
              <img src={UPPER_HOUSE.src} alt={UPPER_HOUSE.alt} className="aspect-[4/3] w-full object-cover" />
            </figure>
            <div className="text-center">
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05] font-medium">
                Nearly Two Decades. <span className="block">One Purpose.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[48ch] text-[16px] leading-relaxed text-ivory/85 md:text-[17px]">
                Buildings changed. Services grew. Technology arrived. The principle behind Village 60 Plus stayed the same: help people live with dignity, independence, companionship and choice.
              </p>
              <ul className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
                <li>
                  <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none">2008</p>
                  <p className="mt-2 text-[11px] tracking-[0.12em] text-ivory/75 uppercase">Our journey began</p>
                </li>
                <li>
                  <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none">2026</p>
                  <p className="mt-2 text-[11px] tracking-[0.12em] text-ivory/75 uppercase">The next generation</p>
                </li>
                <li className="flex items-center justify-center">
                  <p className="font-display text-[clamp(1.45rem,2.2vw,1.85rem)] leading-tight text-pale-gold italic">Still growing</p>
                </li>
              </ul>
              <p className="mt-8 font-display text-[clamp(1.6rem,2.4vw,2.1rem)] text-ivory italic">This is only the beginning.</p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/homes" className={filled}>
                  Explore Our Homes
                  <Arrow />
                </Link>
                <Link href="/living-and-care" className={outline}>
                  Discover Living &amp; Care
                  <Arrow />
                </Link>
              </div>
            </div>
            <figure className="hidden overflow-hidden border-4 border-ivory/90 shadow-panel lg:block lg:rotate-2">
              <img src={LIVING_ROOM.src} alt={LIVING_ROOM.alt} className="aspect-[4/3] w-full object-cover" />
            </figure>
          </div>
        </div>
      </section>
    </main>
  );
}
