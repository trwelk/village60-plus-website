import { PreviewCard, type PreviewCardSurface } from '@/components/content/PreviewCard';
import type { CmsImage } from '@/components/media/SanityImage';
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

export function CareServiceCard({ service, surface = 'paper' }: { service: CareServiceCardData; surface?: PreviewCardSurface }) {
  if (!service.name || !service.slug) return null;
  return (
    <PreviewCard
      href={careServicePath(service.slug)}
      title={service.name}
      eyebrow={service.typicalDuration || 'Care'}
      description={service.summary}
      image={service.heroImage}
      overlay={service.summary}
      surface={surface}
    >
      {isContentStatus(service.status) ? <StatusBadge status={service.status} /> : null}
    </PreviewCard>
  );
}
