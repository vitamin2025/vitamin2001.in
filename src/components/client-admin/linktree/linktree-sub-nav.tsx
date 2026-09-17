"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Link2, Settings } from "lucide-react";
import { clientAdminRoutes, useClientDashboard } from "@/lib/client-admin";
import { cn } from "@/lib/utils";

export function LinktreeSubNav() {
  const pathname = usePathname();
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;

  const linksPath = clientAdminRoutes.linktree(slug);
  const settingsPath = clientAdminRoutes.linktreeSettings(slug);
  const analyticsPath = clientAdminRoutes.linktreeAnalytics(slug);

  const tabs = [
    {
      label: "Links",
      href: linksPath,
      icon: Link2,
      active: pathname === linksPath,
    },
    {
      label: "Page Settings",
      href: settingsPath,
      icon: Settings,
      active: pathname.startsWith(settingsPath),
    },
    {
      label: "Analytics",
      href: analyticsPath,
      icon: BarChart3,
      active: pathname.startsWith(analyticsPath),
    },
  ];

  return (
    <div className="flex border-b border-slate-200 bg-white">
      <div className="flex gap-2 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                tab.active
                  ? "border-indigo-600 text-indigo-600 font-semibold"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
