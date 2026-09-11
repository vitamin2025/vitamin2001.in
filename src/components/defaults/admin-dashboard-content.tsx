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
import { Users, Activity, HardDrive, ShieldCheck } from "lucide-react";
import type { ClientConfig } from "@/types/client";

export function DefaultAdminDashboardContent({
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {client.name} Administration
        </h1>
        <p className="text-sm text-slate-500">
          Manage resources, inspect metrics, and monitor activity for subdomain:{" "}
          <span className="font-mono font-medium text-slate-700">
            {client.subdomain}.vitamin2001.in
          </span>
        </p>
      </div>

      {/* Metrics Row */}
      {statsLoading ? (
        <LoadingSpinner text="Fetching tenant statistics..." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                Active Users
              </CardTitle>
              <Users className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers ?? 0}</div>
              <p className="text-xs text-slate-500 mt-1">Tenant users online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                API Invocations
              </CardTitle>
              <Activity className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.requestsCount.toLocaleString() ?? 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Monthly total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                Storage Allocation
              </CardTitle>
              <HardDrive className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.storageUsedMb ?? 0} MB
              </div>
              <p className="text-xs text-slate-500 mt-1">Allocated quota</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                Health Status
              </CardTitle>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="success">Healthy</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Synced at: {stats?.lastSync || "Just now"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Trail</CardTitle>
          <CardDescription>
            Live tenant activity stream populated via TanStack Query.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <LoadingSpinner text="Loading activities..." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-900">
                      {item.action}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono text-xs">
                      {item.user}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {item.timestamp}
                    </TableCell>
                    <TableCell className="text-right">
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
