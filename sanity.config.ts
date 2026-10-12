'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schema';
import { SINGLETON_TYPES, structure } from './src/sanity/structure';

export const apiVersion = '2026-02-01';

export default defineConfig({
  name: 'village60plus',
  title: 'Village 60 Plus',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
  document: {
    // Singletons: hide from the global "create new" menu and remove destructive actions.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((t) => !SINGLETON_TYPES.includes(t.templateId)) : prev,
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? prev.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : prev,
  },
});
