/**
 * Photographs supplied by Village 60 Plus.
 * Files live in scripts/client-photos and are uploaded by scripts/seed.ts.
 * Tranquility room and exterior photographs: October 2026.
 * Enchanted Fields exterior photographs: October 2026.
 * House on the Hill entrance and courtyard: October 2026.
 * Serenity exterior and garden photographs: October 2026.
 * Other homes: upper house, garden and window-seat photographs from 14 October 2026.
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
  'tranquility-front': {
    file: 'tranquility-front.jpg',
    alt: 'Tranquility at Nawala Road at dusk, a white building with a peaked roof and glass entrance',
    caption: 'Tranquility',
    people: false,
  },
  'tranquility-3-share': {
    file: 'tranquility-3-share.jpg',
    alt: 'A bright three-bed room at Tranquility with wooden beds and green accents',
    caption: 'Three-share room',
    people: false,
  },
  'tranquility-2-share': {
    file: 'tranquility-2-share.jpg',
    alt: 'A two-bed room at Tranquility with wooden furniture and green curtains',
    caption: 'Two-share room',
    people: false,
  },
  'tranquility-1-bed': {
    file: 'tranquility-1-bed.jpg',
    alt: 'A single-bed room at Tranquility with a double bed and wooden furniture',
    caption: 'One-bed room',
    people: false,
  },
  'tranquility-ward': {
    file: 'tranquility-ward.jpg',
    alt: 'The ward at Tranquility with partitioned beds along tall windows',
    caption: 'Ward',
    people: false,
  },
  'tranquility-garden': {
    file: 'tranquility-garden.jpg',
    alt: 'Chess on the lawn at Tranquility, in the shade of the palms',
    caption: 'Chess on the lawn',
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
  'window-seats': {
    file: 'window-seats.jpg',
    alt: 'Two residents sitting by a window and looking out to the garden',
    caption: 'By the window',
    people: true,
  },
  'enchanted-fields-front': {
    file: 'enchanted-fields-front.jpg',
    alt: 'Enchanted Fields retirement villas on a sunny afternoon, with a green roof, white verandah and wide lawn',
    caption: 'Enchanted Fields',
    people: false,
  },
  'enchanted-fields-lawn': {
    file: 'enchanted-fields-lawn.jpg',
    alt: 'The lawn at Enchanted Fields, with outdoor seating and chalet buildings among tropical trees',
    caption: 'The lawn',
    people: false,
  },
  'house-on-the-hill-entrance': {
    file: 'house-on-the-hill-entrance.jpg',
    alt: 'House on the Hill at dusk, with the illuminated entrance sign and driveway up to the white residence',
    caption: 'House on the Hill',
    people: false,
  },
  'house-on-the-hill-courtyard': {
    file: 'house-on-the-hill-courtyard.jpg',
    alt: 'The terraced courtyard at House on the Hill, with lawn, stone planters and paved paths',
    caption: 'The courtyard',
    people: false,
  },
  'serenity-verandah': {
    file: 'serenity-verandah.jpg',
    alt: 'The verandah at Serenity in the evening light, with purple bougainvillea along the roofline',
    caption: 'The verandah',
    people: false,
  },
  'serenity-walker-path': {
    file: 'serenity-walker-path.jpg',
    alt: 'A caregiver supporting a resident with a walker along a stone path at Serenity',
    caption: 'Daily walks',
    people: true,
  },
  'serenity-courtyard': {
    file: 'serenity-courtyard.jpg',
    alt: 'A caregiver and resident walking across the stone courtyard at Serenity',
    caption: 'The courtyard',
    people: true,
  },
  'serenity-pool': {
    file: 'serenity-pool.jpg',
    alt: 'The swimming pool at Serenity, with clear blue water beside the white residence',
    caption: 'The pool',
    people: false,
  },
  'serenity-grounds': {
    file: 'serenity-grounds.jpg',
    alt: 'The lawn and verandah at Serenity, with white buildings, green roofs and tropical planting',
    caption: 'The grounds',
    people: false,
  },
  'serenity-bedroom': {
    file: 'serenity-bedroom.jpg',
    alt: 'A bright bedroom at Serenity with a wooden ceiling, terracotta floor tiles and white linens',
    caption: 'A bedroom',
    people: false,
  },
} as const satisfies Record<string, ClientPhoto>;

export type ClientPhotoKey = keyof typeof CLIENT_PHOTOS;

/** Real photographs shown first in each open home's gallery (except Tranquility). */
export const CLIENT_GALLERY: ClientPhotoKey[] = ['upper-house-garden', 'garden-trees', 'window-seats'];

/** Photographs taken at Tranquility, supplied October 2026. */
export const TRANQUILITY_GALLERY: ClientPhotoKey[] = [
  'tranquility-front',
  'tranquility-1-bed',
  'tranquility-2-share',
  'tranquility-3-share',
  'tranquility-ward',
  'tranquility-garden',
];

/** Photographs taken at Enchanted Fields, supplied October 2026. */
export const ENCHANTED_FIELDS_GALLERY: ClientPhotoKey[] = ['enchanted-fields-front', 'enchanted-fields-lawn'];

/** Photographs taken at House on the Hill, supplied October 2026. */
export const HOUSE_ON_THE_HILL_GALLERY: ClientPhotoKey[] = ['house-on-the-hill-entrance', 'house-on-the-hill-courtyard'];

/** Photographs taken at Serenity, supplied October 2026. */
export const SERENITY_GALLERY: ClientPhotoKey[] = [
  'serenity-verandah',
  'serenity-walker-path',
  'serenity-courtyard',
  'serenity-pool',
  'serenity-grounds',
  'serenity-bedroom',
];
