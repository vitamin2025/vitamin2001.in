"use client";

import { useClientDashboard } from "@/lib/client-admin";

export function ClientAdminHeader() {
  const dashboard = useClientDashboard();

  return (
    <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6">
      <p className="text-sm font-medium text-slate-700">
        {dashboard.organization.name} admin
      </p>
    </header>
  );
}
