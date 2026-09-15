import React from "react";
import Link from "next/link";
import { getAllClients } from "@/config/clients";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function MainPage() {
  const clients = getAllClients();

  return (
    <main className="flex-1 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Tenant Subdomain Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            vitamin2001<span className="text-blue-600">.in</span>
          </h1>
          <p className="text-lg text-slate-600">
            Unified React & Next.js multi-tenant platform with client-isolated
            theming, TanStack Query, and silent middleware subdomain routing.
          </p>
        </div>

        {/* Registered Clients Registry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Tenants</h2>
              <p className="text-xs text-slate-500">
                Explore registered client subdomains and their administrative panels.
              </p>
            </div>
            <Badge variant="outline">{clients.length} Registered</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clients.map((client) => (
              <Card key={client.subdomain} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {client.subdomain}.vitamin2001.in
                    </Badge>
                  </div>
                  <CardDescription>{client.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1 text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">Enabled Modules:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {client.features.map((feat) => (
                        <span
                          key={feat}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <Link href={`/client/${client.subdomain}`}>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        Client Site <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                    <Link href={`/client/${client.subdomain}/admin`}>
                      <Button
                        size="sm"
                        className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Console
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Subdomain Routing & Tenancy Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Next.js Middleware</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Requests to <code className="text-blue-600 font-mono">client.vitamin2001.in</code> are silently rewritten to <code className="text-slate-700 font-mono">/client/[client]</code> without URL redirection.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dual-Entry Admin</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Admins can navigate directly via <code className="text-emerald-600 font-mono">vitamin2001.in/client/[client]/admin</code> or via <code className="text-emerald-600 font-mono">[client].vitamin2001.in/admin</code>.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>File-Specific Theming</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Each client maintains dedicated styles in <code className="text-purple-600 font-mono">src/styles/clients/[client]/</code> and component overrides in <code className="text-purple-600 font-mono">src/components/clients/[client]/</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-400 border-t pt-6 space-y-2">
        <div>
          <Link href="/admin" className="text-slate-500 hover:text-slate-700">
            Platform admin
          </Link>
        </div>
        <p>
          vitamin2001.in &bull; Multi-Tenant Next.js Architecture with TanStack Query & Subdomain Rewriting
        </p>
      </footer>
    </main>
  );
}
