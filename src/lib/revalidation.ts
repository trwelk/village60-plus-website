export function docTag(type: string, slug?: string | null): string {
  return slug ? `${type}:${slug}` : type;
}

export type WebhookBody = { _type?: string; slug?: { current?: string | null } | null };

/** Types whose content is embedded (via references) in other documents' queries. */
const EMBEDDED_IN: Record<string, string[]> = {
  faq: ['residence', 'careService', 'ecosystemOffering', 'page'],
  teamMember: ['residence', 'page'],
  testimonial: ['residence'],
  careService: ['residence'],
  residence: ['careService'],
};

export function tagsForWebhook(body: WebhookBody): string[] {
  const type = body._type;
  if (!type) return [];
  const tags = new Set<string>([type]);
  const slug = body.slug?.current;
  if (slug) tags.add(docTag(type, slug));
  for (const dependant of EMBEDDED_IN[type] ?? []) tags.add(dependant);
  if (type === 'residence' || type === 'careService' || type === 'ecosystemOffering' || type === 'page') tags.add('sitemap');
  return [...tags];
}
