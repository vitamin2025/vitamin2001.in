"use client";

import type { ReactNode } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100/70">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
