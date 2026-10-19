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
  oracle: { src: '/home/hero.jpg', alt: 'Oracle at dusk, with the illuminated residence sign' },
  'the-grove': { src: '/homes/grove.jpg', alt: 'The Grove, a larger residence among palms at dusk' },
  tranquility: {
    src: '/homes/tranquility.jpg',
    alt: 'Tranquility at Nawala Road at dusk, a white building with a peaked roof and glass entrance',
  },
  serenity: {
    src: '/homes/serenity.jpg',
    alt: 'Serenity on Railway Avenue, a white bungalow with a clay-tile roof and pink bougainvillea over the verandah',
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

const CARE_PHOTOS: Record<CareServiceSlug, Shot> = {
  'independent-living': { src: '/silver-roots/home-care.jpg', alt: 'A caregiver sitting with a resident at home' },
  'residential-care': { src: '/silver-roots/hero.jpg', alt: 'A caregiver sitting with a resident over tea' },
  'respite-care': { src: '/homes/bedroom.jpg', alt: 'A private bedroom opening onto the garden' },
  recovery: { src: '/silver-roots/wellbeing.jpg', alt: 'A quiet wellbeing session in a bright room' },
  rehabilitation: { src: '/silver-roots/garden.jpg', alt: 'An older couple walking through a tropical garden' },
};

const OFFERING_PHOTOS: Record<OfferingSlug, Shot> = {
  'silver-roots': { src: '/silver-roots/hero.jpg', alt: 'A caregiver sitting with a resident over tea' },
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
    src: '/homes/enchanted-fields/lawn.jpg',
    alt: 'The lawn at Enchanted Fields, with outdoor seating and chalet buildings among tropical trees',
  },
];

const SERENITY_SCENES: Shot[] = [
  {
    src: '/homes/serenity.jpg',
    alt: 'Serenity on Railway Avenue, a white bungalow with a clay-tile roof and pink bougainvillea over the verandah',
  },
  {
    src: '/homes/serenity/serenity-verandah.jpg',
    alt: 'The verandah at Serenity in the evening light, with purple bougainvillea along the roofline',
  },
  {
    src: '/homes/serenity/serenity-garden-walk.jpg',
    alt: 'A caregiver walking with a resident through the garden courtyard at Serenity',
  },
  {
    src: '/homes/serenity/serenity-walker-path.jpg',
    alt: 'A caregiver supporting a resident with a walker along a stone path at Serenity',
  },
  {
    src: '/homes/serenity/serenity-courtyard.jpg',
    alt: 'A caregiver and resident walking across the stone courtyard at Serenity',
  },
];

const TRANQUILITY_SCENES: Shot[] = [
  {
    src: '/homes/tranquility.jpg',
    alt: 'Tranquility at Nawala Road at dusk, a white building with a peaked roof and glass entrance',
  },
  {
    src: '/homes/tranquility/3-share.jpg',
    alt: 'A bright three-bed room at Tranquility with wooden beds and green accents',
  },
  {
    src: '/homes/tranquility/2-share.jpg',
    alt: 'A two-bed room at Tranquility with wooden furniture and green curtains',
  },
  {
    src: '/homes/tranquility/1-bed.jpg',
    alt: 'A single-bed room at Tranquility with a double bed and wooden furniture',
  },
  {
    src: '/homes/tranquility/ward.jpg',
    alt: 'The ward at Tranquility with partitioned beds along tall windows',
  },
  {
    src: '/homes/tranquility/garden.jpg',
    alt: 'Two residents playing chess in the garden at Tranquility',
  },
];

const TRANQUILITY_ROOM_PHOTOS: Partial<Record<string, Shot>> = {
  '1 bed': TRANQUILITY_SCENES[3],
  '2 share': TRANQUILITY_SCENES[2],
  '3 share': TRANQUILITY_SCENES[1],
  Ward: TRANQUILITY_SCENES[4],
};

const SCENES: Shot[] = [
  { src: '/homes/bedroom.jpg', alt: 'A private bedroom opening onto the garden' },
  { src: '/home/living-room.jpg', alt: 'A light-filled living room opening onto a tropical garden' },
  { src: '/homes/sitting.jpg', alt: 'A private sitting room beside the garden' },
  { src: '/homes/court.jpg', alt: 'A quiet courtyard beside the residence' },
  { src: '/silver-roots/garden.jpg', alt: 'An older couple walking through a tropical garden' },
  { src: '/homes/guidance.jpg', alt: 'A caregiver sitting with a resident in a bright room' },
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
  sitePhoto('/homes/guidance.jpg', 'A caregiver sitting with a resident in a bright room'),
  sitePhoto('/silver-roots/hero.jpg', 'A caregiver sitting with a resident over tea'),
  sitePhoto('/home/living-room.jpg', 'A light-filled living room opening onto a tropical garden'),
];

type WithPhotos = {
  slug?: string | null;
  heroImage?: CmsImage | null;
  gallery?: Array<CmsImage | null> | null;
  rooms?: Array<{ image?: CmsImage | null } | null> | null;
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
