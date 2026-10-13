import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileActionBar } from './MobileActionBar';
import { contactFixture } from '@/test/contact-fixture';

vi.mock('next/navigation', () => ({
  usePathname: () => '/homes/tranquility',
}));

describe('MobileActionBar', () => {
  it('builds WhatsApp context from the path and leaves Call unchanged', () => {
    render(<MobileActionBar contact={contactFixture} />);
    expect(screen.getByRole('link', { name: 'Call' })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Tranquility'));
  });
});
