import { describe, expect, it } from 'vitest';
import { addressLines, directionsHref, mapPoint, staticMapUrl } from './maps';

const address = {
  line1: '133/19 Nawala Road',
  line2: 'Narahenpita',
  city: 'Colombo 05',
  postcode: null,
  country: 'Sri Lanka',
  location: { lat: 6.91, lng: 79.88 },
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Serenity',
  visitingNotes: null,
};

describe('map helpers', () => {
  it('lists the postal lines and skips blanks', () => {
    expect(addressLines(address)).toEqual(['133/19 Nawala Road', 'Narahenpita', 'Colombo 05', 'Sri Lanka']);
    expect(addressLines(null)).toEqual([]);
  });

  it('reads a geopoint only when both coordinates are numbers', () => {
    expect(mapPoint(address)).toEqual({ lat: 6.91, lng: 79.88 });
    expect(mapPoint({ ...address, location: { lat: 6.91, lng: null } })).toBeNull();
    expect(mapPoint({ ...address, location: null })).toBeNull();
  });

  it('prefers the CMS directions link, then coordinates, then the address', () => {
    expect(directionsHref(address)).toBe('https://www.google.com/maps/search/?api=1&query=Serenity');
    expect(directionsHref({ ...address, directionsUrl: 'javascript:alert(1)' })).toBe('https://www.google.com/maps/search/?api=1&query=6.91,79.88');
    expect(directionsHref({ line1: '133/19 Nawala Road', city: 'Colombo 05', country: 'Sri Lanka' })).toBe(
      'https://www.google.com/maps/search/?api=1&query=133%2F19%20Nawala%20Road%2C%20Colombo%2005%2C%20Sri%20Lanka',
    );
    expect(directionsHref(null)).toBeNull();
  });

  it('builds a static map URL with the heritage-green marker and the key', () => {
    const url = new URL(staticMapUrl({ lat: 6.91, lng: 79.88 }, { width: 640, height: 400, key: 'test-key' }));
    expect(url.origin + url.pathname).toBe('https://maps.googleapis.com/maps/api/staticmap');
    expect(url.searchParams.get('center')).toBe('6.91,79.88');
    expect(url.searchParams.get('size')).toBe('640x400');
    expect(url.searchParams.get('markers')).toBe('color:0x18352D|6.91,79.88');
    expect(url.searchParams.get('key')).toBe('test-key');
  });
});
