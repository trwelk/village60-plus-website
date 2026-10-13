'use client';

import { type FocusEvent, type ReactNode, useEffect, useId, useRef } from 'react';
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
  layout = 'stack',
  eyebrow,
  note,
  asideExtra,
}: {
  kind: FormKind;
  context: string;
  defaults?: Record<string, string>;
  headingId?: string;
  /** `aside` places the heading beside a field card. Used at the end of Oracle. */
  layout?: 'stack' | 'aside';
  /** Bronze kicker above the heading when `layout` is `aside`. */
  eyebrow?: string;
  /** Extra line under the intro when `layout` is `aside`. */
  note?: string;
  /** Secondary action under the intro when `layout` is `aside`. */
  asideExtra?: ReactNode;
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
        <h2 className="text-[30px] leading-[1.15]">Thank you. We will be in touch.</h2>
        <p className="text-[17px] leading-relaxed">A member of the Village 60 Plus team will contact you {state.responseTime ?? 'as soon as we can'}.</p>
        <ul className="flex list-none flex-col gap-1 p-0 text-[16px] leading-snug">
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

  const aside = layout === 'aside';
  const narrowCount = definition.fields.filter((field) => field.type !== 'textarea' && field.type !== 'checkbox').length;
  let narrowSeen = 0;
  const fields = definition.fields.map((field) => {
    const isNarrow = field.type !== 'textarea' && field.type !== 'checkbox';
    if (isNarrow) narrowSeen += 1;
    const orphan = isNarrow && narrowCount % 2 === 1 && narrowSeen === narrowCount;
    const wide = !isNarrow || orphan;
    return (
      <div key={field.name} className={aside && wide ? 'sm:col-span-2' : undefined}>
        <Field
          idPrefix={formKey}
          field={field}
          error={state.fieldErrors[field.name]}
          defaultValue={state.values[field.name] || (state.status === 'idle' ? defaults?.[field.name] : undefined)}
        />
      </div>
    );
  });
  const errors =
    state.formErrors.length > 0 ? (
      <div ref={summaryRef} id={`${formKey}-errors`} tabIndex={-1} role="alert" className="rounded-input border border-error bg-paper p-4 sm:col-span-2">
        <p className="font-semibold text-error">{state.formErrors[0]}</p>
        {state.status === 'delivery-failed' && state.whatsappHref ? (
          <p className="mt-3">
            <a href={state.whatsappHref} className="font-semibold text-green underline decoration-gold underline-offset-4 hover:decoration-green">Continue on WhatsApp</a>
          </p>
        ) : null}
      </div>
    ) : null;

  return (
    <form
      action={action}
      className={aside ? 'relative grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-x-16 lg:gap-y-0' : 'relative flex flex-col gap-5'}
      noValidate
      onFocusCapture={onFocusCapture}
    >
      <div className={aside ? 'max-w-prose-site lg:sticky lg:top-8 lg:self-start' : 'flex max-w-prose-site flex-col gap-3'}>
        {aside && eyebrow ? <p className="mb-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-bronze">{eyebrow}</p> : null}
        <h2 id={headingId ?? formKey} className={aside ? 'scroll-mt-8' : 'text-[30px] leading-[1.15]'}>
          {definition.heading}
        </h2>
        <p className={aside ? 'mt-4' : 'text-[17px] leading-relaxed'}>{definition.intro}</p>
        {aside && note ? <p className="mt-6 border-t border-stone pt-6 text-[16px] leading-relaxed">{note}</p> : null}
        {aside && asideExtra ? <div className="mt-8">{asideExtra}</div> : null}
      </div>
      <div hidden>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="context" value={context} />
      </div>
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {aside ? (
        <div className="rounded-panel border border-stone bg-ivory p-6 shadow-panel sm:p-8">
          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            {errors}
            {fields}
            <div className="pt-1 sm:col-span-2">
              <Button type="submit" disabled={pending}>
                {pending ? 'Sending…' : definition.submitLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {errors}
          {fields}
          <Button type="submit" disabled={pending} className="self-start">
            {pending ? 'Sending…' : definition.submitLabel}
          </Button>
        </>
      )}
    </form>
  );
}
