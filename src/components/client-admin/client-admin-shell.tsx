"use client";

import type { ReactNode } from "react";
import { ClientAdminHeader } from "./client-admin-header";
import { ClientAdminSidebar } from "./client-admin-sidebar";
import { useActor } from "@/lib/admin/identity";
import { EmailVerificationBanner } from "@/components/common/email-verification-banner";

export function ClientAdminShell({ children }: { children: ReactNode }) {
  const actor = useActor();

  return (
    <div className="flex min-h-screen bg-slate-100/70">
      <ClientAdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <ClientAdminHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 p-6 sm:p-8">
          <EmailVerificationBanner actor={actor} />
          {children}
        </main>
      </div>
    </div>
  );
}
