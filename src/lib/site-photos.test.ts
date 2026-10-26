import { describe, expect, it } from 'vitest';
import { withResidencePhotos } from './site-photos';

const room = (name: string) => ({ name, image: null });

describe('withResidencePhotos', () => {
  it('keeps the courtyard walk and lounge portraits off Oracle', () => {
    const residence = withResidencePhotos({
      slug: 'oracle',
      heroImage: null,
      gallery: [],
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
