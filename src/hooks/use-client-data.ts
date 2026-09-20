"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchClientDetails,
  fetchClientStats,
  fetchClientActivities,
} from "@/lib/api/client-api";

export function useClientDetails(clientName: string) {
  return useQuery({
    queryKey: ["client", clientName, "details"],
    queryFn: () => fetchClientDetails(clientName),
    enabled: Boolean(clientName),
  });
}

export function useClientStats(clientName: string) {
  return useQuery({
    queryKey: ["client", clientName, "stats"],
    queryFn: () => fetchClientStats(clientName),
    enabled: Boolean(clientName),
  });
}

export function useClientActivities(clientName: string) {
  return useQuery({
    queryKey: ["client", clientName, "activities"],
    queryFn: () => fetchClientActivities(clientName),
    enabled: Boolean(clientName),
  });
}
