"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  useClientStats,
  useClientActivities,
} from "@/hooks/use-client-data";
import {
  Users,
  Activity,
  HardDrive,
  Sparkles,
  Zap,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import type { ClientConfig } from "@/types/client";

export function RunachanAdminDashboardContent({
  client,
}: {
  client: ClientConfig;
}) {
  const { data: stats, isLoading: statsLoading } = useClientStats(
    client.subdomain
  );
  const { data: activities, isLoading: activitiesLoading } =
    useClientActivities(client.subdomain);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Runachan Admin Suite v1.0</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {client.name} Control Center
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Real-time monitoring, customer tenancy metrics, and feature dispatch
              for <code className="bg-black/30 px-2 py-0.5 rounded font-mono text-white">runachan.vitamin2001.in</code>
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold shadow-md">
              <Zap className="w-4 h-4 mr-2" /> Sync Services
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {statsLoading ? (
        <LoadingSpinner text="Connecting to tenant data store..." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 runachan-card bg-white space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Runachan Seats</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.activeUsers ?? 0}
            </div>
            <div className="flex items-center text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14% vs last week
            </div>
          </div>

          <div className="p-6 runachan-card bg-white space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">API Throughput</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.requestsCount.toLocaleString() ?? 0}
            </div>
            <div className="flex items-center text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 99.98% SLA
            </div>
          </div>

          <div className="p-6 runachan-card bg-white space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Tenant Storage</span>
              <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.storageUsedMb ?? 0} MB
            </div>
            <div className="text-xs text-slate-500">
              Of 2,048 MB allocated capacity
            </div>
          </div>

          <div className="p-6 runachan-card bg-white space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Health Status</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              <Badge variant="success" className="text-sm px-3 py-1">All Systems Operational</Badge>
            </div>
            <div className="text-xs text-slate-500">
              Last heartbeat: {stats?.lastSync || "Live"}
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      <Card className="runachan-card overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Tenant Audit Trail & Activity
          </CardTitle>
          <CardDescription>
            Live security and configuration events scoped specifically to Runachan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {activitiesLoading ? (
            <LoadingSpinner text="Retrieving audit feed..." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">Operator</TableHead>
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="pr-6 text-right font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities?.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 font-medium text-slate-900">
                      {item.action}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {item.user}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {item.timestamp}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Badge
                        variant={
                          item.status === "success" ? "success" : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
