import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from './client';

const builder = createImageUrlBuilder(client);

/** Always request modern formats; callers add width/height/fit. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format');
}
