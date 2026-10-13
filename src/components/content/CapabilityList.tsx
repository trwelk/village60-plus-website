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
    <ul className="border-b border-stone">
      {rows.map((item) => {
        const provision = provisionLabel(item.provision);
        return (
          <li key={item._key} className="grid gap-3 border-t border-stone py-6 md:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] md:items-center md:gap-x-12">
            <div className="flex flex-col gap-3">
              <h3 className="text-[22px] leading-tight md:text-[26px]">{item.title}</h3>
              {(isContentStatus(item.status) || provision) && (
                <div className="flex flex-wrap items-center gap-2">
                  {isContentStatus(item.status) && <StatusBadge status={item.status} />}
                  {provision && <Chip>{provision}</Chip>}
                </div>
              )}
            </div>
            {item.description ? <p className="max-w-prose-site md:pt-1">{item.description}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}
