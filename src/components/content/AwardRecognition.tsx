const PILLARS = [
  { label: 'Quality care', icon: 'heart' },
  { label: 'People first', icon: 'people' },
  { label: 'A stronger community', icon: 'leaf', lines: ['A stronger', 'community'] },
] as const;

export function AwardRecognition() {
  return (
    <section aria-labelledby="home-recognition" className="relative overflow-hidden bg-ivory text-charcoal">
      <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="relative order-2 overflow-hidden bg-sand md:order-1">
          {/* Holds the row at the photo's own shape, so a taller text column crops the sides and not the trophy. */}
          <div className="aspect-[1024/731]" aria-hidden />
          <picture className="absolute inset-0">
            <source srcSet="/home/excellence-award.webp" type="image/webp" />
            <img
              src="/home/excellence-award.jpg"
              alt="The Global Business Excellence Awards 2026 trophy for Excellence in Elder Care, presented to Village 60 Plus."
              width={1024}
              height={731}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 900px) 58vw, 100vw"
              className="h-full w-full object-cover object-[96%_center]"
            />
          </picture>
        </div>
        <div className="relative order-1 flex items-center px-6 py-12 sm:px-8 md:order-2 md:px-8 md:py-8 lg:px-12 lg:py-10 xl:px-14">
          <Botanical />
          <div className="relative mx-auto w-full max-w-[28rem]">
            <Lockup />
            <p className="mt-8 font-sans text-[12px] font-medium tracking-[0.26em] text-bronze uppercase">
              Global recognition
            </p>
            <h2
              id="home-recognition"
              className="mt-3 font-display text-[clamp(2.15rem,3.6vw,3.15rem)] leading-[1.08] font-medium tracking-[-0.02em] text-green"
            >
              Excellence <span className="block">in Elder Care</span>
            </h2>
            <p className="mt-4 text-[17px] leading-[1.6] md:text-[18px]">
              We are honoured to have received the Global Business Excellence Awards 2026 for Excellence in Elder Care,
              recognising our commitment to providing exceptional care, dignity and quality of life for our residents.
            </p>
            <ul className="mt-8 flex items-start">
              {PILLARS.map((pillar, index) => (
                <li
                  key={pillar.label}
                  className={index > 0 ? 'min-w-0 flex-1 border-l border-stone' : 'min-w-0 flex-1'}
                >
                  <div className="flex flex-col items-center gap-2.5 px-2 text-center">
                    <PillarIcon name={pillar.icon} />
                    <span className="font-sans text-[11px] leading-snug font-medium tracking-[0.14em] text-bronze uppercase sm:text-[12px] sm:tracking-[0.16em]">
                      {'lines' in pillar ? (
                        <>
                          {pillar.lines[0]}
                          <br />
                          {pillar.lines[1]}
                        </>
                      ) : (
                        pillar.label
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lockup() {
  return (
    <div className="flex flex-col items-center text-center text-green">
      <svg viewBox="0 0 32 40" className="h-8 w-7" aria-hidden>
        <g fill="currentColor">
          <circle cx="16" cy="10.5" r="5.4" />
          <circle cx="10.2" cy="18.4" r="5.4" />
          <circle cx="21.8" cy="18.4" r="5.4" />
        </g>
        <path d="M16 22.2v12.2" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
      <p className="mt-3 font-sans text-[12px] font-medium tracking-[0.48em] uppercase pl-[0.48em]">Village</p>
      <p className="mt-1 font-sans text-[1.15rem] font-medium tracking-[0.3em] uppercase pl-[0.3em]">60 Plus</p>
      <p className="mt-3 font-sans text-[11px] font-medium tracking-[0.18em] text-charcoal uppercase">
        People <span className="px-1.5 text-bronze">|</span> Care <span className="px-1.5 text-bronze">|</span> Community
      </p>
    </div>
  );
}

function PillarIcon({ name }: { name: (typeof PILLARS)[number]['icon'] }) {
  const common = {
    viewBox: '0 0 48 48',
    className: 'size-8 text-green',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };
  if (name === 'heart') {
    return (
      <svg {...common}>
        <path d="M24 39.5c-7.4-4.8-12.2-9.6-12.2-15.4 0-4.3 3.1-7.6 7.4-7.6 2.5 0 4.1 1.2 4.8 2.9.7-1.7 2.3-2.9 4.8-2.9 4.3 0 7.4 3.3 7.4 7.6 0 5.8-4.8 10.6-12.2 15.4Z" />
      </svg>
    );
  }
  if (name === 'people') {
    return (
      <svg {...common}>
        <circle cx="24" cy="13.5" r="3.4" />
        <circle cx="12.5" cy="16.5" r="2.6" />
        <circle cx="35.5" cy="16.5" r="2.6" />
        <path d="M16.2 36.5c.6-5.4 3.2-8.4 7.8-8.4s7.2 3 7.8 8.4" />
        <path d="M6.8 36.5c.4-4 2.1-6.3 5.2-6.6" />
        <path d="M41.2 36.5c-.4-4-2.1-6.3-5.2-6.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M24 40V21" />
      <path d="M24 28.5c-6.2-1.4-10.4-6.2-11.2-11.6 6.4 1.1 10.2 5.2 11.2 11.6Z" />
      <path d="M24 21.5c5.2-6.4 12.6-8.6 17-7.4-2.2 6.6-8.4 10.6-17 11.6" />
    </svg>
  );
}

function Botanical() {
  return (
    <svg
      viewBox="0 0 200 900"
      className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-24 text-[#b7ae9c] xl:block"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M168 -8c-6 78-16 128-6 198 12 82-20 140-4 224 16 86-22 156-2 236 16 68-10 140 4 250" />
      <path d="M164 72c-26-8-52 2-64 18 20-2 44 0 64-6" />
      <path d="M166 108c22-14 48-8 58 10-18 2-40 6-58 8" />
      <path d="M160 196c-30-14-62-2-74 18 24-2 50 4 74 8" />
      <path d="M166 258c28-16 56-6 66 16-22 2-46 6-66 10" />
      <path d="M156 388c-34-18-72-2-86 22 28-2 58 6 86 12" />
      <path d="M164 462c30-18 60-4 70 18-24 2-48 8-70 12" />
      <path d="M154 588c-32-16-66 0-78 22 26-2 54 6 78 12" />
      <path d="M162 672c28-16 54-4 64 16-20 2-44 8-64 12" />
      <path d="M156 792c-28-14-56 0-66 20 22-2 46 4 66 10" />
    </svg>
  );
}
