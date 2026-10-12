import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';
import { careServicePath } from '@/lib/routes';

export type CareServiceCardData = {
  _id: string;
  name: string | null;
  slug: string | null;
  status?: string | null;
  summary?: string | null;
  typicalDuration?: string | null;
  heroImage?: CmsImage | null;
};

export function CareServiceCard({ service }: { service: CareServiceCardData }) {
  if (!service.name || !service.slug) return null;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
      <SanityImage image={service.heroImage} width={640} height={400} sizes="(min-width: 1200px) 400px, 100vw" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        {isContentStatus(service.status) && <StatusBadge status={service.status} />}
        <h3>{service.name}</h3>
        {service.typicalDuration && <p className="text-bronze">{service.typicalDuration}</p>}
        {service.summary && <p className="max-w-prose-site">{service.summary}</p>}
        <div className="mt-auto pt-2">
          <Button href={careServicePath(service.slug)} variant="text">
            Read about {service.name}
          </Button>
        </div>
      </div>
    </article>
  );
}
