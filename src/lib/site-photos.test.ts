import { describe, expect, it } from 'vitest';
import type { CmsImage } from '@/components/media/SanityImage';
import { withResidencePhotos } from './site-photos';

const noPhoto = (): CmsImage | null => null;
const room = (name: string): { name: string; image: CmsImage | null } => ({ name, image: noPhoto() });

describe('withResidencePhotos', () => {
  it('keeps the courtyard walk and lounge portraits off Oracle', () => {
    const gallery: Array<CmsImage | null> = [];
    const residence = withResidencePhotos({
      slug: 'oracle',
      heroImage: noPhoto(),
      gallery,
      rooms: ['Jade', 'Onyx', 'Ruby', 'Ivory', 'Amber', 'Sapphire', 'Opal', 'Emerald'].map(room),
    });
    const urls = [
      residence.heroImage?.asset?.url,
      ...(residence.gallery ?? []).map((image) => image?.asset?.url),
      ...(residence.rooms ?? []).map((entry) => entry?.image?.asset?.url),
    ];
    expect(urls).not.toContain('/people/courtyard.jpg');
    expect(urls).not.toContain('/people/lounge.jpg');
    expect(residence.rooms?.find((entry) => entry?.name === 'Amber')?.image?.asset?.url).toBe('/homes/bedroom.jpg');
    expect(residence.rooms?.find((entry) => entry?.name === 'Sapphire')?.image?.asset?.url).toBe('/home/living-room.jpg');
  });
});
