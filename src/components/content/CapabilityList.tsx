import { Chip } from '@/components/ui/Chip';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';

const PROVISION_LABEL = {
  included: 'Included',
  'optional-extra': 'Quoted separately',
  'partner-arranged': 'Arranged through a partner',
} as const;

export type CapabilityItem = {
  _key: string;
  title?: string | null;
  description?: string | null;
  provision?: string | null;
  status?: string | null;
};

export function provisionLabel(value: string | null | undefined): string | null {
  if (!value || !(value in PROVISION_LABEL)) return null;
  return PROVISION_LABEL[value as keyof typeof PROVISION_LABEL];
}

export function CapabilityList({ items }: { items: Array<CapabilityItem | null> | null | undefined }) {
  const rows = (items ?? []).filter((item): item is CapabilityItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  return (
    <ul className="flex flex-col gap-6">
      {rows.map((item) => {
        const provision = provisionLabel(item.provision);
        return (
          <li key={item._key} className="border-t border-stone pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3>{item.title}</h3>
              {isContentStatus(item.status) && <StatusBadge status={item.status} />}
              {provision && <Chip>{provision}</Chip>}
            </div>
            {item.description && <p className="mt-2 max-w-prose-site">{item.description}</p>}
          </li>
        );
      })}
    </ul>
  );
}
