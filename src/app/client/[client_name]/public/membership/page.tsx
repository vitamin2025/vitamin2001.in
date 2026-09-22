"use client";

import React, { use } from "react";
import {
  usePublicCreatorProfile,
  usePublicCreatorTiers,
} from "@/lib/client-admin/creator";
import { PublicMembershipView } from "@/components/creator/public-membership-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

const _joinPageContract = {
  intervals: ["monthly", "annual"],
  supportsCurrency: true,
};

export default function PublicMembershipPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  const { data: profile, isLoading: isProfileLoading } = usePublicCreatorProfile(slug);
  const { data: tiers = [], isLoading: isTiersLoading } = usePublicCreatorTiers(slug);

  if (isProfileLoading || isTiersLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text="Loading membership tiers..." />
      </div>
    );
  }

  return (
    <PublicMembershipView
      slug={slug}
      profile={profile ?? null}
      tiers={tiers}
    />
  );
}
