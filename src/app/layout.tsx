import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
// Client-specific theme CSS imports
import "@/styles/clients/runachan/theme.css";

export const metadata: Metadata = {
  title: "vitamin2001.in | IT Services & Software Development",
  description:
    "Professional IT services, custom React/Next.js web applications, full-stack development, and SaaS solutions by Md Rushd Al Amin.",
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
