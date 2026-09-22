"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, Globe } from "lucide-react";

export function TenantRedirectView() {
  const [slugInput, setSlugInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cleanSubdomain = slugInput
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "");

  const handleRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanSubdomain) {
      setError("Please enter your organization or creator name");
      return;
    }

    const prodDomain =
      process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "vitamin2001.in";
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    const targetUrl = isLocalhost
      ? `http://${cleanSubdomain}.localhost:${window.location.port || "3000"}/user/login`
      : `https://${cleanSubdomain}.${prodDomain}/user/login`;

    window.location.href = targetUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
            Tenant Member Login
          </CardTitle>
          <CardDescription className="text-xs text-slate-600 leading-relaxed">
            Member accounts are hosted on dedicated tenant instances. Enter your creator or organization name to be routed to your login portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRedirect} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="tenant-slug" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Organization / Creator Name
              </label>
              <Input
                id="tenant-slug"
                type="text"
                autoFocus
                placeholder="e.g. runachan"
                value={slugInput}
                onChange={(e) => {
                  setSlugInput(e.target.value);
                  if (error) setError(null);
                }}
              />
              {error && <p className="text-xs text-rose-600">{error}</p>}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Destination Portal</span>
              </div>
              <p className="font-mono font-bold text-slate-800 break-all">
                {cleanSubdomain ? `${cleanSubdomain}.vitamin2001.in/user/login` : "[your-creator].vitamin2001.in/user/login"}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
