"use client";

import { useLinktreePage } from "@/lib/client-admin";
import { PageHeaderActions } from "./page-header-actions";
import { LinktreeSubNav } from "./linktree-sub-nav";

export function LinktreeHeader() {
  const { item: page } = useLinktreePage();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {page?.title ? `${page.title} — Bio Links` : "Linktree Bio Page"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and organize your bio links, customize page styling, and track visitor clicks.
          </p>
        </div>
        <PageHeaderActions page={page} />
      </div>

      <LinktreeSubNav />
    </div>
  );
}
