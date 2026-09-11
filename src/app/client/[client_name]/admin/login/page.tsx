import React from "react";
import { notFound } from "next/navigation";
import { getClientConfig } from "@/config/clients";
import { LoginForm } from "@/components/auth/login-form";
import type { ClientPageProps } from "@/types/client";

export default async function AdminLoginPage({ params }: ClientPageProps) {
  const { client_name } = await params;
  const client = getClientConfig(client_name);

  if (!client) {
    notFound();
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm
        clientName={client_name}
        clientDisplayName={client.name}
      />
    </div>
  );
}
