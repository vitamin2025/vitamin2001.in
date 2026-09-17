import { ReactNode } from "react";
import { LinktreeFeatureGate, LinktreeHeader } from "@/components/client-admin/linktree";

export default function LinktreeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LinktreeFeatureGate>
      <div className="space-y-6">
        <LinktreeHeader />
        <div>{children}</div>
      </div>
    </LinktreeFeatureGate>
  );
}
