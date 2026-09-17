"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Link2,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { useActor } from "@/lib/admin/identity";
import {
  clientAdminNavItems,
  clientAdminRoutes,
  useClientAdminAuthCommands,
  useClientDashboard,
  type FeatureIcon,
} from "@/lib/client-admin";
import { cn } from "@/lib/utils";

const icons: Record<FeatureIcon, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  users: Users,
  settings: Settings,
  billing: CreditCard,
  audit: ClipboardList,
  spark: Sparkles,
  linktree: Link2,
};

export function ClientAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const actor = useActor();
  const dashboard = useClientDashboard();
  const { signOut } = useClientAdminAuthCommands();
  const slug = dashboard.organization.slug;
  const nav = clientAdminNavItems(slug, dashboard.organization.features);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-slate-100">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
        {dashboard.organization.logoUrl ? (
          <div
            className="h-9 w-9 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${dashboard.organization.logoUrl})` }}
            aria-hidden
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold">
            {dashboard.organization.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">
            {dashboard.organization.name}
          </p>
          <p className="truncate text-[11px] text-slate-400">{actor.email}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const Icon = icons[item.icon];
          const active =
            item.href === clientAdminRoutes.dashboard(slug)
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-slate-800 p-3">
        <Link
          href={clientAdminRoutes.publicSite(slug)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Public site
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-950/40"
          onClick={() => {
            void signOut.run().then(() => {
              router.replace(clientAdminRoutes.login(slug));
            });
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
