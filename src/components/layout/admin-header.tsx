"use client";

import React from "react";
import { useClient } from "@/providers/client-provider";
import { useCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { User, Bell, ExternalLink } from "lucide-react";

export function AdminHeader() {
  const { client, clientName } = useClient();
  const currentUser = useCurrentUser();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-6 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-900">
          {client?.name || clientName}
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-500">Admin Console</span>
        <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono">
          {clientName}.vitamin2001.in
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <a
          href={`http://${clientName}.vitamin2001.in`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition"
        >
          <span>Live Subdomain</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="h-4 w-px bg-slate-200 hidden md:block" />

        <button
          className="relative p-1.5 text-slate-500 hover:text-slate-700 transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-semibold text-slate-800 leading-tight">
              {currentUser?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {currentUser?.role || "Tenant Admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
