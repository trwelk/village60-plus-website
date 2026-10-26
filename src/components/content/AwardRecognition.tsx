const PILLARS = [
  { label: 'Quality care', icon: 'heart' },
  { label: 'People first', icon: 'people' },
  { label: 'A stronger community', icon: 'leaf' },
] as const;

export function AwardRecognition() {
  return (
    <section aria-labelledby="home-recognition" className="relative overflow-hidden bg-ivory text-charcoal">
      <div className="flex flex-col md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:min-h-[760px]">
        <div className="relative order-2 flex justify-center px-6 pb-16 md:order-1 md:block md:h-full md:p-0">
          <picture>
            <source srcSet="/home/excellence-award.webp" type="image/webp" />
            <img
              src="/home/excellence-award.jpg"
              alt="The Global Business Excellence Awards 2026 trophy for Excellence in Elder Care, presented to Village 60 Plus."
              width={1024}
              height={731}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 768px) 50vw, 18rem"
              className="aspect-[5/6] w-full max-w-[18rem] border border-stone object-cover object-center shadow-panel md:absolute md:inset-0 md:aspect-auto md:h-full md:max-w-none md:border-0 md:object-[center_32%] md:shadow-none"
            />
          </picture>
        </div>
        <div className="relative z-10 order-1 flex items-center px-6 pt-16 pb-10 sm:px-8 md:order-2 md:px-10 md:py-14 xl:px-14">
          <Flourish />
          <div className="relative mx-auto w-full max-w-[32rem]">
            <Lockup />
            <p className="mt-5 text-[11px] font-semibold tracking-[0.28em] text-bronze uppercase">Global recognition</p>
            <p id="home-recognition" className="mt-2 font-display text-[clamp(1.85rem,2.6vw,2.75rem)] leading-[1.02] font-medium tracking-[-0.02em] text-green">
              Excellence <span className="block">in Elder Care</span>
            </p>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed md:text-[16px]">
              We are honoured to have received the Global Business Excellence Awards 2026 for Excellence in Elder Care, recognising our commitment to providing exceptional care, dignity and quality of life for our residents.
            </p>
            <ul className="mt-6 grid grid-cols-3">
              {PILLARS.map((pillar, index) => (
                <li key={pillar.label} className={index > 0 ? 'border-l border-stone' : undefined}>
                  <div className="flex flex-col items-center gap-2 px-2 text-center">
                    <PillarIcon name={pillar.icon} />
                    <span className="max-w-[7.5rem] text-[10px] leading-tight font-medium tracking-[0.12em] text-bronze uppercase">
                      {pillar.label}
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
      <svg viewBox="0 0 48 48" className="size-7" aria-hidden>
        <path d="M24 44.5v-12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="24" cy="16" rx="6.2" ry="9" fill="currentColor" />
        <ellipse cx="15.2" cy="22.5" rx="6" ry="8" transform="rotate(-32 15.2 22.5)" fill="currentColor" />
        <ellipse cx="32.8" cy="22.5" rx="6" ry="8" transform="rotate(32 32.8 22.5)" fill="currentColor" />
      </svg>
      <p className="mt-2 font-display text-[11px] tracking-[0.42em] uppercase">Village</p>
      <p className="mt-0.5 font-display text-[16px] tracking-[0.26em] uppercase">60 Plus</p>
      <p className="mt-2 text-[9px] tracking-[0.2em] text-charcoal uppercase">
        People <span className="px-1.5 text-bronze">|</span> Care <span className="px-1.5 text-bronze">|</span> Community
      </p>
    </div>
  );
}

function PillarIcon({ name }: { name: (typeof PILLARS)[number]['icon'] }) {
  const common = {
    viewBox: '0 0 48 48',
    className: 'size-7 text-green',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.3,
    'aria-hidden': true as const,
  };
  if (name === 'heart') {
    return (
      <svg {...common}>
        <path d="M24 40s-13-8.4-13-16.6C11 17.6 14.6 14 19.2 14c2.7 0 4.3 1.3 4.8 2.8.5-1.5 2.1-2.8 4.8-2.8 4.6 0 8.2 3.6 8.2 9.4C37 31.6 24 40 24 40Z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === 'people') {
    return (
      <svg {...common}>
        <circle cx="24" cy="13" r="4" />
        <circle cx="12.5" cy="16.5" r="3" />
        <circle cx="35.5" cy="16.5" r="3" />
        <path d="M15.5 36.5c.7-6.2 3.6-9.5 8.5-9.5s7.8 3.3 8.5 9.5" strokeLinecap="round" />
        <path d="M6 36.5c.5-4.6 2.4-7.2 5.6-7.2" strokeLinecap="round" />
        <path d="M42 36.5c-.5-4.6-2.4-7.2-5.6-7.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M24 40c0-16 9-24 20-26-3 16-11 24-20 26Z" strokeLinejoin="round" />
      <path d="M24 40V16" strokeLinecap="round" />
      <path d="M24 28c-4-1-7-4-8-8" strokeLinecap="round" />
    </svg>
  );
}

function Flourish() {
  return (
    <svg
      viewBox="0 0 180 460"
      className="pointer-events-none absolute top-4 -right-1 hidden h-[88%] w-auto text-green/15 xl:block"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      aria-hidden
    >
      <path d="M168 8c-8 48-22 78-28 124-8 58 6 96 2 150-4 48-22 86-18 140" strokeLinecap="round" />
      <path d="M146 78c-16 2-26-6-30-18 8 8 20 10 30 18Z" strokeLinejoin="round" />
      <path d="M138 150c-20 4-32-4-38-18 12 8 26 10 38 18Z" strokeLinejoin="round" />
      <path d="M150 168c14-2 24-12 28-24-6 12-16 20-28 24Z" strokeLinejoin="round" />
      <path d="M142 248c-22 2-34-8-40-22 12 10 28 14 40 22Z" strokeLinejoin="round" />
      <path d="M148 292c16 0 28-10 34-22-8 12-20 20-34 22Z" strokeLinejoin="round" />
      <path d="M140 360c-18 6-30-2-36-16 10 10 24 12 36 16Z" strokeLinejoin="round" />
    </svg>
  );
}
