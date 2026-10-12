import Link from "next/link";
import type { ReactNode } from "react";
import { Store } from "lucide-react";
import { mainSiteUrl } from "./site-links";

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      {icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--shop-accent-soft,#eef2ff) text-(--shop-accent,#4f46e5)">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {children && <div className="mt-2 text-sm leading-relaxed text-slate-500">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** The seller was removed from the marketplace. */
export function StoreClosed({ name }: { name: string }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
      <EmptyState icon={<Store className="h-7 w-7" />} title="This shop is closed">
        <p>{name} is no longer selling here.</p>
        <p className="mt-4">
          <Link href={mainSiteUrl("/")} className="font-medium text-indigo-600 hover:underline">
            Go to vitamin2001.in
          </Link>
        </p>
      </EmptyState>
    </div>
  );
}
