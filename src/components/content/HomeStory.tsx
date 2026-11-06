import { SplitAction, SplitFeature } from '@/components/content/SplitFeature';

export function HomeStory() {
  return (
    <SplitFeature
      id="home-story"
      headingId="home-story-title"
      eyebrow="Why it matters"
      imageSide="left"
      title={
        <>
          A More Meaningful Tomorrow.
        </>
      }
      image={{
        src: '/home/living-room.jpg',
        alt: 'A living room opening onto a tropical garden',
      }}
      action={<SplitAction href="/our-story">Read our story</SplitAction>}
    >
      <p>
        For nearly two decades, Village 60 Plus has been creating places where people can feel safe, supported and, most importantly, at home.
      </p>
      <p>
        But getting older is changing.
        <br />
        And so are we.
      </p>
      <p>
        Today, Village 60 Plus is more than residential care.
        <br />
        We are building a connected way of living that brings together independent living, personalised care, beautiful homes, recovery support, lifestyle services and intelligent technology.
      </p>
      <p>All built around one person.</p>
      <p className="font-display text-[clamp(2.6rem,4vw,3.4rem)] leading-none font-medium text-gold italic">You.</p>
    </SplitFeature>
  );
}
