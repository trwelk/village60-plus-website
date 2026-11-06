import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { LivingCareView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

HTMLDialogElement.prototype.showModal = vi.fn(function show(this: HTMLDialogElement) {
  this.open = true;
});

const EVERYDAY_HEADINGS = [
  'Everyday Living at Village 60 Plus',
  'Social Life & Community Activities',
  'Celebrations & Events Calendar',
  'Dining & Refreshments',
  'Activities, Fitness & Recreation',
  'Personal Care & Grooming',
  'Hospitality & Housekeeping',
  'Medical & Wellness Coordination',
  'Transport & Personal Concierge',
  'Family & Special Arrangements',
  'Our Residential & Care Options',
];

function renderPage() {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <LivingCareView />
    </EnquiryProvider>,
  );
}

describe('LivingCareView', () => {
  it('opens with the five care choices, then the everyday living sections', async () => {
    renderPage();

    const title = screen.getByRole('heading', { level: 1, name: 'Support That Changes With You.' });
    const services = screen.getByRole('heading', { name: 'Different Ways to Live. The Support You Need.' });
    const independent = screen.getByRole('heading', { name: 'Independent Living' });
    const residential = screen.getByRole('heading', { name: 'Residential Living & Care' });
    const respite = screen.getByRole('heading', { name: 'Respite Care' });
    const recovery = screen.getByRole('heading', { name: 'Post-Hospital Recovery' });
    const rehabilitation = screen.getByRole('heading', { name: 'Rehabilitation Support' });
    const everyday = EVERYDAY_HEADINGS.map((name) => screen.getByRole('heading', { name }));

    expect(title.compareDocumentPosition(services) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(services.compareDocumentPosition(independent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(independent.compareDocumentPosition(residential) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(residential.compareDocumentPosition(respite) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(respite.compareDocumentPosition(recovery) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(recovery.compareDocumentPosition(rehabilitation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(rehabilitation.compareDocumentPosition(everyday[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    for (let i = 0; i < everyday.length - 1; i += 1) {
      expect(everyday[i].compareDocumentPosition(everyday[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }

    expect(screen.getByText('Weekly social gatherings and resident meet-ups')).toBeInTheDocument();
    expect(screen.getByText("International Day of Older Persons – Elders' Day")).toBeInTheDocument();
    expect(screen.getByText('Daily freshly prepared meals')).toBeInTheDocument();
    expect(screen.getByText('Gentle exercise sessions')).toBeInTheDocument();
    expect(screen.getByText('Haircuts and hairdressing appointments')).toBeInTheDocument();
    expect(screen.getByText('Regular room cleaning')).toBeInTheDocument();
    expect(screen.getByText('Medication assistance and administration according to care plans')).toBeInTheDocument();
    expect(screen.getByText('Transportation for medical appointments')).toBeInTheDocument();
    expect(screen.getByText('Special family lunches')).toBeInTheDocument();
    expect(screen.getByText('Couple accommodation, where available')).toBeInTheDocument();
    expect(screen.getByText('Services and activities vary according to the residence, availability and individual care requirements.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: "Discover What's Available" })).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Independent Living A comfortable/ })).toHaveAttribute('href', '/living-and-care/independent-living');
    expect(screen.getByRole('link', { name: /Rehabilitation Support Helping you regain/ })).toHaveAttribute('href', '/living-and-care/rehabilitation');
    expect(screen.getByRole('link', { name: 'Explore our services' })).toHaveAttribute('href', '#our-services');
    expect(screen.getByRole('link', { name: 'Find the right care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(screen.getByRole('link', { name: 'See care options' })).toHaveAttribute('href', '#our-services');
    expect(screen.queryByRole('heading', { name: 'Talk to the team' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Ask about transport' }));
    expect(screen.getByRole('heading', { name: 'Talk to the team' })).toBeInTheDocument();
    expect(document.querySelector('input[name="context"]')).toHaveValue('Living & Care: Transport & Personal Concierge');
    expect(screen.getByRole('link', { name: /Our Homes\s*Inspired Living/ })).toHaveAttribute('href', '/homes');
    expect(screen.getByRole('link', { name: /Platinum 60\s*Personal Concierge/ })).toHaveAttribute('href', '#transport');
    expect(screen.getByRole('link', { name: /Silver Roots\s*Family Connection/ })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByRole('link', { name: /Destination Retirement\s*Explore More/ })).toHaveAttribute('href', '/destination-retirement');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.body.textContent).not.toMatch(/guarantee|best|number one/i);
  }, 20000);
});
