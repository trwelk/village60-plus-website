import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import type { ResidenceContent } from '../homes/[slug]/view';
import { OracleView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

const block = (text: string) => [
  { _type: 'block' as const, _key: 'b', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's', text, marks: [] }] },
];

const oracle: ResidenceContent = {
  name: 'Oracle',
  slug: 'oracle',
  status: 'limited',
  shortLocation: 'Pepiliyana',
  summary: 'Ten rooms for independent adults, with support available when wanted.',
  heroImage: imageFixture('Oracle exterior'),
  description: block('A private residence for independent adults.'),
  careTypes: [{ _id: 'care.independent-living', name: 'Independent Living', slug: 'independent-living' }],
  audienceFit: ['Independent adults who want privacy without isolation'],
  atmosphere: block('The day follows the resident, not a timetable.'),
  sharedSpaces: ['Dining room', 'Garden'],
  rooms: [
    { _key: 'jade', name: 'Jade', house: 'House 1', summary: 'Room facts will be added once verified.', facts: [], image: imageFixture('Jade') },
    { _key: 'pearl', name: 'Pearl', house: 'House 2', summary: null, facts: ['Aspect to be confirmed'], image: imageFixture('Pearl') },
  ],
  careAndSupport: [
    { _key: 'assist', title: 'Everyday assistance', description: 'Help on request.', provision: 'included', status: 'available' },
    { _key: 'partner', title: 'Appointment transport', description: 'Arranged with a partner.', provision: 'partner-arranged', status: 'available' },
  ],
  everydayLife: [{ _key: 'meals', title: 'Dining', description: 'Meals in the shared dining room or in the room.', provision: 'included', status: 'available' }],
  gallery: [],
  team: [],
  address: { line1: 'Pepiliyana Road', city: 'Pepiliyana', country: 'Sri Lanka' },
  faqs: [],
  formKind: 'oracle-visit',
  comingSoonNote: null,
};

describe('OracleView', () => {
  it('lists the rooms it is given and places the visit form at the end', () => {
    const { container } = render(<OracleView residence={oracle} contact={contactFixture} mapsKey={null} />);
    expect([...container.querySelectorAll('[data-oracle-section]')].map((node) => node.getAttribute('data-oracle-section'))).toEqual([
      'hero', 'rooms', 'daily-life', 'highlights', 'spaces', 'everyday', 'optional', 'independence', 'map', 'life', 'visit',
    ]);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Oracle' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByRole('img', { name: 'Jade' })).toBeInTheDocument();
    expect(screen.getByText('Jade')).toBeInTheDocument();
    expect(screen.getByText('Pearl')).toBeInTheDocument();
    expect(screen.getByText('Aspect to be confirmed')).toBeInTheDocument();
    expect(screen.queryByText('Onyx')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Live Your Day, Your Way.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discover life at Oracle' })).toHaveAttribute('href', '#oracle-life');
    expect(screen.getByRole('heading', { name: 'The day, in pictures.' })).toHaveAttribute('id', 'oracle-life-title');
    expect(screen.getByRole('img', { name: 'A light-filled living room opening onto a tropical garden' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'The Oracle residence by day, with the pool and planted courtyard' })).toBeInTheDocument();
    expect(screen.getByText('The garden')).toBeInTheDocument();
    expect(container.querySelector('[aria-labelledby="oracle-independence"] img')).toHaveAttribute('src', '/home/oracle-sign.jpg');
    expect(container.innerHTML).not.toContain('/people/courtyard.jpg');
    expect(container.innerHTML).not.toContain('/people/lounge.jpg');
    expect(screen.getByRole('heading', { name: 'We take care of the rest.' })).toBeInTheDocument();
    expect(screen.getByText('Dining & Meals')).toBeInTheDocument();
    expect(screen.getByText('Security & Reassurance')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByRole('link', { name: 'Personal Services via Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByText('A new standard of living.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Independence comes first.' })).toBeInTheDocument();
    expect(screen.getByText('Independent adults who want privacy without isolation')).toBeInTheDocument();
    const visitLinks = screen.getAllByRole('link', { name: 'Arrange a private visit' });
    expect(visitLinks).toHaveLength(2);
    expect(visitLinks.every((link) => link.getAttribute('href') === '#oracle-visit')).toBe(true);
    expect(screen.getByText(/arranged separately/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Arrange a private visit' })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Arrange a private visit' })).toHaveAttribute('id', 'oracle-visit');
    expect(screen.queryByText(/international standard/i)).not.toBeInTheDocument();
  });

  it('calls a full Oracle list ten rooms and ten identities', () => {
    const names = ['Jade', 'Onyx', 'Ruby', 'Ivory', 'Coral', 'Pearl', 'Amber', 'Sapphire', 'Opal', 'Emerald'];
    render(
      <OracleView
        residence={{
          ...oracle,
          rooms: names.map((name) => ({ _key: name, name, house: null, summary: null, facts: [], image: null })),
        }}
        contact={contactFixture}
        mapsKey={null}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Ten Rooms. Ten Identities.' })).toBeInTheDocument();
    expect(screen.getByText(/Just ten individually designed private rooms/)).toBeInTheDocument();
  });

  it('adds Coral and Pearl to the old eight-name list', () => {
    const names = ['Jade', 'Onyx', 'Ruby', 'Ivory', 'Amber', 'Sapphire', 'Opal', 'Emerald'];
    render(
      <OracleView
        residence={{
          ...oracle,
          rooms: names.map((name) => ({ _key: name, name, house: null, summary: null, facts: [], image: imageFixture(name) })),
        }}
        contact={contactFixture}
        mapsKey={null}
      />,
    );
    const list = screen.getByRole('list', { name: 'Rooms' });
    expect([...list.querySelectorAll('li')].map((item) => item.querySelector('p')?.textContent)).toEqual([
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
    ]);
  });

  it('shows every named room in one filmstrip', () => {
    render(
      <OracleView
        residence={{
          ...oracle,
          rooms: [
            { _key: 'jade', name: 'Jade', house: 'House 1', summary: null, facts: [], image: imageFixture('Jade') },
            { _key: 'onyx', name: 'Onyx', house: 'House 1', summary: null, facts: [], image: imageFixture('Onyx') },
            { _key: 'pearl', name: 'Pearl', house: 'House 2', summary: null, facts: [], image: imageFixture('Pearl') },
          ],
        }}
        contact={contactFixture}
        mapsKey={null}
      />,
    );
    const list = screen.getByRole('list', { name: 'Rooms' });
    expect(list.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByText('Jade')).toBeInTheDocument();
    expect(screen.getByText('Onyx')).toBeInTheDocument();
    expect(screen.getByText('Pearl')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next rooms' })).toBeInTheDocument();
    expect(screen.queryByText('House 1')).not.toBeInTheDocument();
  });

  it('shows the coming-soon badge and does not describe a future Oracle as open', () => {
    render(
      <OracleView
        residence={{ ...oracle, status: 'coming-soon', comingSoonNote: 'Dates will be published only once confirmed.' }}
        contact={contactFixture}
        mapsKey={null}
      />,
    );
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText('Dates will be published only once confirmed.')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/now open|open now|is open/i);
  });
});
