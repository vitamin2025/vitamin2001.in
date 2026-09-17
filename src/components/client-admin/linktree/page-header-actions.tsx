"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clientAdminRoutes, useClientDashboard, useLinktreePageCommands, type LinktreePage } from "@/lib/client-admin";

export function PageHeaderActions({ page }: { page?: LinktreePage | null }) {
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;
  const { publish, unpublish } = useLinktreePageCommands();
  const [copied, setCopied] = useState(false);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}${clientAdminRoutes.publicLinks(slug)}`
    : clientAdminRoutes.publicLinks(slug);

  const isPublished = page?.isPublished ?? false;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write failed
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {page && (
        <Badge
          className={
            isPublished
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }
        >
          {isPublished ? (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" /> Draft
            </span>
          )}
        </Badge>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="gap-1.5 text-xs text-slate-700"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied Link" : "Copy Link"}
      </Button>

      <a
        href={clientAdminRoutes.publicLinks(slug)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center"
      >
        <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700">
          <ExternalLink className="h-3.5 w-3.5" />
          Preview
        </Button>
      </a>

      {page && (
        <>
          {isPublished ? (
            <Button
              variant="outline"
              size="sm"
              disabled={unpublish.state.status === "running"}
              onClick={() => void unpublish.run()}
              className="text-xs text-amber-700 hover:bg-amber-50"
            >
              {unpublish.state.status === "running" ? "Unpublishing..." : "Unpublish"}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              disabled={publish.state.status === "running"}
              onClick={() => void publish.run()}
              className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            >
              <Globe className="h-3.5 w-3.5" />
              {publish.state.status === "running" ? "Publishing..." : "Publish Page"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
