import { getClientConfigOrFallback } from "@/config/clients";
import { ClientAdminLoginView } from "@/components/client-admin";
import type { ClientPageProps } from "@/types/client";

export default async function AdminLoginPage({ params }: ClientPageProps) {
  const { client_name } = await params;
  const client = getClientConfigOrFallback(client_name);

  return (
    <ClientAdminLoginView
      slug={client_name}
      displayName={client.name}
    />
  );
}
