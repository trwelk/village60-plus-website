import { describe, expect, it } from 'vitest';
import { resolvePreviewRequest } from './preview';

const SECRET = 'correct-horse-battery-staple';

describe('resolvePreviewRequest', () => {
  it('rejects a missing or wrong secret with 401', () => {
    expect(resolvePreviewRequest(new URL('http://x/api/draft-mode/enable'), SECRET)).toEqual({ ok: false, status: 401 });
    expect(resolvePreviewRequest(new URL('http://x/api/draft-mode/enable?secret=nope'), SECRET)).toEqual({ ok: false, status: 401 });
  });
  it('rejects when the server has no secret configured', () => {
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}`), undefined)).toEqual({ ok: false, status: 401 });
  });
  it('only redirects to same-origin paths', () => {
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}&slug=https://evil.example`), SECRET)).toEqual({ ok: false, status: 400 });
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}&slug=//evil.example`), SECRET)).toEqual({ ok: false, status: 400 });
  });
  it('defaults to the home page and otherwise honours the slug', () => {
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}`), SECRET)).toEqual({ ok: true, redirectTo: '/' });
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}&slug=/homes/serenity`), SECRET)).toEqual({ ok: true, redirectTo: '/homes/serenity' });
  });
});
