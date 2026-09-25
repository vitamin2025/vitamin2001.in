"use client";

import React from "react";
import Link from "next/link";
import { useClient } from "@/providers/client-provider";
import { useClientSession } from "@/lib/client-admin";
import { useFanMe } from "@/lib/client-admin/creator";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Layers, Sparkles, LogIn, User } from "lucide-react";

export function ClientHeader() {
  const { client, clientName, hasCreatorFeature } = useClient();
  const session = useClientSession();
  const { data: patron } = useFanMe(clientName);
  const isLoggedIn = session.status === "granted" || Boolean(patron);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/client/${clientName}`}
          className="flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight hover:opacity-80 transition"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Layers className="w-4 h-4" />
          </div>
          <span>{client?.name || clientName}</span>
          <span className="text-xs font-normal text-slate-400 font-mono hidden sm:inline">
            ({clientName}.vitamin2001.in)
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href={`/client/${clientName}`}>
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          {hasCreatorFeature && (
            <>
              {isLoggedIn ? (
                <Link href={`/client/${clientName}/user/account`}>
                  <Button variant="outline" size="sm" className="gap-1.5 border-slate-300">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>My Account</span>
                  </Button>
                </Link>
              ) : (
                <Link href={`/client/${clientName}/user/login`}>
                  <Button variant="outline" size="sm" className="gap-1.5 border-slate-300">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </Button>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
