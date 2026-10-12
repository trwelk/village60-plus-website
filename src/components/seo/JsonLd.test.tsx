import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonLd } from './JsonLd';
import { serializeJsonLd } from '@/lib/seo';

describe('JsonLd', () => {
  it('escapes < so a value cannot close the script', () => {
    const json = serializeJsonLd({ '@context': 'https://schema.org', name: '</script><script>alert(1)' });
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toMatchObject({ name: '</script><script>alert(1)' });
  });

  it('renders one script per object and skips nulls', () => {
    const { container } = render(
      <JsonLd data={[{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Village 60 Plus' }, null]} />,
    );
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0]?.innerHTML).toContain('WebSite');
  });
});
