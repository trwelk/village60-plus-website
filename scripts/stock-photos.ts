/**
 * Temporary development photographs from Unsplash (https://unsplash.com/license).
 * Free to use, including commercially. They are not Village 60 Plus properties,
 * residents, or staff, and stay marked placeholder until client photography replaces them.
 */
export type StockPhoto = {
  /** Path segment on images.unsplash.com, e.g. photo-123 */
  imagePath: string;
  photographer: string;
  /** Unsplash photo page, for attribution stored in the CMS. */
  page: string;
  alt: string;
  /** Identifiable people, so consent is recorded against the Unsplash licence. */
  people: boolean;
  hotspot?: { x: number; y: number; height: number; width: number };
};

export const STOCK_PHOTOS = {
  patio: {
    imagePath: 'photo-1785479085389-98996925c5eb',
    photographer: 'Thilina Alagiyawanna',
    page: 'https://unsplash.com/photos/nHQiTpxV9q4',
    alt: 'Shaded verandah with open timber doors, ceiling fans and wooden chairs',
    people: false,
  },
  'timber-house': {
    imagePath: 'photo-1788145749384-f91374d3bb99',
    photographer: 'Vincent Yap',
    page: 'https://unsplash.com/photos/ERELDM2UA3o',
    alt: 'A timber house with a clay-tile roof and deep eaves, set in a green garden',
    people: false,
  },
  'garden-bungalow': {
    imagePath: 'photo-1670959241159-605681e9addd',
    photographer: 'Balajee Vishwanath',
    page: 'https://unsplash.com/photos/sqcZzocjbxc',
    alt: 'A white bungalow with a tiled roof, surrounded by a lush garden',
    people: true,
  },
  'palm-verandah': {
    imagePath: 'photo-1677559401235-fe6d5ba9a4df',
    photographer: 'Om Surve',
    page: 'https://unsplash.com/photos/z-oedQUuJms',
    alt: 'A traditional house with a clay-tile roof and a planted verandah among palm trees',
    people: false,
  },
  'tropical-garden': {
    imagePath: 'photo-1750762286053-28632f48e717',
    photographer: 'Zoshua Colah',
    page: 'https://unsplash.com/photos/NgJMXoPoDmg',
    alt: 'A tropical garden with coconut palms, a stone path and flowering plants',
    people: true,
  },
  bungalow: {
    imagePath: 'photo-1642667670006-6b3059ccf96d',
    photographer: 'Anoop Surendran',
    page: 'https://unsplash.com/photos/W9NgQjRX7ZE',
    alt: 'A white bungalow with a clay-tile roof, bougainvillea and a garden wall',
    people: false,
    hotspot: { x: 0.5, y: 0.62, height: 0.55, width: 0.92 },
  },
  'flower-path': {
    imagePath: 'photo-1783656852352-071344d61e57',
    photographer: 'Shandy Demicillo',
    page: 'https://unsplash.com/photos/dM7QlJjOiEg',
    alt: 'A cobbled path shaded by trees, lined with pink bougainvillea',
    people: false,
  },
  bedroom: {
    imagePath: 'photo-1780662805447-36c9c1a6641e',
    photographer: 'Clay Banks',
    page: 'https://unsplash.com/photos/DsBUrDxMRak',
    alt: 'A sunlit bedroom with wood panelling, an open book on the bed and windows onto trees',
    people: false,
  },
  courtyard: {
    imagePath: 'photo-1784308992954-6c953b02f0a0',
    photographer: 'Shruti Singh',
    page: 'https://unsplash.com/photos/NIyn7Rt_FdY',
    alt: 'A quiet courtyard with a clay-tile roof, brick walls and a young tree',
    people: false,
  },
  'lush-entrance': {
    imagePath: 'photo-1763878121501-97e4080c3667',
    photographer: 'Daniel Mainye',
    page: 'https://unsplash.com/photos/MEQTRdmLv5s',
    alt: 'A garden path leading to a house entrance among potted plants',
    people: false,
  },
  wicker: {
    imagePath: 'photo-1776417092496-a2c5c0339519',
    photographer: 'James Coleman',
    page: 'https://unsplash.com/photos/hksPyOlf54w',
    alt: 'A long wooden verandah in warm afternoon light, with wicker chairs',
    people: false,
    hotspot: { x: 0.42, y: 0.48, height: 0.42, width: 0.8 },
  },
  'tea-hills': {
    imagePath: 'photo-1641149750086-b11cd21d1f60',
    photographer: 'Thushal Madhushankha',
    page: 'https://unsplash.com/photos/ZHlsYKm3sVE',
    alt: 'Morning light over tea hills and trees in Ramboda, Sri Lanka',
    people: false,
  },
  jaffna: {
    imagePath: 'photo-1509763988163-d54b5f5d5b67',
    photographer: 'Roxanne Desgagnés',
    page: 'https://unsplash.com/photos/n1EO-snHcQ0',
    alt: 'Three women smiling outdoors in Jaffna, Sri Lanka',
    people: true,
    hotspot: { x: 0.5, y: 0.58, height: 0.7, width: 0.95 },
  },
} as const satisfies Record<string, StockPhoto>;

export type StockPhotoKey = keyof typeof STOCK_PHOTOS;
