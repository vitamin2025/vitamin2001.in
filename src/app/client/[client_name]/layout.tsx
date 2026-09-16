import { getClientConfigOrFallback } from "@/config/clients";
import { ClientProvider } from "@/providers/client-provider";
import type { ClientLayoutProps } from "@/types/client";

export default async function ClientLayout({
  children,
  params,
}: ClientLayoutProps) {
  const { client_name } = await params;
  const client = getClientConfigOrFallback(client_name);
  const clientScopingClass = `client-${client_name.toLowerCase()}`;

  return (
    <ClientProvider client={client} clientName={client_name}>
      <div className={`${clientScopingClass} min-h-screen flex flex-col`}>
        {children}
      </div>
    </ClientProvider>
  );
}
