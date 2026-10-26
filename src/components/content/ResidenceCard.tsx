import { PreviewCard, type PreviewCardSurface } from '@/components/content/PreviewCard';
import { Chip } from '@/components/ui/Chip';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';
import { residencePath } from '@/lib/routes';
import type { CmsImage } from '@/components/media/SanityImage';

export type ResidenceCardData = {
  _id: string;
  name: string | null;
  slug: string | null;
  status?: string | null;
  shortLocation?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  careTypes?: Array<{ _id: string; name?: string | null; slug?: string | null; status?: string | null } | null> | null;
};

export function ResidenceCard({ residence, surface = 'paper' }: { residence: ResidenceCardData; surface?: PreviewCardSurface }) {
  if (!residence.name || !residence.slug) return null;
  const cares = (residence.careTypes ?? []).filter((care): care is { _id: string; name: string } => Boolean(care?.name));
  return (
    <PreviewCard
      href={residencePath(residence.slug)}
      title={residence.name}
      eyebrow={residence.shortLocation || 'Residence'}
      description={residence.summary}
      image={residence.heroImage}
      imageClassName={residence.slug === 'the-grove' ? 'object-[70%_center]' : undefined}
      overlay={residence.summary}
      surface={surface}
    >
      {isContentStatus(residence.status) ? <StatusBadge status={residence.status} /> : null}
      {cares.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {cares.map((care) => (
            <li key={care._id}>
              <Chip>{care.name}</Chip>
            </li>
          ))}
        </ul>
      ) : null}
    </PreviewCard>
  );
}
