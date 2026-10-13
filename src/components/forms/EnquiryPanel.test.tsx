import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryButton, EnquiryProvider } from './EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

HTMLDialogElement.prototype.showModal = vi.fn(function show(this: HTMLDialogElement) {
  this.open = true;
});
HTMLDialogElement.prototype.close = vi.fn(function hide(this: HTMLDialogElement) {
  this.open = false;
});

describe('EnquiryPanel', () => {
  it('opens the general form from the trigger and closes from the Close button', async () => {
    render(
      <EnquiryProvider contact={contactFixture}>
        <EnquiryButton kind="general" context="Home">Enquire</EnquiryButton>
      </EnquiryProvider>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Enquire' }));
    expect(screen.getByRole('heading', { name: 'Talk to the team' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close enquiry form' }));
    expect(screen.queryByRole('heading', { name: 'Talk to the team' })).not.toBeInTheDocument();
  });

  it('opens the Oracle visit form when asked', async () => {
    render(
      <EnquiryProvider contact={contactFixture}>
        <EnquiryButton kind="oracle-visit" context="Oracle">Arrange a private visit</EnquiryButton>
      </EnquiryProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Arrange a private visit' }));
    expect(screen.getByRole('heading', { name: 'Arrange a private visit' })).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred date')).toBeInTheDocument();
  });
});
