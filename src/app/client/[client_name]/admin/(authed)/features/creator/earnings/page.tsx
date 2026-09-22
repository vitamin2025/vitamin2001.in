"use client";

import { use } from "react";
import { useCreatorEarnings } from "@/lib/client-admin/creator";

export default function CreatorEarningsPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);
  const earnings = useCreatorEarnings(slug);
  const data = earnings.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Earnings</h2>
        <p className="text-sm text-slate-500">Captured payments for this creator. Payouts stay separate from platform billing.</p>
      </div>
      {earnings.isLoading ? (
        <p className="text-sm text-slate-500">Loading earnings…</p>
      ) : earnings.isError ? (
        <p className="text-sm text-red-600">Earnings could not be loaded.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Gross revenue" value={formatMoney(data?.grossRevenueMinor, data?.currency)} />
          <Stat label="Monthly recurring" value={formatMoney(data?.mrrMinor, data?.currency)} />
          <Stat label="Captured payments" value={String(data?.capturedCount ?? 0)} />
        </div>
      )}
      <a
        className="inline-flex text-sm font-semibold text-indigo-600"
        href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"}/v1/creator/earnings/export`}
      >
        Download CSV
      </a>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function formatMoney(minor?: number, currency = "INR") {
  const amount = ((minor ?? 0) / 100).toFixed(2);
  return `${currency} ${amount}`;
}
