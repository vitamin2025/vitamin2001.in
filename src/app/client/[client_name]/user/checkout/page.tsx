"use client";

import React, { useState, useEffect, useRef, use, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  usePublicCreatorProfile,
  usePublicCreatorTiers,
  useFanMe,
  useFanFollow,
  useFanCheckout,
  CreatorTier,
} from "@/lib/client-admin/creator";
import { useClientSession } from "@/lib/client-admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  MessageSquare,
  AlertCircle,
  CreditCard,
  Layers,
  ArrowRight,
} from "lucide-react";

function CheckoutContent({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierId = searchParams.get("tierId");

  const session = useClientSession();
  const { data: profile } = usePublicCreatorProfile(slug);
  const { data: tiers, isLoading: tiersLoading } = usePublicCreatorTiers(slug);
  const { data: patron, isLoading: patronLoading, refetch: refetchPatron } = useFanMe(slug);
  const followMutation = useFanFollow(slug);
  const checkoutMutation = useFanCheckout(slug);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [payuParams, setPayuParams] = useState<{
    url: string;
    fields: Record<string, string>;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Auto-submit PayU hidden form when payuParams are set
  useEffect(() => {
    if (payuParams && formRef.current) {
      setFormSubmitting(true);
      formRef.current.submit();
    }
  }, [payuParams]);

  const creatorName = profile?.name || slug;

  if (tiersLoading || patronLoading || session.status === "checking") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text="Loading checkout details..." />
      </div>
    );
  }

  const selectedTier = tiers?.find((t) => t.id === tierId) || null;

  if (!tierId || !selectedTier) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tier not specified</h2>
        <p className="text-xs text-slate-500 mt-2">
          Please select a membership tier from the membership plans page.
        </p>
        <Link
          href={`/client/${encodeURIComponent(slug)}/public/membership`}
          className="inline-flex items-center gap-2 mt-6 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Membership Plans
        </Link>
      </div>
    );
  }

  // Check login status
  const isAuthenticated = session.status === "granted";

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 pt-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-200 shadow-sm">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Sign In to Subscribe
        </h2>
        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
          You need an account to unlock <span className="font-semibold text-slate-700">{selectedTier.name}</span> in {creatorName}&apos;s community.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/client/${encodeURIComponent(slug)}/user/login?redirect=/client/${encodeURIComponent(slug)}/user/checkout?tierId=${encodeURIComponent(selectedTier.id)}`}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Log In to Existing Account</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/client/${encodeURIComponent(slug)}/user/signup?tierId=${encodeURIComponent(selectedTier.id)}`}
            className="w-full py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  // Calculate proration if upgrading
  const isCurrentTier =
    patron?.status === "active" &&
    patron?.tierId === selectedTier.id &&
    patron?.currentPeriodEnd &&
    new Date(patron.currentPeriodEnd) > new Date();

  const isUpgrade =
    patron?.status === "active" &&
    patron?.tierId &&
    Number(selectedTier.rank) > Number(patron.tierRank || 0) &&
    patron?.currentPeriodEnd &&
    new Date(patron.currentPeriodEnd) > new Date();

  // Find current tier if upgrade
  const currentTier = isUpgrade
    ? tiers?.find((t) => t.id === patron.tierId) || null
    : null;

  let daysRemaining = 0;
  let estimatedProratedMinor = selectedTier.priceMinor;

  if (isUpgrade && currentTier && patron.currentPeriodEnd) {
    const now = new Date();
    const end = new Date(patron.currentPeriodEnd);
    daysRemaining = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const totalDays = selectedTier.interval === "annual" ? 365 : 30;
    const priceDiff = selectedTier.priceMinor - currentTier.priceMinor;
    if (priceDiff > 0) {
      estimatedProratedMinor = Math.max(100, Math.round(priceDiff * (daysRemaining / totalDays)));
    }
  }

  const displayPrice = isUpgrade
    ? (estimatedProratedMinor / 100).toFixed(0)
    : (selectedTier.priceMinor / 100).toFixed(0);

  const handleInitiatePayment = async () => {
    setErrorMessage(null);
    try {
      // 1. Ensure user is follower first
      if (!patron || !patron.isPatron) {
        await followMutation.mutateAsync();
        await refetchPatron();
      }

      // 2. Call checkout mutation
      const res = await checkoutMutation.mutateAsync(selectedTier.id);

      // 3. If PayU form data is provided, populate and submit hidden form
      if (res.payuFormData && res.checkoutUrl) {
        setPayuParams({
          url: res.checkoutUrl,
          fields: res.payuFormData,
        });
      } else if (res.checkoutUrl) {
        // Direct redirect (e.g. mock gateway)
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not initiate checkout. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">
      <Link
        href={`/client/${encodeURIComponent(slug)}/public/membership`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Tiers</span>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Complete Membership Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Join {creatorName}&apos;s community and unlock exclusive perks.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Upgrading Proration Notice */}
      {isUpgrade && currentTier && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Prorated Tier Upgrade</span>
          </div>
          <p className="text-indigo-800 leading-relaxed">
            You are upgrading from <strong className="font-semibold">{currentTier.name}</strong> to <strong className="font-semibold">{selectedTier.name}</strong>.
            You will only pay for the remaining <strong className="font-semibold">{daysRemaining} days</strong> of your current billing cycle.
            Your renewal date will remain the same.
          </p>
        </div>
      )}

      {isCurrentTier ? (
        <Card className="border-emerald-200 bg-emerald-50/40 shadow-2xs">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Already Active Subscriber
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              You are currently subscribed to <span className="font-semibold">{selectedTier.name}</span>. Your membership is active.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href={`/client/${encodeURIComponent(slug)}/user/feed`}>
                <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-500">
                  Go to Feed
                </Button>
              </Link>
              <Link href={`/client/${encodeURIComponent(slug)}/user/account`}>
                <Button size="sm" variant="outline" className="text-xs">
                  View Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Tier Overview Card */}
          <Card className="md:col-span-3 border-slate-200 shadow-2xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900">
                  {selectedTier.name}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold"
                >
                  Tier {selectedTier.rank}
                </Badge>
              </div>
              {selectedTier.description && (
                <CardDescription className="text-xs mt-1">
                  {selectedTier.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {isUpgrade ? "Prorated Amount" : "Subscription Fee"}
                </span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{displayPrice}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    /{selectedTier.interval}
                  </span>
                </div>
              </div>

              {selectedTier.allowsDm && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                  <MessageSquare className="h-4 w-4" />
                  <span>Includes direct messaging with {creatorName}</span>
                </div>
              )}

              {selectedTier.benefits && selectedTier.benefits.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Included Benefits:
                  </p>
                  <ul className="space-y-2">
                    {selectedTier.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary & Checkout Action */}
          <Card className="md:col-span-2 border-slate-200 shadow-2xs flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Selected Tier</span>
                <span className="font-semibold text-slate-900">
                  {selectedTier.name}
                </span>
              </div>
              {isUpgrade && currentTier && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span>Current Plan</span>
                  <span className="font-medium text-slate-700">
                    {currentTier.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Billing Period</span>
                <span className="capitalize">{selectedTier.interval}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm text-slate-900">
                <span>Total Due Now</span>
                <span className="text-indigo-600">₹{displayPrice}</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Processed securely by PayU Payment Gateway. Supports UPI, NetBanking, Debit & Credit Cards.
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                onClick={handleInitiatePayment}
                disabled={checkoutMutation.isPending || formSubmitting}
                className="w-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs gap-2 py-5"
              >
                {checkoutMutation.isPending || formSubmitting ? (
                  <>
                    <LoadingSpinner />
                    <span>Redirecting to PayU...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{displayPrice} with PayU</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Hidden PayU Form for Automatic Redirection */}
      {payuParams && (
        <form
          ref={formRef}
          action={payuParams.url}
          method="POST"
          className="hidden"
        >
          {Object.entries(payuParams.fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <LoadingSpinner text="Loading checkout..." />
        </div>
      }
    >
      <CheckoutContent slug={slug} />
    </Suspense>
  );
}
