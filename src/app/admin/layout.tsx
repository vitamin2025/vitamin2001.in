import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/admin";

export const metadata: Metadata = {
  title: "Platform Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
      <Toaster />
    </div>
  );
}
