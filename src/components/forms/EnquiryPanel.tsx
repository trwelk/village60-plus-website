'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { telHref, type SiteContact } from '@/lib/contact';
import type { FormKind } from '@/lib/forms/kinds';
import { EnquiryForm } from './EnquiryForm';

type EnquiryContextValue = {
  open: (kind: FormKind, context: string) => void;
  close: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry(): EnquiryContextValue {
  const value = useContext(EnquiryContext);
  if (!value) throw new Error('useEnquiry must be used inside EnquiryProvider');
  return value;
}

export function EnquiryProvider({ contact, children }: { contact: SiteContact; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [request, setRequest] = useState<{ kind: FormKind; context: string } | null>(null);

  const api: EnquiryContextValue = {
    open: (kind, context) => {
      setRequest({ kind, context });
      dialogRef.current?.showModal();
    },
    close: () => dialogRef.current?.close(),
  };

  useEffect(() => {
    if (!request) return;
    const root = document.documentElement;
    const previousBody = document.body.style.overflow;
    const previousRoot = root.style.overflow;
    document.body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBody;
      root.style.overflow = previousRoot;
    };
  }, [request]);

  return (
    <EnquiryContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="enquiry-panel-title"
        className="enquiry-panel"
        onClose={() => setRequest(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-end border-b border-stone px-5 py-2 sm:px-8">
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-green transition-colors duration-(--duration-fast) hover:bg-mist"
              onClick={() => dialogRef.current?.close()}
            >
              <span className="visually-hidden">Close enquiry form</span>
              <span aria-hidden="true" className="inline-flex items-center gap-2">
                Close
                <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10">
            {request ? <EnquiryForm key={`${request.kind}:${request.context}`} kind={request.kind} context={request.context} headingId="enquiry-panel-title" /> : null}
            {contact.phone ? (
              <p className="mt-8 border-t border-stone pt-6 text-[16px] leading-relaxed">
                Or call{' '}
                <a href={telHref(contact.phone)} className="font-semibold text-green underline decoration-gold underline-offset-4 hover:decoration-green">
                  {contact.phoneDisplay}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </dialog>
    </EnquiryContext.Provider>
  );
}

export function EnquiryButton({
  kind,
  context,
  children,
  tone = 'solid',
  className: classNameProp,
}: {
  kind: FormKind;
  context: string;
  children: ReactNode;
  tone?: 'solid' | 'secondary' | 'overlay' | 'text' | 'on-dark' | 'rule' | 'hero';
  /** When set, replaces the tone classes for a one-off treatment. */
  className?: string;
}) {
  const { open } = useEnquiry();
  const className = classNameProp ?? (
    tone === 'overlay'
      ? 'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] border border-pale-gold bg-transparent px-4 text-[13px] font-semibold tracking-[0.14em] text-ivory uppercase transition-colors duration-(--duration-fast) hover:bg-white/10 xl:px-5'
      : tone === 'hero'
        ? 'inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] border border-ivory/75 bg-transparent px-5 text-[13px] font-semibold tracking-[0.12em] text-ivory uppercase transition-colors duration-(--duration-fast) hover:bg-white/10'
      : tone === 'text'
        ? 'inline-flex min-h-11 items-center font-semibold text-green underline decoration-gold underline-offset-4 transition-colors duration-(--duration-fast) hover:decoration-green'
        : tone === 'secondary'
          ? 'inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-green bg-transparent px-5 text-[17px] font-semibold text-green transition-colors duration-(--duration-fast) hover:bg-mist'
          : tone === 'on-dark'
            ? 'inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-ivory bg-transparent px-7 py-3.5 text-[18px] font-semibold text-ivory transition-colors duration-(--duration-fast) hover:bg-white/10'
            : tone === 'rule'
              ? 'inline-flex min-h-12 w-full items-center justify-between gap-3 border-t border-charcoal bg-transparent px-4 py-3 text-left text-[15px] font-semibold text-charcoal transition-colors duration-(--duration-fast) hover:bg-charcoal hover:text-ivory sm:border-t-0 sm:border-l'
              : 'inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-green px-5 text-[17px] font-semibold text-ivory transition-colors duration-(--duration-fast) hover:bg-night');
  return (
    <button type="button" className={className} data-track="enquiry_open" onClick={() => open(kind, context)}>
      {children}
    </button>
  );
}
