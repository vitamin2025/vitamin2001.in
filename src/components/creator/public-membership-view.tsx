"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MessageSquare, Sparkles, Shield, ArrowRight } from "lucide-react";
import { type CreatorProfile, type CreatorTier, useFanMe } from "@/lib/client-admin/creator";

interface PublicMembershipViewProps {
  slug: string;
  profile: CreatorProfile | null;
  tiers: CreatorTier[];
}

export function PublicMembershipView({
  slug,
  profile,
  tiers = [],
}: PublicMembershipViewProps) {
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const { data: patron } = useFanMe(slug);

  const creatorName = profile?.name || slug;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-800 overflow-hidden">
        {profile?.bannerUrl ? (
          <img
            src={profile.bannerUrl}
            alt={creatorName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-2xs" />
      </div>

      {/* Creator Info Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600 text-white font-bold text-3xl flex items-center justify-center shadow-md ring-4 ring-white shrink-0">
            {creatorName.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {creatorName}
            </h1>
            <p className="mt-1 text-slate-600 text-sm max-w-2xl">
              {profile?.bio || "Welcome to my official creator membership community. Select a tier below to unlock exclusive content and direct access."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/client/${encodeURIComponent(slug)}/user/signup`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 transition-colors"
            >
              Follow for Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Membership Section Header */}
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
            <Sparkles className="h-3.5 w-3.5" /> Membership Tiers
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Support my work and unlock perks
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
            Choose a tier that fits you. Cancel or adjust your membership at any time with zero hassle.
          </p>

          {/* Interval Toggle */}
          <div className="mt-6 inline-flex p-1 bg-slate-200/80 rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                interval === "monthly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setInterval("annual")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                interval === "annual"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Annual billing (Save 15%)
            </button>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const rawPrice = tier.priceMinor / 100;
            const price =
              interval === "annual"
                ? (rawPrice * 10).toFixed(0) // 2 months free
                : rawPrice.toFixed(0);

            const isFree = tier.rank === 0 || tier.priceMinor === 0;

            return (
              <div
                key={tier.id}
                className={`flex flex-col justify-between bg-white rounded-2xl p-6 border shadow-xs transition-all hover:shadow-md ${
                  tier.rank === 1
                    ? "border-indigo-400 ring-2 ring-indigo-500/20"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                    {tier.allowsDm && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200">
                        <MessageSquare className="h-3 w-3" /> DMs
                      </span>
                    )}
                  </div>

                  {tier.description && (
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {tier.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {isFree ? "Free" : `₹${price}`}
                    </span>
                    {!isFree && (
                      <span className="text-xs text-slate-500">
                        /{interval === "annual" ? "year" : "month"}
                      </span>
                    )}
                  </div>

                  {/* Perks list */}
                  {tier.benefits && tier.benefits.length > 0 && (
                    <div className="mt-6 space-y-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Included perks:
                      </p>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  {(() => {
                    const isCurrent =
                      patron?.status === "active" &&
                      patron?.tierId === tier.id &&
                      patron?.currentPeriodEnd &&
                      new Date(patron.currentPeriodEnd) > new Date();

                    const isUpgrade =
                      patron?.status === "active" &&
                      patron?.tierId &&
                      Number(tier.rank) > Number(patron.tierRank || 0) &&
                      patron?.currentPeriodEnd &&
                      new Date(patron.currentPeriodEnd) > new Date();

                    if (isCurrent) {
                      return (
                        <Link
                          href={`/client/${encodeURIComponent(slug)}/user/feed`}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Current Plan • Go to Feed</span>
                        </Link>
                      );
                    }

                    const href = isFree
                      ? `/client/${encodeURIComponent(slug)}/user/signup?tierId=${tier.id}`
                      : `/client/${encodeURIComponent(slug)}/user/checkout?tierId=${tier.id}`;

                    const label = isUpgrade
                      ? `Upgrade to ${tier.name}`
                      : isFree
                      ? `Join ${tier.name}`
                      : `Subscribe to ${tier.name}`;

                    return (
                      <Link
                        href={href}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors ${
                          tier.rank === 1 || isUpgrade
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        <span>{label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 rounded-2xl bg-white p-6 border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Full Access Guarantee</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Subscriptions renew automatically. If you cancel, you will retain full access until the end of your current billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
