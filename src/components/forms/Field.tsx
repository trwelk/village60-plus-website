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
        ? 'mt-1 size-5'
        : 'w-full rounded-input border border-stone bg-paper px-3 py-2.5 text-charcoal',
  } as const;

  let control;
  if (field.type === 'textarea') {
    control = <textarea {...common} rows={4} />;
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
    <div className={field.type === 'checkbox' ? 'flex items-start gap-3' : 'flex flex-col gap-1.5'}>
      {field.type === 'checkbox' ? control : null}
      <label htmlFor={id} className="font-semibold">
        {field.name === 'privacy' ? (
          <>
            I have read the <a href="/privacy">privacy notice</a> and agree to be contacted about this enquiry.
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
