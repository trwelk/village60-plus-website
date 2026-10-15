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
  tranquility: { src: '/homes/tranquility.jpg', alt: 'Tranquility in the evening, with a verandah and garden' },
  serenity: { src: '/homes/serenity.jpg', alt: 'Serenity at dusk, a smaller home with a front porch' },
  'house-on-the-hill': { src: '/homes/hill.jpg', alt: 'House on the Hill at dusk, set above a wide lawn' },
  'enchanted-fields': { src: '/homes/fields.jpg', alt: 'Enchanted Fields in golden light, with open green grounds' },
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
  const scenes = scenePhotos();
  return {
    ...residence,
    heroImage: photoForResidence(residence.slug) ?? residence.heroImage,
    gallery: scenes,
    rooms: residence.rooms?.map((room, index) => (room ? { ...room, image: scenes[index % scenes.length] } : room)),
  };
}
