import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';
import { residencePath } from '@/lib/routes';

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

export function ResidenceCard({ residence }: { residence: ResidenceCardData }) {
  if (!residence.name || !residence.slug) return null;
  const cares = (residence.careTypes ?? []).filter((care): care is { _id: string; name: string } => Boolean(care?.name));
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
      <SanityImage image={residence.heroImage} width={640} height={400} sizes="(min-width: 1200px) 400px, 100vw" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        {isContentStatus(residence.status) && <StatusBadge status={residence.status} />}
        <h3>{residence.name}</h3>
        {residence.shortLocation && <p>{residence.shortLocation}</p>}
        {residence.summary && <p className="max-w-prose-site">{residence.summary}</p>}
        {cares.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {cares.map((care) => (
              <li key={care._id}>
                <Chip>{care.name}</Chip>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-2">
          <Button href={residencePath(residence.slug)} variant="text">
            View {residence.name}
          </Button>
        </div>
      </div>
    </article>
  );
}
