/**
 * Photographs supplied by Village 60 Plus on 14 October 2026.
 * Files live in scripts/client-photos and are uploaded by scripts/seed.ts.
 * Two other files from the same batch are not included: a Shutterstock
 * download, and a greenhouse portrait that is not this residence.
 */
export type ClientPhoto = {
  file: string;
  alt: string;
  caption: string;
  /** Identifiable people, so a consent record is stored with the image. */
  people: boolean;
};

export const CLIENT_PHOTOS = {
  'verandah-bougainvillea': {
    file: 'verandah-bougainvillea.jpg',
    alt: 'A single-storey residence with a clay-tile roof and a verandah shaded by pink and purple bougainvillea',
    caption: 'Verandah',
    people: true,
  },
  'upper-house-garden': {
    file: 'upper-house-garden.jpg',
    alt: 'A two-storey white residence with a clay-tile roof, beside a verandah covered in purple bougainvillea',
    caption: 'Upper house',
    people: false,
  },
  'garden-trees': {
    file: 'garden-trees.jpg',
    alt: 'Lawn and trees in the garden, looking toward a single-storey residence',
    caption: 'The garden',
    people: false,
  },
  'lounge-care': {
    file: 'lounge-care.jpg',
    alt: 'Nurses in Village 60 Plus uniform sitting with residents in the lounge',
    caption: 'The lounge',
    people: true,
  },
  'window-seats': {
    file: 'window-seats.jpg',
    alt: 'Two residents sitting by a window and looking out to the garden',
    caption: 'By the window',
    people: true,
  },
} as const satisfies Record<string, ClientPhoto>;

export type ClientPhotoKey = keyof typeof CLIENT_PHOTOS;

/** Real photographs shown first in each open home's gallery. */
export const CLIENT_GALLERY: ClientPhotoKey[] = [
  'verandah-bougainvillea',
  'upper-house-garden',
  'garden-trees',
  'lounge-care',
  'window-seats',
];
