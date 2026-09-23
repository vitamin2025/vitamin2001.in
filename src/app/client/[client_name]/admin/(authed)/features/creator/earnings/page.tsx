"use client";

import { use, useState } from "react";
import {
  useCreatorEarnings,
  useCreatorTransactions,
} from "@/lib/client-admin/creator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  CreditCard,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function CreatorEarningsPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);
  const [page, setPage] = useState(1);
  const limit = 10;

  const earnings = useCreatorEarnings(slug);
  const transactionsQuery = useCreatorTransactions(slug, page, limit);

  const data = earnings.data;
  const transactionsData = transactionsQuery.data;

  const grossVal =
    data?.grossRevenue !== undefined
      ? `₹${data.grossRevenue.toFixed(2)}`
      : formatMoney((data as any)?.grossRevenueMinor, data?.currency);

  const mrrVal =
    data?.mrr !== undefined
      ? `₹${data.mrr.toFixed(2)}`
      : formatMoney((data as any)?.mrrMinor, data?.currency);

  const totalPages = Math.ceil((transactionsData?.total || 0) / limit) || 1;

  const exportUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
  }/v1/creator/earnings/export`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Earnings & Revenue</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time subscriber transactions processed through PayU.
          </p>
        </div>
        <a
          href={exportUrl}
          download="creator-earnings.csv"
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors w-fit"
        >
          <Download className="h-4 w-4 text-indigo-600" />
          <span>Export Transactions CSV</span>
        </a>
      </div>

      {earnings.isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">
          Loading revenue metrics…
        </div>
      ) : earnings.isError ? (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          Earnings could not be loaded. Please ensure creator features are active.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
            label="Gross Revenue"
            value={grossVal}
            subtext="All-time captured payments"
          />
          <Stat
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
            label="Monthly Recurring (MRR)"
            value={mrrVal}
            subtext="Current active subscriptions"
          />
          <Stat
            icon={<CreditCard className="h-5 w-5 text-purple-600" />}
            label="Captured Payments"
            value={String(data?.capturedCount ?? 0)}
            subtext="Successful transactions"
          />
        </div>
      )}

      {/* Transactions History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Payment Transactions
          </h3>
          {transactionsData && (
            <span className="text-xs text-slate-500">
              Total {transactionsData.total} transaction
              {transactionsData.total === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          {transactionsQuery.isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Loading transactions…
            </div>
          ) : !transactionsData?.transactions ||
            transactionsData.transactions.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CreditCard className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                No transactions recorded yet
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When fans purchase membership tiers through PayU, transactions will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Subscriber</th>
                    <th className="px-5 py-3.5">Tier Plan</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Gateway Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactionsData.transactions.map((tx) => {
                    const formattedDate = new Date(
                      tx.createdAt,
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                          {formattedDate}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-900">
                            {tx.fanName}
                          </p>
                          {tx.fanEmail && (
                            <p className="text-[11px] text-slate-400">
                              {tx.fanEmail}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {tx.tierName}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                          ₹{tx.amount.toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {tx.gatewayPaymentId || tx.id.slice(0, 12)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {transactionsData && transactionsData.total > limit && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 bg-slate-50/50 text-xs">
              <span className="text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-8 px-2 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 px-2 text-xs"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
      {subtext && (
        <p className="mt-1 text-[11px] text-slate-400">{subtext}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "captured" || s === "success") {
    return (
      <Badge
        variant="secondary"
        className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-semibold"
      >
        <CheckCircle2 className="h-3 w-3" /> Captured
      </Badge>
    );
  }
  if (s === "pending") {
    return (
      <Badge
        variant="secondary"
        className="bg-amber-50 text-amber-700 border-amber-200 gap-1 font-semibold"
      >
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="bg-red-50 text-red-700 border-red-200 gap-1 font-semibold"
    >
      <XCircle className="h-3 w-3" /> Failed
    </Badge>
  );
}

function formatMoney(minor?: number, currency = "INR") {
  const amount = ((minor ?? 0) / 100).toFixed(2);
  return `${currency === "INR" ? "₹" : currency + " "}${amount}`;
}
