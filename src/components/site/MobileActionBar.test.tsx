import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MobileActionBar } from './MobileActionBar';
import { contactFixture } from '@/test/contact-fixture';

describe('MobileActionBar', () => {
  it('renders Call and WhatsApp with page context', () => {
    render(<MobileActionBar contact={contactFixture} context="Tranquility" />);
    expect(screen.getByRole('link', { name: 'Call' })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Tranquility'));
  });
});
