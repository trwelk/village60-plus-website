'use client';

import { type FocusEvent, useEffect, useId, useRef } from 'react';
import { dispatchTrack } from '@/lib/analytics';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { formDefinition, summaryLines } from '@/lib/forms/definitions';
import type { FormKind } from '@/lib/forms/kinds';
import { initialEnquiryState } from '@/lib/forms/process';
import { submitEnquiry } from '@/lib/forms/submit';
import { Field } from './Field';

export function EnquiryForm({
  kind,
  context,
  defaults,
  headingId,
}: {
  kind: FormKind;
  context: string;
  defaults?: Record<string, string>;
  headingId?: string;
}) {
  const definition = formDefinition(kind);
  const [state, action, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const summaryRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const formKey = useId();

  function onFocusCapture(event: FocusEvent<HTMLFormElement>) {
    if (started.current) return;
    if (event.currentTarget.closest('dialog')) return;
    started.current = true;
    dispatchTrack('enquiry_open');
  }

  useEffect(() => {
    if (state.status === 'error' || state.status === 'delivery-failed') {
      summaryRef.current?.focus();
      dispatchTrack('form_error');
    }
    if (state.status === 'success') {
      dispatchTrack('enquiry_submit');
    }
  }, [state]);

  if (state.status === 'success') {
    return (
      <div role="status" className="flex flex-col gap-4">
        <h2 className="text-[28px]">Thank you. We will be in touch.</h2>
        <p>A member of the Village 60 Plus team will contact you {state.responseTime ?? 'as soon as we can'}.</p>
        <ul>
          {summaryLines(kind, state.values).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {state.whatsappHref ? (
          <Button href={state.whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
            Continue on WhatsApp
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate onFocusCapture={onFocusCapture}>
      <h2 id={headingId ?? formKey} className="text-[28px]">
        {definition.heading}
      </h2>
      <p className="max-w-prose-site">{definition.intro}</p>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="context" value={context} />
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.formErrors.length > 0 ? (
        <div ref={summaryRef} id={`${formKey}-errors`} tabIndex={-1} role="alert" className="rounded-input border border-error bg-paper p-4">
          <p className="font-semibold text-error">{state.formErrors[0]}</p>
          {state.status === 'delivery-failed' && state.whatsappHref ? (
            <p className="mt-3">
              <a href={state.whatsappHref}>Continue on WhatsApp</a>
            </p>
          ) : null}
        </div>
      ) : null}
      {definition.fields.map((field) => (
        <Field
          key={field.name}
          idPrefix={formKey}
          field={field}
          error={state.fieldErrors[field.name]}
          defaultValue={state.values[field.name] || (state.status === 'idle' ? defaults?.[field.name] : undefined)}
        />
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? 'Sending…' : definition.submitLabel}
      </Button>
    </form>
  );
}
