import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import type { ClientLayoutProps } from "@/types/client";

export default async function AdminRootLayout({
  children,
}: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100/70">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
