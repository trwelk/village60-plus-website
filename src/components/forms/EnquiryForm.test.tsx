import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { initialEnquiryState } from '@/lib/forms/process';
import { EnquiryForm } from './EnquiryForm';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
}));

describe('EnquiryForm', () => {
  it('renders the general fields with visible labels and a honeypot', async () => {
    const { container } = render(<EnquiryForm kind="general" context="Home" />);
    expect(screen.getByRole('heading', { name: 'Talk to the team' })).toBeInTheDocument();
    expect(screen.getByLabelText('Your name')).toBeRequired();
    expect(screen.getByLabelText('Phone or WhatsApp')).toHaveAttribute('autocomplete', 'tel');
    expect(screen.getByLabelText('I am enquiring about')).toBeInTheDocument();
    expect(screen.getByLabelText(/privacy notice/i)).toHaveAttribute('type', 'checkbox');
    expect(screen.getByRole('link', { name: 'privacy notice' })).toHaveAttribute('href', '/privacy');
    const trap = container.querySelector('input[name="company"]');
    expect(trap).toHaveAttribute('tabindex', '-1');
    expect(trap).toHaveAttribute('autocomplete', 'off');
    expect(container.querySelector('input[name="kind"]')).toHaveValue('general');
    expect(container.querySelector('input[name="context"]')).toHaveValue('Home');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the Oracle visit fields, including date and visitors', () => {
    render(<EnquiryForm kind="oracle-visit" context="Oracle" />);
    expect(screen.getByLabelText('Preferred date')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Number of visitors')).toBeInTheDocument();
    expect(screen.queryByLabelText('I am enquiring about')).not.toBeInTheDocument();
  });

  it('states that Find the Right Care is not a medical assessment', () => {
    render(<EnquiryForm kind="find-care" context="Find the Right Care" />);
    expect(screen.getByText(/not a medical assessment/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/diagnosis/i)).not.toBeInTheDocument();
  });
});

describe('EnquiryForm feedback', () => {
  it('moves focus to the error summary when the action returns field errors', async () => {
    const { submitEnquiry } = await import('@/lib/forms/submit');
    vi.mocked(submitEnquiry).mockResolvedValue({
      ...initialEnquiryState,
      status: 'error',
      values: { name: 'Nimal' },
      fieldErrors: { phone: 'Enter a phone number we can call or message on WhatsApp.' },
      formErrors: ['Please check the highlighted fields.'],
    });
    render(<EnquiryForm kind="general" context="Home" />);
    await userEvent.type(screen.getByLabelText('Your name'), 'Nimal');
    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
    const summary = await screen.findByRole('alert');
    expect(summary).toHaveFocus();
    expect(summary).toHaveTextContent('Please check the highlighted fields.');
    expect(screen.getByLabelText('Your name')).toHaveValue('Nimal');
    expect(screen.getByText('Enter a phone number we can call or message on WhatsApp.')).toBeInTheDocument();
  });

  it('shows what was submitted after a successful send', async () => {
    const { submitEnquiry } = await import('@/lib/forms/submit');
    vi.mocked(submitEnquiry).mockResolvedValue({
      ...initialEnquiryState,
      status: 'success',
      values: { name: 'Nimal Perera', topic: 'oracle', whoFor: 'parent' },
      whatsappHref: 'https://wa.me/94741003994?text=Hello',
      responseTime: 'within one working day',
    });
    render(<EnquiryForm kind="general" context="Home" />);
    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Nimal Perera');
    expect(status).toHaveTextContent('Oracle');
  });
});
