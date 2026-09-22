"use client";

import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { useClientDashboard } from "@/lib/client-admin";

export function CreatorHeader({ title, description }: { title: string; description?: string }) {
  const { organization } = useClientDashboard();
  const slug = organization.slug;

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
            <Sparkles className="h-3 w-3" /> Creator Studio
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/client/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
        >
          View Public Page <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </Link>
        <Link
          href={`/client/${slug}/public/membership`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition-colors"
        >
          Membership View <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
