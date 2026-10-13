import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { OurStoryView } from './view';

const block = (text: string) => [
  { _type: 'block' as const, _key: text, style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text, marks: [] }] },
];

describe('OurStoryView', () => {
  it('shows one green band, omits an unconfirmed founding year, and skips a blank portrait', () => {
    const { container } = render(
      <OurStoryView
        title="Our story"
        intro="We started with a home."
        body={block('People should grow older with dignity.')}
        foundedYear={null}
        sections={[
          { _key: 'a', heading: 'A home first', body: block('A single residence.'), tone: 'ivory' },
          { _key: 'b', heading: 'The next chapter', body: block('Each new service is labelled.'), tone: 'green' },
          { _key: 'c', heading: 'Another quote', body: block('This second dark band must not stay dark.'), tone: 'green' },
          { _key: 'd', heading: 'Night', body: block('No night band on this page.'), tone: 'night' },
        ]}
        team={[
          { _id: 'team.amara', name: 'Amara Perera', role: 'Care lead', credentials: ['Registered nurse'], image: imageFixture('Amara Perera') },
          { _id: 'team.blank', name: 'No Photo', role: 'Coordinator', credentials: [], image: { ...imageFixture('hidden'), alt: ' ' } },
        ]}
      />,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('People should grow older with dignity.')).toBeInTheDocument();
    expect(screen.queryByText(/Established/)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.bg-green')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Night' }).closest('.bg-night')).toBeNull();
    expect(screen.getByRole('img', { name: 'Amara Perera' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'hidden' })).not.toBeInTheDocument();
    expect(screen.getByText('Registered nurse')).toBeInTheDocument();
  });

  it('prints the founding year only when settings provide one', () => {
    render(<OurStoryView title="Our story" intro={null} body={null} foundedYear={2008} sections={[]} team={[]} />);
    expect(screen.getByText('Established 2008')).toBeInTheDocument();
  });
});
