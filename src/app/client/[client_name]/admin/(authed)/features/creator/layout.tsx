import type { ReactNode } from "react";
import { CreatorFeatureGate } from "@/components/creator/creator-feature-gate";
import { CreatorHeader } from "@/components/creator/creator-header";
import { CreatorSubNav } from "@/components/creator/creator-sub-nav";

export default async function CreatorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ client_name: string }>;
}) {
  const { client_name } = await params;

  return (
    <CreatorFeatureGate>
      <div className="space-y-6">
        <CreatorHeader
          title="Creator Studio"
          description="Manage your membership tiers, gated posts, subscriber roster, and studio profile."
        />
        <CreatorSubNav slug={client_name} />
        <div>{children}</div>
      </div>
    </CreatorFeatureGate>
  );
}
