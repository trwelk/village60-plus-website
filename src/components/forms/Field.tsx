import type { FieldDef } from '@/lib/forms/definitions';

export function Field({ field, error, defaultValue, idPrefix }: { field: FieldDef; error?: string; defaultValue?: string; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = errorId;
  const common = {
    id,
    name: field.name,
    required: field.required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    defaultValue: field.type === 'checkbox' ? undefined : defaultValue,
    maxLength: field.maxLength,
    autoComplete: field.autocomplete,
    className:
      field.type === 'checkbox'
        ? 'mt-0.5 size-5 shrink-0 accent-green'
        : field.type === 'select'
          ? 'field-select min-h-11 w-full appearance-none rounded-input border border-stone bg-paper px-3.5 py-2.5 pr-10 text-[17px] leading-normal outline-offset-2 focus-visible:border-green focus-visible:outline-2 focus-visible:outline-green aria-invalid:border-error'
          : 'min-h-11 w-full rounded-input border border-stone bg-paper px-3.5 py-2.5 text-[17px] leading-normal text-charcoal outline-offset-2 focus-visible:border-green focus-visible:outline-2 focus-visible:outline-green aria-invalid:border-error',
  } as const;

  let control;
  if (field.type === 'textarea') {
    control = <textarea {...common} rows={5} className={`${common.className} min-h-32 resize-y leading-relaxed`} />;
  } else if (field.type === 'select') {
    control = (
      <select {...common} defaultValue={defaultValue ?? ''}>
        <option value="">Choose one</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'checkbox') {
    control = <input {...common} type="checkbox" value="on" defaultChecked={defaultValue === 'on'} />;
  } else {
    control = <input {...common} type={field.type} />;
  }

  return (
    <div className={field.type === 'checkbox' ? 'flex items-start gap-3' : 'flex flex-col gap-2'}>
      {field.type === 'checkbox' ? control : null}
      <label htmlFor={id} className={field.type === 'checkbox' ? 'text-[16px] leading-snug' : 'font-semibold leading-snug'}>
        {field.name === 'privacy' ? (
          <>
            I have read the <a href="/privacy" className="text-green underline decoration-gold underline-offset-4 hover:decoration-green">privacy notice</a> and agree to be contacted about this enquiry.
          </>
        ) : (
          field.label
        )}
      </label>
      {field.type === 'checkbox' ? null : control}
      {error ? (
        <p id={errorId} className="text-[15px] font-semibold text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
