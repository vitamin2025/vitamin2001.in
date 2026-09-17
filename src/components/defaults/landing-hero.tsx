import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import type { ClientConfig } from "@/types/client";

export function DefaultLandingHero({ client }: { client: ClientConfig }) {
  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Globe className="w-3.5 h-3.5" />
          <span>Client Subdomain: {client.subdomain}.vitamin2001.in</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
          Welcome to <span className="text-blue-600">{client.name}</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-600">
          {client.tagline || "High-performance multi-tenant application powered by Next.js & Subdomain Routing."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href={`/client/${client.subdomain}/admin`}>
            <Button size="lg" className="gap-2">
              Launch Admin Portal <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              Documentation
            </Button>
          </a>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Dedicated Tenant</h3>
          <p className="text-sm text-slate-500">
            Completely isolated client views and branding while sharing a unified codebase.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Admin Control</h3>
          <p className="text-sm text-slate-500">
            Directly accessible at {client.subdomain}.vitamin2001.in/admin or via unified path.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">TanStack Query Cache</h3>
          <p className="text-sm text-slate-500">
            Real-time client state management and background revalidation.
          </p>
        </div>
      </div>
    </div>
  );
}
