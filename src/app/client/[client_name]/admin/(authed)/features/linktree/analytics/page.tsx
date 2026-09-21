"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  useLinktreeAnalytics,
  useLinktreeLinkAnalytics,
  useLinktreePage,
  type LinktreeLink,
} from "@/lib/client-admin";

function LinkDetailPanel({ link }: { link: LinktreeLink }) {
  const { item: detail, status } = useLinktreeLinkAnalytics(link.id);

  if (status === "loading") {
    return (
      <div className="py-6 text-center text-xs text-slate-500">
        Loading link breakdown...
      </div>
    );
  }

  const countries = detail?.countries ?? [];
  const referrers = detail?.topReferrers ?? [];
  const recentClicks = detail?.recentClicks ?? [];

  return (
    <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Countries */}
        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Globe className="h-3.5 w-3.5" /> Top Countries
          </h4>
          {countries.length === 0 ? (
            <p className="text-xs text-slate-400">No geographic data recorded yet.</p>
          ) : (
            <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2">
              {countries.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 px-2">
                  <span className="font-medium text-slate-700">{c.country}</span>
                  <span className="font-mono text-slate-500">{c.clicks} clicks</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referrers */}
        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ExternalLink className="h-3.5 w-3.5" /> Top Referrers
          </h4>
          {referrers.length === 0 ? (
            <p className="text-xs text-slate-400">No referrer data recorded yet.</p>
          ) : (
            <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2">
              {referrers.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 px-2">
                  <span className="truncate font-medium text-slate-700 max-w-[180px]">{r.referrer || "Direct"}</span>
                  <span className="font-mono text-slate-500">{r.clicks} clicks</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent raw clicks */}
      {recentClicks.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent Click Log
          </h4>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500">
                <tr>
                  <th className="p-2">Time</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Browser</th>
                  <th className="p-2">OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                {recentClicks.slice(0, 5).map((c, i) => (
                  <tr key={i}>
                    <td className="p-2">{new Date(c.clickedAt).toLocaleString()}</td>
                    <td className="p-2">{c.country || "Unknown"}</td>
                    <td className="p-2">{c.browser || "Unknown"}</td>
                    <td className="p-2">{c.os || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LinktreeAnalyticsPage() {
  const { item: page, status: pageStatus } = useLinktreePage();
  const { item: overview, status: overviewStatus } = useLinktreeAnalytics();
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

  if (pageStatus === "loading" || overviewStatus === "loading") {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  const links = page?.links ?? [];
  const clicksByLinkId = new Map(
    (overview?.topLinks ?? []).map((item) => [item.id, item.clicks] as const),
  );
  const totalClicks = overview?.totalClicks ?? 0;
  const totalLinks = links.length;

  const topLinksData = overview?.topLinks?.length
    ? overview.topLinks
    : [];

  const timeSeriesData = overview?.clicksOverTime ?? [];

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clicks" value={totalClicks} />
        <StatCard label="Total Links" value={totalLinks} />
        <StatCard
          label="Top Link Clicks"
          value={topLinksData[0]?.clicks ?? 0}
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Page Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                className={
                  page?.isPublished
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }
              >
                {page?.isPublished ? "Live & Tracking" : "Unpublished Draft"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Clicks Over Time */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Clicks Over Time
                </CardTitle>
                <CardDescription>Overall traffic engagement trend</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {timeSeriesData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  No click trend data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" fontSize={12} />
                    <YAxis tickLine={false} stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "8px",
                        color: "#fff",
                        border: "none",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#clickGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Links Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  Top Performing Links
                </CardTitle>
                <CardDescription>Links with the most visitor clicks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {topLinksData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  No link click data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topLinksData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="title"
                      tickLine={false}
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(val) => (typeof val === "string" && val.length > 10 ? `${val.slice(0, 10)}...` : val)}
                    />
                    <YAxis tickLine={false} stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "8px",
                        color: "#fff",
                        border: "none",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-Link Breakdown List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Per-Link Analytics Drilldown</CardTitle>
          <CardDescription>
            Select any link below to expand its country breakdown, referrers, and recent clicks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {links.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No links available to track.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {links.map((link) => {
                const isExpanded = expandedLinkId === link.id;
                return (
                  <div key={link.id} className="transition-colors hover:bg-slate-50/50">
                    <div
                      className="flex cursor-pointer items-center justify-between p-4"
                      onClick={() => setExpandedLinkId(isExpanded ? null : link.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {link.title}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {link.shortUrl || link.originalUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-800">
                          <MousePointerClick className="h-4 w-4 text-indigo-500" />
                          <span>{clicksByLinkId.get(link.id) ?? 0}</span>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <LinkDetailPanel link={link} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
