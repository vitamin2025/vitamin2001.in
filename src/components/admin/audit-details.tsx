export function AuditDetails({
  details,
}: {
  details: Readonly<Record<string, unknown>> | null;
}) {
  if (!details || Object.keys(details).length === 0) {
    return <span className="text-slate-400">—</span>;
  }
  return (
    <details>
      <summary className="cursor-pointer text-xs text-slate-500">Details</summary>
      <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-50 p-2 text-[11px] text-slate-700">
        {JSON.stringify(details, null, 2)}
      </pre>
    </details>
  );
}
