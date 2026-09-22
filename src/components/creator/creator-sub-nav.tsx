"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Layers,
  FileText,
  Users,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorSubNavProps {
  slug: string;
}

export function CreatorSubNav({ slug }: CreatorSubNavProps) {
  const pathname = usePathname();
  const basePath = `/client/${encodeURIComponent(slug)}/admin/features/creator`;

  const tabs = [
    {
      name: "Dashboard",
      href: basePath,
      exact: true,
      icon: LayoutDashboard,
    },
    {
      name: "Profile",
      href: `${basePath}/profile`,
      exact: false,
      icon: UserCheck,
    },
    {
      name: "Tiers",
      href: `${basePath}/tiers`,
      exact: false,
      icon: Layers,
    },
    {
      name: "Posts",
      href: `${basePath}/posts`,
      exact: false,
      icon: FileText,
    },
    {
      name: "Patrons",
      href: `${basePath}/patrons`,
      exact: false,
      icon: Users,
    },
    {
      name: "Earnings",
      href: `${basePath}/earnings`,
      exact: false,
      icon: CreditCard,
    },
    {
      name: "Inbox",
      href: `${basePath}/inbox`,
      exact: false,
      icon: MessageSquare,
    },
  ];

  return (
    <nav className="flex space-x-1 border-b border-slate-200 py-2 overflow-x-auto" aria-label="Creator Tabs">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
              isActive
                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-indigo-600" : "text-slate-400")} />
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
