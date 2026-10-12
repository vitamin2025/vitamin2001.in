import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const controlClass =
  "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-(--shop-accent) focus:ring-2 focus:ring-(--shop-accent-ring) disabled:bg-slate-50 disabled:text-slate-500";

interface FieldShellProps {
  readonly label: string;
  readonly error?: string;
  readonly hint?: ReactNode;
  readonly optional?: boolean;
  readonly className?: string;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  className,
  children,
}: FieldShellProps & { id: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-rose-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  optional,
  className,
  ...input
}: FieldShellProps & Omit<InputHTMLAttributes<HTMLInputElement>, "className">) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, error ? "border-rose-400" : "border-slate-300")}
        {...input}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  optional,
  className,
  children,
  ...select
}: FieldShellProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, "pr-8", error ? "border-rose-400" : "border-slate-300")}
        {...select}
      >
        {children}
      </select>
    </FieldShell>
  );
}

/** A form-level error from the API. */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
      {children}
    </div>
  );
}
