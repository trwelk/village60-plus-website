import { VideoHero, type HeroVideo } from '@/components/media/VideoHero';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { telHref, type SiteContact } from '@/lib/contact';

export function HomeHero({
  title,
  intro,
  image,
  video,
  contact,
}: {
  title: string;
  intro?: string | null;
  image?: CmsImage | null;
  video?: HeroVideo | null;
  contact: SiteContact;
}) {
  return (
    <section aria-labelledby="page-title" className="relative flex min-h-[100svh] items-end overflow-hidden bg-night text-ivory on-dark">
      <div className="absolute inset-0">
        {video ? (
          <VideoHero video={video} fill />
        ) : (
          <SanityImage image={image} width={1920} height={1080} priority cover sizes="100vw" />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/80 via-night/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-night/30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-night/80 to-transparent" />
      <div className="relative z-10 w-full pt-28 pb-64 md:pb-28">
        <div className="mx-auto w-full max-w-[1520px] gutter">
          <h1 id="page-title" className="display-text max-w-[12ch] text-ivory">
            {title}
          </h1>
          {intro ? <p className="mt-5 max-w-[36rem] text-[18px] leading-relaxed text-ivory">{intro}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/find-the-right-care" onDark size="lg">
              Find the Right Care
            </Button>
            {contact.phone ? (
              <Button href={telHref(contact.phone)} variant="secondary" onDark size="lg" data-track="call_click">
                Call
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
