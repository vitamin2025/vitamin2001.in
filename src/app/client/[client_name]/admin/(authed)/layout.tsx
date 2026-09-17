import { ClientAdminGate, ClientAdminShell } from "@/components/client-admin";
import type { ClientLayoutProps } from "@/types/client";

export default async function AuthedClientAdminLayout({
  children,
  params,
}: ClientLayoutProps) {
  const { client_name } = await params;

  return (
    <ClientAdminGate slug={client_name}>
      <ClientAdminShell>{children}</ClientAdminShell>
    </ClientAdminGate>
  );
}
