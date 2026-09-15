export function AdminHeader({ title }: { title?: string }) {
  return (
    <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6">
      <p className="text-sm font-medium text-slate-700">
        {title ?? "Super-admin console"}
      </p>
    </header>
  );
}
