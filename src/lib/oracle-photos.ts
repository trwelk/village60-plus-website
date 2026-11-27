import type { CmsImage } from '@/components/media/SanityImage';
import { sitePhoto } from '@/lib/site-photo';

type Shot = { src: string; alt: string };

export const ORACLE_HERO: Shot = {
  src: '/oracle/hero.jpg',
  alt: 'Oracle at Pepiliyana, with the residence frontage and tropical garden',
};

export const ORACLE_INDEPENDENCE: Shot = {
  src: '/oracle/exterior.jpg',
  alt: 'Oracle at Pepiliyana by day, with the carport and landscaped front garden',
};

/** /homes top hero — Oracle, but not the same frame as the Oracle page (`ORACLE_HERO`). */
export const ORACLE_HOMES_PAGE_HERO: Shot = ORACLE_INDEPENDENCE;

/** Gallery order for hero, day-in-pictures sections, room strip, and everyday backdrop. */
export const ORACLE_GALLERY_SCENES: Shot[] = [
  { src: '/oracle/room-jade.jpg', alt: 'A private room at Oracle with a wooden bed and green bedding' },
  { src: '/oracle/lounge.jpg', alt: 'The shared lounge and dining room at Oracle' },
  { src: '/oracle/sitting.jpg', alt: 'A quiet sitting area with upholstered chairs at Oracle' },
  { src: '/oracle/courtyard.jpg', alt: 'The planted courtyard at Oracle, with pool and balconied wings' },
  { src: '/oracle/kitchen.jpg', alt: 'The kitchen at Oracle with wood cabinetry and a central island' },
  { src: '/oracle/entrance.jpg', alt: 'The main entrance to Oracle with balconied upper floor and palm planting' },
];

const ORACLE_ROOM_ORDER = [
  'Jade',
  'Onyx',
  'Ruby',
  'Ivory',
  'Coral',
  'Pearl',
  'Amber',
  'Sapphire',
  'Opal',
  'Emerald',
] as const;

const ORACLE_ROOM_PHOTOS: Record<(typeof ORACLE_ROOM_ORDER)[number], Shot> = {
  Jade: { src: '/oracle/room-jade.jpg', alt: 'The Jade room at Oracle' },
  Onyx: { src: '/oracle/room-onyx.jpg', alt: 'The Onyx room at Oracle' },
  Ruby: { src: '/oracle/room-ruby.jpg', alt: 'The Ruby room at Oracle' },
  Ivory: { src: '/oracle/room-ivory.jpg', alt: 'The Ivory room at Oracle' },
  Coral: { src: '/oracle/room-coral.jpg', alt: 'The Coral room at Oracle' },
  Pearl: { src: '/oracle/room-pearl.jpg', alt: 'The Pearl room at Oracle' },
  Amber: { src: '/oracle/room-amber.jpg', alt: 'The Amber room at Oracle' },
  Sapphire: { src: '/oracle/room-sapphire.jpg', alt: 'The Sapphire room at Oracle' },
  Opal: { src: '/oracle/room-opal.jpg', alt: 'The Opal room at Oracle' },
  Emerald: { src: '/oracle/room-emerald.jpg', alt: 'The Emerald room at Oracle' },
};

export const ORACLE_STORY: Shot = {
  src: '/oracle/room-coral.jpg',
  alt: 'The Coral room at Oracle',
};

/** Home page (`/`) full-bleed hero. */
export const ORACLE_HOME_PAGE_HERO: Shot = {
  src: '/oracle/lounge.jpg',
  alt: 'The shared lounge and dining room at Oracle',
};

export const ORACLE_SPOTLIGHT_PHOTOS: Shot[] = [ORACLE_HERO, ORACLE_INDEPENDENCE];

export const ORACLE_INDEPENDENT_LIVING: Shot = {
  src: '/oracle/sitting.jpg',
  alt: 'A quiet sitting area with upholstered chairs at Oracle',
};

export const ORACLE_RESIDENTIAL_CARE: Shot = {
  src: '/oracle/bedroom.jpg',
  alt: 'A private bedroom at Oracle with curtains and a tufted headboard',
};

export const ORACLE_HOMES_TILES: ReadonlyArray<Shot & { caption: string }> = [
  { src: '/oracle/bedroom.jpg', alt: 'A private bedroom at Oracle with curtains and a tufted headboard', caption: 'Ten unique rooms' },
  { src: '/oracle/lounge.jpg', alt: 'The shared lounge and dining room at Oracle', caption: 'Elegant shared spaces' },
  { src: '/oracle/courtyard.jpg', alt: 'The planted courtyard at Oracle, with pool and balconied wings', caption: 'Private and peaceful' },
  { src: '/oracle/sitting.jpg', alt: 'A quiet sitting area with upholstered chairs at Oracle', caption: 'Independent living' },
];

export const ORACLE_LIFE_PHOTOS: Array<{ src: string; alt: string; caption: string }> = [
  { src: '/oracle/lounge.jpg', alt: 'The shared lounge and dining room at Oracle', caption: 'The lounge' },
  { src: '/oracle/courtyard.jpg', alt: 'The planted courtyard at Oracle, with pool and balconied wings', caption: 'The garden' },
  { src: '/oracle/quiet-corner.jpg', alt: 'A quiet reading corner at Oracle', caption: 'A quiet corner' },
  { src: '/oracle/bedroom.jpg', alt: 'A private bedroom at Oracle with curtains and a tufted headboard', caption: 'Your own room' },
];

type WithPhotos = {
  slug?: string | null;
  heroImage?: CmsImage | null;
  gallery?: Array<CmsImage | null> | null;
  rooms?: Array<{ name?: string | null; image?: CmsImage | null } | null> | null;
};

/** Real Oracle photography for the dedicated page only. */
export function withOraclePagePhotos<T extends WithPhotos>(residence: T): T {
  const gallery = ORACLE_GALLERY_SCENES.map((photo) => sitePhoto(photo.src, photo.alt));
  return {
    ...residence,
    heroImage: sitePhoto(ORACLE_HERO.src, ORACLE_HERO.alt),
    gallery,
    rooms: residence.rooms?.map((room) => {
      if (!room?.name) return room;
      const photo = ORACLE_ROOM_PHOTOS[room.name as keyof typeof ORACLE_ROOM_PHOTOS];
      if (!photo) {
        const index = ORACLE_ROOM_ORDER.indexOf(room.name as (typeof ORACLE_ROOM_ORDER)[number]);
        const fallback = ORACLE_GALLERY_SCENES[(index >= 0 ? index : 0) % ORACLE_GALLERY_SCENES.length];
        return { ...room, image: sitePhoto(fallback.src, room.name ? `${room.name} room at Oracle` : fallback.alt) };
      }
      return { ...room, image: sitePhoto(photo.src, photo.alt) };
    }),
  };
}