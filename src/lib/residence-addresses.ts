import type { MapAddress } from '@/lib/maps';
import type { ResidenceSlug } from '@/lib/routes';

/** Verified street addresses and map pins (village60plus.lk). CMS may still carry older placeholders until re-seeded. */
export const RESIDENCE_VERIFIED_ADDRESSES: Partial<Record<ResidenceSlug, MapAddress>> = {
  tranquility: {
    line1: '133/19, Nawala Road',
    line2: 'Narahenpita',
    city: 'Colombo 05',
    country: 'Sri Lanka',
    location: { lat: 6.8901495, lng: 79.8801168 },
  },
  serenity: {
    line1: '32/10, Railway Avenue',
    city: 'Nugegoda',
    country: 'Sri Lanka',
    location: { lat: 6.8814717, lng: 79.8763476 },
  },
  'house-on-the-hill': {
    line1: '235/15, Wijaya Kumaratunga Mawatha',
    line2: 'Polhengoda',
    city: 'Kirulapone',
    country: 'Sri Lanka',
    location: { lat: 6.8649081, lng: 79.8996789 },
  },
  'enchanted-fields': {
    line1: '7th Lane, Kulasiri Kumarage Mawatha',
    city: 'Homagama',
    country: 'Sri Lanka',
    location: { lat: 6.8432762, lng: 80.0031833 },
  },
  oracle: {
    line1: 'No 25, 1st Lane',
    city: 'Nedimala',
    country: 'Sri Lanka',
    location: { lat: 6.8439889, lng: 79.8833509 },
  },
};

export function verifiedResidenceAddress(slug: string | null | undefined, cms?: MapAddress | null): MapAddress | null {
  const verified = slug ? RESIDENCE_VERIFIED_ADDRESSES[slug as ResidenceSlug] : undefined;
  if (!verified) return cms ?? null;
  return {
    ...verified,
    directionsUrl: cms?.directionsUrl ?? undefined,
    landmarks: cms?.landmarks ?? undefined,
    visitingNotes: cms?.visitingNotes ?? verified.visitingNotes,
  };
}
