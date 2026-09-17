import { ReactNode } from "react";
import { LinktreeHeader } from "@/components/client-admin/linktree";

export default function LinktreeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <LinktreeHeader />
      <div>{children}</div>
    </div>
  );
}
