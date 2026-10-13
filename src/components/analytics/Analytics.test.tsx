import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchTrack } from '@/lib/analytics';
import { Analytics } from './Analytics';

vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => <div data-testid="ga">{gaId}</div>,
  sendGAEvent: vi.fn(),
}));

import { sendGAEvent } from '@next/third-parties/google';

describe('Analytics', () => {
  beforeEach(() => {
    vi.mocked(sendGAEvent).mockClear();
    document.cookie = 'v60-consent=; Path=/; Max-Age=0';
  });

  it('shows Accept and Reject and does not load GA before a choice', async () => {
    render(<Analytics gaId="G-TEST" />);
    expect(await screen.findByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
    expect(screen.queryByTestId('ga')).not.toBeInTheDocument();
  });

  it('loads GA after Accept and sends only the event name', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Analytics gaId="G-TEST" />
        <a href="tel:+94112504838" data-track="call_click">
          Call
        </a>
      </>,
    );
    await user.click(await screen.findByRole('button', { name: 'Accept' }));
    expect(await screen.findByTestId('ga')).toHaveTextContent('G-TEST');
    expect(document.cookie).toContain('v60-consent=accepted');
    await user.click(screen.getByRole('link', { name: 'Call' }));
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'call_click');
    expect(vi.mocked(sendGAEvent).mock.calls[0]).toHaveLength(2);
  });

  it('leaves GA unloaded after Reject', async () => {
    const user = userEvent.setup();
    render(<Analytics gaId="G-TEST" />);
    await user.click(await screen.findByRole('button', { name: 'Reject' }));
    await waitFor(() => expect(document.cookie).toContain('v60-consent=rejected'));
    expect(screen.queryByTestId('ga')).not.toBeInTheDocument();
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it('ignores a data-track value that is not an allow-listed event', async () => {
    document.cookie = 'v60-consent=accepted';
    const user = userEvent.setup();
    render(
      <>
        <Analytics gaId="G-TEST" />
        <button type="button" data-track="visitor@example.com">
          Bad
        </button>
      </>,
    );
    await screen.findByTestId('ga');
    await user.click(screen.getByRole('button', { name: 'Bad' }));
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it('forwards form_error from dispatchTrack and not the message', async () => {
    document.cookie = 'v60-consent=accepted';
    render(<Analytics gaId="G-TEST" />);
    await screen.findByTestId('ga');
    dispatchTrack('form_error');
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'form_error');
    expect(vi.mocked(sendGAEvent).mock.calls[0]).toHaveLength(2);
  });
});
