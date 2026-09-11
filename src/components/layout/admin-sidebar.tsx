"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { useClient } from "@/providers/client-provider";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ArrowLeft,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { client, clientName } = useClient();

  const handleLogout = () => {
    logout();
    router.push(`/client/${clientName}/admin/login`);
  };

  const navItems = [
    {
      label: "Dashboard",
      href: `/client/${clientName}/admin`,
      icon: LayoutDashboard,
      active: pathname === `/client/${clientName}/admin`,
    },
    {
      label: "Metrics & Logs",
      href: `/client/${clientName}/admin#metrics`,
      icon: BarChart3,
      active: false,
    },
    {
      label: "Tenant Access",
      href: `/client/${clientName}/admin#users`,
      icon: Users,
      active: false,
    },
    {
      label: "Client Settings",
      href: `/client/${clientName}/admin#settings`,
      icon: Settings,
      active: false,
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200 bg-slate-900 text-slate-100 transition-all duration-300 z-30",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header / Client Brand */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white font-bold">
            <Shield className="w-5 h-5" />
          </div>
          {sidebarOpen && (
            <div className="truncate">
              <p className="text-sm font-bold leading-none text-white truncate">
                {client?.name || clientName}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="border-t border-slate-800 p-3 space-y-1.5">
        <Link
          href={`/client/${clientName}`}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={!sidebarOpen ? "Back to Site" : undefined}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span className="truncate">Public Site</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          title={!sidebarOpen ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span className="truncate">Sign Out</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="hidden md:flex w-full items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-2"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
