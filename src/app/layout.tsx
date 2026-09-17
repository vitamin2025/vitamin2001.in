import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
// Client-specific theme CSS imports
import "@/styles/clients/runachan/theme.css";

export const metadata: Metadata = {
  title: "vitamin2001.in | Multi-Tenant Platform",
  description: "Next.js multi-tenant platform with subdomain routing and client isolation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
