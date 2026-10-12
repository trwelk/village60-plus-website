import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a pill button with primary styling by default', () => {
    render(<Button>Call us</Button>);
    const button = screen.getByRole('button', { name: 'Call us' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('rounded-full');
    expect(button.className).toContain('bg-green');
    expect(button.className).toContain('min-h-11'); // 44px touch target
  });

  it('renders an anchor when href is provided', () => {
    render(
      <Button href="tel:+94112504838" variant="secondary">
        Call
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Call' });
    expect(link).toHaveAttribute('href', 'tel:+94112504838');
    expect(link.className).toContain('border-green');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button variant="text">Learn more</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
