"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useFanCancel,
  useFanMe,
  usePublicCreatorProfile,
} from "@/lib/client-admin/creator";
import { useClientSession, useClientAdminAuthCommands } from "@/lib/client-admin";
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
import { Dialog } from "@/components/ui/dialog";
import {
  User,
  Sparkles,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  LogOut,
  Shield,
  Layers,
} from "lucide-react";

export const accountFields = [
  "tierName",
  "currentPeriodEnd",
  "status",
  "cancelSubscription",
];

export default function FanAccountPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);
  const router = useRouter();

  const session = useClientSession();
  const { signOut } = useClientAdminAuthCommands();
  const { data: profile } = usePublicCreatorProfile(slug);
  const { data: patron, isLoading, refetch } = useFanMe(slug);
  const cancelSubscription = useFanCancel(slug);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const creatorName = profile?.name || slug;

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      await cancelSubscription.mutateAsync();
      setCancelSuccess(true);
      await refetch();
    } catch {
      // Non-fatal or caught
    } finally {
      setIsCanceling(false);
    }
  };

  const handleSignOut = async () => {
    await signOut.run();
    router.replace(`/client/${encodeURIComponent(slug)}`);
  };

  if (session.status === "checking" || isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text="Loading your account..." />
      </div>
    );
  }

  const tierName =
    patron?.tier?.name ||
    patron?.tierName ||
    (patron && patron.tierRank > 0
      ? `Tier ${patron.tierRank}`
      : patron
      ? "Free Member"
      : "Not Subscribed");

  const status = patron?.status || "active";

  const currentPeriodEnd = patron?.currentPeriodEnd
    ? new Date(patron.currentPeriodEnd).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Ongoing (Free Access)";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link
            href={`/client/${encodeURIComponent(slug)}/user/feed`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Feed</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-xs text-slate-600 gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Account & Membership
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your subscription and profile for {creatorName}&apos;s community.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-2xs border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              <span>User Profile</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Authenticated identity on this tenant platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 text-xs">Name</span>
              <span className="font-medium text-slate-900">
                {session.status === "granted" ? session.actor.name || "Subscriber" : "Anonymous"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 text-xs">Email</span>
              <span className="font-medium text-slate-900">
                {session.status === "granted" ? session.actor.email : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Membership Details Card */}
        <Card className="shadow-2xs border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Current Membership</span>
              </CardTitle>
              <Badge
                variant="secondary"
                className={
                  status === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }
              >
                {status.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Your tier entitlements and subscription renewal status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Tier Name
                </p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{tierName}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <p className="text-base font-bold text-slate-900 mt-0.5 capitalize">
                  {status}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Billing Period End
                </p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {currentPeriodEnd}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Link href={`/client/${encodeURIComponent(slug)}/public/membership`}>
                <Button variant="outline" size="sm" className="text-xs gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Browse All Tiers</span>
                </Button>
              </Link>

              {patron && patron.tierRank > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsCancelDialogOpen(true)}
                  className="text-xs bg-red-600 hover:bg-red-700"
                  name="cancelSubscription"
                >
                  Cancel Membership
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Confirmation Dialog */}
        <Dialog
          open={isCancelDialogOpen}
          onClose={() => setIsCancelDialogOpen(false)}
          title="Cancel Membership Subscription?"
          footer={
            cancelSuccess ? (
              <Button
                size="sm"
                onClick={() => {
                  setIsCancelDialogOpen(false);
                  setCancelSuccess(false);
                }}
                className="text-xs"
              >
                Close
              </Button>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(false)}
                  className="text-xs"
                  disabled={isCanceling}
                >
                  Keep Membership
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  className="text-xs bg-red-600 hover:bg-red-700"
                  disabled={isCanceling}
                >
                  {isCanceling ? "Canceling..." : "Confirm Cancellation"}
                </Button>
              </div>
            )
          }
        >
          {cancelSuccess ? (
            <div className="py-4 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-900">
                Subscription successfully updated.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p className="font-semibold text-sm text-slate-900">
                  Are you sure you want to cancel?
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You will retain full access until the end of your billing cycle. After that, your account will revert to free follower status.
              </p>
            </div>
          )}
        </Dialog>
      </main>
    </div>
  );
}
