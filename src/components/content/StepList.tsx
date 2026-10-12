export type StepItem = { _key: string; title?: string | null; description?: string | null };

export function StepList({ items }: { items: Array<StepItem | null> | null | undefined }) {
  const rows = (items ?? []).filter((item): item is StepItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  return (
    <ol className="flex list-decimal flex-col gap-6 pl-6">
      {rows.map((item) => (
        <li key={item._key} className="max-w-prose-site">
          <h3 className="inline">{item.title}</h3>
          {item.description && <p className="mt-1">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
