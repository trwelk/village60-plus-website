import { describe, expect, it } from 'vitest';
import { urlFor } from './image';

describe('urlFor', () => {
  it('builds a Sanity CDN URL with auto format and the requested crop', () => {
    const url = urlFor({ _type: 'image', asset: { _type: 'reference', _ref: 'image-abc123-1200x800-jpg' } })
      .width(600)
      .height(400)
      .fit('crop')
      .url();
    expect(url).toContain('https://cdn.sanity.io/images/testproject/test/abc123-1200x800.jpg');
    expect(url).toContain('w=600');
    expect(url).toContain('h=400');
    expect(url).toContain('fit=crop');
    expect(url).toContain('auto=format');
  });
});
