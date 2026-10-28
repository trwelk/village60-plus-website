import type { CmsImage } from '@/components/media/SanityImage';
import type { CareServiceSlug, OfferingSlug, ResidenceSlug } from '@/lib/routes';

type Shot = { src: string; alt: string };

export function sitePhoto(src: string, alt: string): CmsImage {
  return {
    alt,
    asset: {
      url: src,
      metadata: { dimensions: { aspectRatio: 4 / 3, width: 1600, height: 1200 } },
    },
  };
}

const RESIDENCE_PHOTOS: Record<ResidenceSlug, Shot> = {
  oracle: { src: '/home/oracle-sign.jpg', alt: 'Oracle at dusk, with the illuminated residence sign' },
  'the-grove': {
    src: '/look-to-the-future/grove-aerial.jpg',
    alt: 'Aerial view of The Grove in Kottawa, two long buildings set in a landscaped garden',
  },
  tranquility: {
    src: '/homes/tranquility.jpg',
    alt: 'Tranquility at Nawala Road at dusk, a white building with a peaked roof and glass entrance',
  },
  serenity: {
    src: '/homes/serenity/serenity-verandah.jpg',
    alt: 'The verandah at Serenity in the evening light, with purple bougainvillea along the roofline',
  },
  'house-on-the-hill': {
    src: '/homes/hill.jpg',
    alt: 'House on the Hill at dusk, with the illuminated entrance sign and driveway up to the white residence',
  },
  'enchanted-fields': {
    src: '/homes/fields.jpg',
    alt: 'Enchanted Fields retirement villas on a sunny afternoon, with a green roof, white verandah and wide lawn',
  },
};

/** Real staff-and-resident photographs. Use these wherever a picture shows people. */
export const PEOPLE_PHOTOS = {
  lounge: { src: '/people/lounge.jpg', alt: 'A nurse sitting with a resident in the lounge' },
  hands: { src: '/people/hands.jpg', alt: 'A nurse holding hands with a resident' },
  courtyard: { src: '/people/courtyard.jpg', alt: 'A caregiver walking with a resident across the courtyard' },
  walker: { src: '/people/walker.jpg', alt: 'A caregiver supporting a resident with a walker along a garden path' },
} as const satisfies Record<string, Shot>;

const CARE_PHOTOS: Record<CareServiceSlug, Shot> = {
  'independent-living': PEOPLE_PHOTOS.lounge,
  'residential-care': PEOPLE_PHOTOS.hands,
  'respite-care': {
    src: '/homes/serenity/serenity-bedroom.jpg',
    alt: 'A bright bedroom at Serenity with a wooden ceiling, terracotta floor tiles and white linens',
  },
  recovery: PEOPLE_PHOTOS.walker,
  rehabilitation: PEOPLE_PHOTOS.courtyard,
};

const OFFERING_PHOTOS: Record<OfferingSlug, Shot> = {
  'silver-roots': PEOPLE_PHOTOS.hands,
  'destination-retirement': { src: '/destination-retirement/hero.jpg', alt: 'A cliffside pool looking out to the ocean' },
  sage: { src: '/silver-roots/sunset.jpg', alt: 'A tropical garden in the evening light' },
};

const HOUSE_ON_THE_HILL_SCENES: Shot[] = [
  {
    src: '/homes/hill.jpg',
    alt: 'House on the Hill at dusk, with the illuminated entrance sign and driveway up to the white residence',
  },
  {
    src: '/homes/house-on-the-hill/courtyard.jpg',
    alt: 'The terraced courtyard at House on the Hill, with lawn, stone planters and paved paths',
  },
];

const ENCHANTED_FIELDS_SCENES: Shot[] = [
  {
    src: '/homes/fields.jpg',
    alt: 'Enchanted Fields retirement villas on a sunny afternoon, with a green roof, white verandah and wide lawn',
  },
  {
    src: '/homes/enchanted-fields/verandah.jpg',
    alt: 'The lawn and verandah at Enchanted Fields, with white buildings, green roofs and tropical planting',
  },
  {
    src: '/homes/enchanted-fields/lawn.jpg',
    alt: 'The lawn at Enchanted Fields, with outdoor seating and chalet buildings among tropical trees',
  },
];

const SERENITY_SCENES: Shot[] = [
  {
    src: '/homes/serenity/serenity-verandah.jpg',
    alt: 'The verandah at Serenity in the evening light, with purple bougainvillea along the roofline',
  },
  {
    src: '/homes/serenity/serenity-walker-path.jpg',
    alt: 'A caregiver supporting a resident with a walker along a stone path at Serenity',
  },
  {
    src: '/homes/serenity/serenity-courtyard.jpg',
    alt: 'A caregiver and resident walking across the stone courtyard at Serenity',
  },
  {
    src: '/homes/serenity/serenity-pool.jpg',
    alt: 'The swimming pool at Serenity, with clear blue water beside the white residence',
  },
  {
    src: '/homes/serenity/serenity-bedroom.jpg',
    alt: 'A bright bedroom at Serenity with a wooden ceiling, terracotta floor tiles and white linens',
  },
];

const TRANQUILITY_SCENES: Shot[] = [
  {
    src: '/homes/tranquility.jpg',
    alt: 'Tranquility at Nawala Road at dusk, a white building with a peaked roof and glass entrance',
  },
  {
    src: '/homes/tranquility/1-bed.jpg',
    alt: 'A single-bed room at Tranquility with a double bed and wooden furniture',
  },
  {
    src: '/homes/tranquility/2-share.jpg',
    alt: 'A two-bed room at Tranquility with wooden furniture and green curtains',
  },
  {
    src: '/homes/tranquility/3-share.jpg',
    alt: 'A bright three-bed room at Tranquility with wooden beds and green accents',
  },
  {
    src: '/homes/tranquility/ward.jpg',
    alt: 'The ward at Tranquility with partitioned beds along tall windows',
  },
  {
    src: '/homes/tranquility/garden.jpg',
    alt: 'Chess on the lawn at Tranquility, in the shade of the palms',
  },
];

const TRANQUILITY_ROOM_PHOTOS: Partial<Record<string, Shot>> = {
  '1 bed': TRANQUILITY_SCENES[1],
  '2 share': TRANQUILITY_SCENES[2],
  '3 share': TRANQUILITY_SCENES[3],
  Ward: TRANQUILITY_SCENES[4],
};

const SCENES: Shot[] = [
  { src: '/homes/bedroom.jpg', alt: 'A private bedroom opening onto the garden' },
  { src: '/home/living-room.jpg', alt: 'A light-filled living room opening onto a tropical garden' },
  { src: '/homes/sitting.jpg', alt: 'A private sitting room beside the garden' },
  { src: '/homes/court.jpg', alt: 'A quiet courtyard beside the residence' },
  PEOPLE_PHOTOS.courtyard,
  PEOPLE_PHOTOS.lounge,
];

/** Oracle stays on the residence itself. The courtyard walk and lounge portraits are used elsewhere. */
const ORACLE_SCENES: Shot[] = [
  { src: '/homes/bedroom.jpg', alt: 'A private bedroom opening onto the garden' },
  { src: '/home/living-room.jpg', alt: 'A light-filled living room opening onto a tropical garden' },
  { src: '/homes/sitting.jpg', alt: 'A private sitting room beside the garden' },
  { src: '/homes/court.jpg', alt: 'The Oracle residence by day, with the pool and planted courtyard' },
];

function shot(table: Record<string, Shot>, slug: string | null | undefined): CmsImage | null {
  if (!slug || !(slug in table)) return null;
  const photo = table[slug];
  return sitePhoto(photo.src, photo.alt);
}

export function photoForResidence(slug: string | null | undefined) {
  return shot(RESIDENCE_PHOTOS, slug);
}

export function photoForCare(slug: string | null | undefined) {
  return shot(CARE_PHOTOS, slug);
}

export function photoForOffering(slug: string | null | undefined) {
  return shot(OFFERING_PHOTOS, slug);
}

export function scenePhotos(): CmsImage[] {
  return SCENES.map((photo) => sitePhoto(photo.src, photo.alt));
}

export const HOME_PORTRAITS: CmsImage[] = [
  sitePhoto('/home/oracle-sign.jpg', 'Oracle at dusk, with the illuminated residence sign'),
  sitePhoto('/homes/court.jpg', 'The Oracle residence by day, with the pool and planted courtyard'),
];

type WithPhotos = {
  slug?: string | null;
  heroImage?: CmsImage | null;
  gallery?: Array<CmsImage | null> | null;
  rooms?: Array<{ name?: string | null; image?: CmsImage | null } | null> | null;
};

/** Swap CMS stock for the sharper on-site photographs. Named team portraits stay as published. */
export function withResidencePhotos<T extends WithPhotos>(residence: T): T {
  const scenes =
    residence.slug === 'tranquility'
      ? TRANQUILITY_SCENES.map((photo) => sitePhoto(photo.src, photo.alt))
      : residence.slug === 'serenity'
        ? SERENITY_SCENES.map((photo) => sitePhoto(photo.src, photo.alt))
        : residence.slug === 'enchanted-fields'
        ? ENCHANTED_FIELDS_SCENES.map((photo) => sitePhoto(photo.src, photo.alt))
        : residence.slug === 'house-on-the-hill'
          ? HOUSE_ON_THE_HILL_SCENES.map((photo) => sitePhoto(photo.src, photo.alt))
          : residence.slug === 'oracle'
            ? ORACLE_SCENES.map((photo) => sitePhoto(photo.src, photo.alt))
            : scenePhotos();
  return {
    ...residence,
    heroImage: photoForResidence(residence.slug) ?? residence.heroImage,
    gallery: scenes,
    rooms: residence.rooms?.map((room, index) => {
      if (!room) return room;
      if (residence.slug === 'tranquility' && room.name) {
        const photo = TRANQUILITY_ROOM_PHOTOS[room.name];
        if (photo) return { ...room, image: sitePhoto(photo.src, photo.alt) };
      }
      return { ...room, image: scenes[index % scenes.length] };
    }),
  };
}
