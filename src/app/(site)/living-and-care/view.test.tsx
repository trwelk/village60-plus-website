import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LivingCareView } from './view';

describe('LivingCareView', () => {
  it('opens with the five care choices, then everyday support', () => {
    render(<LivingCareView />);

    const title = screen.getByRole('heading', { level: 1, name: 'Support That Changes With You.' });
    const services = screen.getByRole('heading', { name: 'Different Ways to Live. The Support You Need.' });
    const independent = screen.getByRole('heading', { name: 'Independent Living' });
    const residential = screen.getByRole('heading', { name: 'Residential Living & Care' });
    const respite = screen.getByRole('heading', { name: 'Respite Care' });
    const recovery = screen.getByRole('heading', { name: 'Post-Hospital Recovery' });
    const rehabilitation = screen.getByRole('heading', { name: 'Rehabilitation Support' });
    const more = screen.getByRole('heading', { name: 'More Than a Room.' });
    const food = screen.getByRole('heading', { name: 'Good Food Is Part of Good Living.' });
    const health = screen.getByRole('heading', { name: 'Your Health Matters.' });
    const active = screen.getByRole('heading', { name: 'Live Well. Stay Active.' });

    expect(title.compareDocumentPosition(services) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(services.compareDocumentPosition(independent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(independent.compareDocumentPosition(residential) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(residential.compareDocumentPosition(respite) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(respite.compareDocumentPosition(recovery) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(recovery.compareDocumentPosition(rehabilitation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(rehabilitation.compareDocumentPosition(more) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(more.compareDocumentPosition(food) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(food.compareDocumentPosition(health) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(health.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(screen.getByRole('link', { name: /Independent Living A comfortable/ })).toHaveAttribute('href', '/living-and-care/independent-living');
    expect(screen.getByRole('link', { name: /Rehabilitation Support Helping you regain/ })).toHaveAttribute('href', '/living-and-care/rehabilitation');
    expect(screen.getByRole('link', { name: 'Explore our services' })).toHaveAttribute('href', '#our-services');
    expect(screen.getByRole('link', { name: 'Find the right care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(screen.getByRole('link', { name: 'Personal Services via Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.body.textContent).not.toMatch(/guarantee|best|number one/i);
  });
});
