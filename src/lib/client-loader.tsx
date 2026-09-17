import React from "react";
import type { ClientConfig } from "@/types/client";
import { DefaultLandingHero } from "@/components/defaults/landing-hero";
import { RunachanLandingHero } from "@/components/clients/runachan/landing-hero";

export function ClientLandingView({ client }: { client: ClientConfig }) {
  if (client.subdomain.toLowerCase() === "runachan") {
    return <RunachanLandingHero client={client} />;
  }
  return <DefaultLandingHero client={client} />;
}
