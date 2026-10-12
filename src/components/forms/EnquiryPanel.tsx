'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { SiteContact } from '@/lib/contact';
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

  return (
    <EnquiryContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="enquiry-panel-title"
        className="m-0 w-full max-w-none border-0 bg-paper p-0 text-charcoal shadow-panel open:flex md:fixed md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[440px]"
        style={{ marginTop: 'auto' }}
        onClose={() => setRequest(null)}
      >
        <div className="flex max-h-[85vh] w-full flex-col overflow-y-auto p-6 md:max-h-none md:h-full">
          <div className="mb-4 flex justify-end">
            <button type="button" className="min-h-11 px-3 font-semibold text-green" onClick={() => dialogRef.current?.close()}>
              Close enquiry form
            </button>
          </div>
          {request ? <EnquiryForm key={`${request.kind}:${request.context}`} kind={request.kind} context={request.context} headingId="enquiry-panel-title" /> : null}
          <p className="mt-6 text-[15px]">
            Or call <a href={`tel:${contact.phone}`}>{contact.phoneDisplay}</a>
          </p>
        </div>
      </dialog>
    </EnquiryContext.Provider>
  );
}

export function EnquiryButton({ kind, context, children }: { kind: FormKind; context: string; children: ReactNode }) {
  const { open } = useEnquiry();
  return (
    <button type="button" className="inline-flex min-h-11 items-center rounded-full bg-green px-5 font-semibold text-ivory" onClick={() => open(kind, context)}>
      {children}
    </button>
  );
}
