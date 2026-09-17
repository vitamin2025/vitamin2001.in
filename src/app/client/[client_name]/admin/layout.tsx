import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/admin";
import { SYSTEM_ORG_SLUG } from "@/lib/admin";
import type { ClientLayoutProps } from "@/types/client";

export const metadata: Metadata = {
  title: "Client Admin",
  robots: { index: false, follow: false },
};

export default async function ClientAdminLayout({
  children,
  params,
}: ClientLayoutProps) {
  const { client_name } = await params;
  if (client_name.toLowerCase() === SYSTEM_ORG_SLUG) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {children}
      <Toaster />
    </div>
  );
}
