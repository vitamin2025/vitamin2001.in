import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";
import type { ClientConfig } from "@/types/client";

export function RunachanLandingHero({ client }: { client: ClientConfig }) {
  return (
    <div className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold runachan-badge shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Client Dedicated Environment • {client.subdomain}.vitamin2001.in</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {client.name}
          </span>{" "}
          Cloud
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 font-medium">
          {client.tagline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href={`/client/${client.subdomain}/admin`}>
            <Button size="lg" className="runachan-btn-primary gap-2 h-12 px-8 font-semibold">
              Open Runachan Admin <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/client/runachan/admin/login">
            <Button variant="outline" size="lg" className="h-12 px-6 border-indigo-200 hover:bg-indigo-50/50">
              Admin Login Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature cards customized specifically for Runachan */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 runachan-card bg-white space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Runachan Micro-Engines</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Custom-tailored business logic isolated under client-specific styles and components.
          </p>
        </div>

        <div className="p-8 runachan-card bg-white space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Subdomain Rewriting</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Directly mapped from <code className="text-xs bg-slate-100 p-1 rounded font-mono">runachan.vitamin2001.in</code> to internal paths with zero external proxy.
          </p>
        </div>

        <div className="p-8 runachan-card bg-white space-y-3">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Better Auth Ready</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Modular auth guard architecture built for seamless backend and OAuth integration.
          </p>
        </div>
      </div>
    </div>
  );
}
