import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { LivingCareView } from './view';

const body = [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text: 'Meals are discussed with the resident.', marks: [] }] },
];

describe('LivingCareView', () => {
  it('lists care cards before everyday sections and links the not-the-right-fit block', () => {
    render(
      <LivingCareView
        title="Living and care"
        intro="Plain explanations of the kinds of support."
        services={[
          { _id: 'care.rehabilitation', name: 'Rehabilitation', slug: 'rehabilitation', status: 'available', summary: 'A structured programme.', heroImage: null },
          { _id: 'care.independent-living', name: 'Independent Living', slug: 'independent-living', status: 'available', summary: 'Your own routine.', heroImage: null },
        ]}
        sections={[{ _key: 'meals', heading: 'Meals and dining', body, tone: 'night' }]}
        contact={contactFixture}
      />,
    );
    const independent = screen.getByRole('heading', { name: 'Independent Living' });
    const rehabilitation = screen.getByRole('heading', { name: 'Rehabilitation' });
    const meals = screen.getByRole('heading', { name: 'Meals and dining' });
    const unfit = screen.getByRole('heading', { name: 'When Village 60 Plus is not the right fit' });
    expect(independent.compareDocumentPosition(rehabilitation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(rehabilitation.compareDocumentPosition(meals) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(meals.compareDocumentPosition(unfit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByRole('link', { name: 'Find the Right Care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(document.body.textContent).not.toMatch(/guarantee|best|number one/i);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
