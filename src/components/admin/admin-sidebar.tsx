"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Building2,
  Shield,
  Users,
  MonitorSmartphone,
  HardDrive,
} from "lucide-react";
import { adminRoutes, useActor, useAuthCommands } from "@/lib/admin";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Overview", href: adminRoutes.overview(), icon: LayoutDashboard },
  { label: "Users", href: adminRoutes.users(), icon: Users },
  { label: "Organizations", href: adminRoutes.orgs(), icon: Building2 },
  { label: "Storage", href: adminRoutes.storage(), icon: HardDrive },
  { label: "Sessions", href: adminRoutes.sessions(), icon: MonitorSmartphone },
  { label: "Audit", href: adminRoutes.audit(), icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const actor = useActor();
  const { signOut } = useAuthCommands();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-slate-100">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">Platform Admin</p>
          <p className="truncate text-[11px] text-slate-400">{actor.email}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-950/40"
          onClick={() => {
            void signOut.run().then(() => {
              router.replace(adminRoutes.login());
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
