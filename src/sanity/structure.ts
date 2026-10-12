// replaced with the full desk structure in Task 8
import type { StructureResolver } from 'sanity/structure';

export const SINGLETON_TYPES: string[] = ['siteSettings'];

export const structure: StructureResolver = (S) => S.list().title('Content').items(S.documentTypeListItems());
