"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFanMe, usePublicCreatorProfile } from "@/lib/client-admin/creator";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles, Layers } from "lucide-react";

function SuccessContent({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierId = searchParams.get("tierId");
  const paymentId = searchParams.get("paymentId");

  const { data: profile } = usePublicCreatorProfile(slug);
  const { data: patron, refetch } = useFanMe(slug);
  const [countdown, setCountdown] = useState(5);

  const creatorName = profile?.name || slug;

  useEffect(() => {
    // Refresh membership data
    refetch();
  }, [refetch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace(`/client/${encodeURIComponent(slug)}/user/feed`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, slug]);

  const tierName = patron?.tier?.name || patron?.tierName || "Membership";

  return (
    <div className="max-w-md mx-auto px-4 pt-16 pb-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm border border-emerald-200">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
        <Sparkles className="h-3.5 w-3.5" /> Payment Successful
      </span>

      <h1 className="text-2xl font-extrabold text-slate-900">
        Welcome to {tierName}!
      </h1>

      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
        Your payment has been verified and processed by PayU. You now have full access to exclusive posts, community perks, and member updates for {creatorName}.
      </p>

      {paymentId && (
        <p className="text-[11px] text-slate-400 mt-4 font-mono">
          Transaction Reference: {paymentId}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={`/client/${encodeURIComponent(slug)}/user/feed`}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Go to Community Feed</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href={`/client/${encodeURIComponent(slug)}/user/account`}
          className="w-full py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
        >
          View Account Details
        </Link>
      </div>

      <p className="text-[11px] text-slate-400 mt-6">
        Redirecting to your feed in {countdown} seconds...
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <LoadingSpinner text="Verifying payment..." />
        </div>
      }
    >
      <SuccessContent slug={slug} />
    </Suspense>
  );
}
