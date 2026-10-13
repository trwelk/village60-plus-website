import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

type Voice = {
  eyebrow: string;
  title: string;
  body: string;
  /** Index of the step the visitor has already begun, or -1. */
  mark: number;
};

const STEPS = [
  {
    title: 'Say who it is for',
    body: 'Yourself, a parent, a relative, or someone else. One of those is enough to begin.',
  },
  {
    title: 'Name the shape of the help',
    body: 'Independent living, residential care, respite, recovery, rehabilitation, or not sure yet.',
  },
  {
    title: 'A person calls you back',
    body: 'They talk through the homes and what a visit involves. You decide what happens next.',
  },
] as const;

function voiceFor(defaults: Record<string, string>): Voice {
  if (defaults.helpType === 'recovery') {
    return {
      eyebrow: 'After hospital or surgery',
      title: 'Leaving hospital is enough to say.',
      body: 'Respite, recovery and rehabilitation can be explained in plain language. You do not have to sort them out first.',
      mark: 1,
    };
  }
  if (defaults.whoFor === 'myself') {
    return {
      eyebrow: 'For yourself',
      title: 'Start with the day you want.',
      body: 'The name of the care can wait. Describe the kind of day you are hoping for, and a person will talk it through with you.',
      mark: 0,
    };
  }
  if (defaults.whoFor === 'parent') {
    return {
      eyebrow: 'For a parent or relative',
      title: 'You do not need the care category.',
      body: 'Tell us who you are asking about. A person will explain the options in ordinary words.',
      mark: 0,
    };
  }
  return {
    eyebrow: 'How this begins',
    title: 'You do not have to arrive knowing the name.',
    body: 'Tell us a little. A person calls you back and talks through what might suit.',
    mark: -1,
  };
}

function Sprig() {
  return (
    <svg viewBox="0 0 160 230" width="176" height="250" fill="currentColor" aria-hidden="true">
      <path d="M82 222c1-52 2-104-4-168" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M78 176c-34-6-58-32-60-62 26 2 46 20 60 62z" opacity="0.9" />
      <path d="M80 138c32-16 58-24 74-16-10 28-36 46-74 16z" opacity="0.72" />
      <path d="M76 96c-26-8-46-28-48-52 22 6 38 22 48 52z" opacity="0.95" />
      <path d="M78 62c22-20 42-26 56-16-8 22-28 36-56 16z" opacity="0.6" />
      <circle cx="74" cy="28" r="4" />
    </svg>
  );
}

export function CareConversation({ defaults, children }: { defaults: Record<string, string>; children: ReactNode }) {
  const voice = voiceFor(defaults);

  return (
    <Section tone="sand" labelledBy="care-path-title" className="band-from-hero relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-[380px] rounded-full bg-pale-gold/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-10 text-leaf opacity-30">
        <Sprig />
      </div>

      <div className="relative grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,28rem)] lg:gap-16">
        <div>
          <p className="mb-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-bronze">{voice.eyebrow}</p>
          <h2 id="care-path-title" className="max-w-[16ch] font-display text-[clamp(34px,4vw,52px)] leading-[1.05] font-medium">
            {voice.title}
          </h2>
          <p className="mt-5 max-w-prose-site">{voice.body}</p>

          <ol className="mt-10 flex list-none flex-col p-0">
            {STEPS.map((step, index) => {
              const marked = index === voice.mark;
              const last = index === STEPS.length - 1;
              return (
                <li
                  key={step.title}
                  className="care-rise grid grid-cols-[4.25rem_minmax(0,1fr)] gap-4"
                  style={{ animationDelay: `${index * 110}ms` }}
                >
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'grid size-14 shrink-0 place-items-center rounded-full border font-display text-[18px] leading-none',
                        marked ? 'border-green bg-green text-ivory' : 'border-gold bg-paper text-green',
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {last ? null : <span aria-hidden="true" className="my-2 w-px flex-1 bg-gold/80" />}
                  </div>
                  <div className={cn('pt-3.5', last ? 'pb-0' : 'pb-8')}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-[22px]">{step.title}</h3>
                      {marked ? <Chip>You started here</Chip> : null}
                    </div>
                    <p className="mt-1 max-w-prose-site">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-8">
            <Button href="#care-enquiry" variant="text">
              Begin with a few questions
            </Button>
          </div>
        </div>

        {children}
      </div>
    </Section>
  );
}
