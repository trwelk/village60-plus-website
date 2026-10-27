import { describe, expect, it } from 'vitest';
import type { CmsImage } from '@/components/media/SanityImage';
import { photoForResidence, withResidencePhotos } from './site-photos';

const noPhoto = (): CmsImage | null => null;
const room = (name: string): { name: string; image: CmsImage | null } => ({ name, image: noPhoto() });

describe('photoForResidence', () => {
  it('uses the Grove aerial wherever a residence card shows The Grove', () => {
    expect(photoForResidence('the-grove')?.asset?.url).toBe('/look-to-the-future/grove-aerial.jpg');
  });
});

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

  it('leaves the lounge and hands portraits out of Serenity', () => {
    const residence = withResidencePhotos({ slug: 'serenity', heroImage: noPhoto(), gallery: [], rooms: [room('Garden')] });
    const urls = [
      residence.heroImage?.asset?.url,
      ...(residence.gallery ?? []).map((image) => image?.asset?.url),
      ...(residence.rooms ?? []).map((entry) => entry?.image?.asset?.url),
    ];
    expect(urls).not.toContain('/people/lounge.jpg');
    expect(urls).not.toContain('/people/hands.jpg');
  });
});
