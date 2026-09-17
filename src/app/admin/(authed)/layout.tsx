import type { ReactNode } from "react";
import { AdminGate, AdminShell } from "@/components/admin";

export default function AuthedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
