import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CtaBand } from './CtaBand';

describe('CtaBand', () => {
  it('renders the heading and whatever actions the page passes', () => {
    render(
      <CtaBand heading="Talk to a person" body="Call, WhatsApp or send a short note.">
        <button type="button">Enquire</button>
      </CtaBand>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Talk to a person' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enquire' })).toBeInTheDocument();
  });
});
