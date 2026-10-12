export type MapAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  postcode?: string | null;
  country?: string | null;
  landmarks?: Array<string | null> | null;
  location?: { lat?: number | null; lng?: number | null } | null;
  directionsUrl?: string | null;
  visitingNotes?: string | null;
};

export function addressLines(address: MapAddress | null | undefined): string[] {
  if (!address) return [];
  return [address.line1, address.line2, address.city, address.postcode, address.country].filter((part): part is string => Boolean(part));
}

export function mapPoint(address: MapAddress | null | undefined): { lat: number; lng: number } | null {
  const lat = address?.location?.lat;
  const lng = address?.location?.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
}

function httpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).protocol === 'https:' ? value : null;
  } catch {
    return null;
  }
}

/** A directions link that works with no map loaded. Never returns a non-https CMS value. */
export function directionsHref(address: MapAddress | null | undefined): string | null {
  if (!address) return null;
  const given = httpsUrl(address.directionsUrl);
  if (given) return given;
  const point = mapPoint(address);
  if (point) return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
  const query = addressLines(address).join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

export function staticMapUrl(
  point: { lat: number; lng: number },
  { width, height, key }: { width: number; height: number; key: string },
): string {
  const params = new URLSearchParams({
    center: `${point.lat},${point.lng}`,
    zoom: '15',
    size: `${width}x${height}`,
    scale: '2',
    maptype: 'roadmap',
    markers: `color:0x18352D|${point.lat},${point.lng}`,
    key,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
}

export function embedMapUrl(point: { lat: number; lng: number }, key: string): string {
  const params = new URLSearchParams({
    key,
    center: `${point.lat},${point.lng}`,
    zoom: '15',
  });
  return `https://www.google.com/maps/embed/v1/view?${params}`;
}
