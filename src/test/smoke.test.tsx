import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

describe('test toolchain', () => {
  it('renders DOM, supports jest-dom and axe', async () => {
    const { container } = render(
      <main>
        <h1>Village 60 Plus</h1>
      </main>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Village 60 Plus');
    expect(await axe(container)).toHaveNoViolations();
  });
});
