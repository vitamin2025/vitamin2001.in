"use client";

import React, { use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePublicCreatorProfile } from "@/lib/client-admin/creator";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

function FailureContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Payment was cancelled or could not be processed.";
  const paymentId = searchParams.get("paymentId");

  const { data: profile } = usePublicCreatorProfile(slug);
  const creatorName = profile?.name || slug;

  return (
    <div className="max-w-md mx-auto px-4 pt-16 pb-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5 shadow-sm border border-red-200">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200 mb-3">
        Payment Unsuccessful
      </span>

      <h1 className="text-2xl font-extrabold text-slate-900">
        Checkout Incomplete
      </h1>

      <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
        {reason}
      </p>

      {paymentId && (
        <p className="text-[11px] text-slate-400 mt-3 font-mono">
          Ref: {paymentId}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={`/client/${encodeURIComponent(slug)}/public/membership`}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again / Choose Another Plan</span>
        </Link>
        <Link
          href={`/client/${encodeURIComponent(slug)}/user/feed`}
          className="w-full py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
        >
          Return to Community Feed
        </Link>
      </div>

      <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
        No funds were deducted, or any deducted funds will be automatically refunded by PayU according to your bank&apos;s standard timeline.
      </p>
    </div>
  );
}

export default function CheckoutFailurePage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <LoadingSpinner text="Loading payment status..." />
        </div>
      }
    >
      <FailureContent slug={slug} />
    </Suspense>
  );
}
