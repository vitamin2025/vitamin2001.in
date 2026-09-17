import apiClient from "../axios";
import { getClientConfig } from "@/config/clients";
import { ClientConfig } from "@/types/client";

export interface ClientDashboardStats {
  activeUsers: number;
  requestsCount: number;
  storageUsedMb: number;
  systemHealth: "healthy" | "degraded" | "down";
  lastSync: string;
}

export interface ClientActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
}

/**
 * Fetch client metadata (falls back to local registry if backend is unavailable)
 */
export async function fetchClientDetails(clientName: string): Promise<ClientConfig> {
  try {
    const res = await apiClient.get<ClientConfig>(`/clients/${clientName}`);
    return res.data;
  } catch {
    // Graceful fallback to client registry for placeholder development
    const local = getClientConfig(clientName);
    if (!local) {
      throw new Error(`Client "${clientName}" not found in registry.`);
    }
    return local;
  }
}

/**
 * Fetch admin dashboard statistics for a given client
 */
export async function fetchClientStats(clientName: string): Promise<ClientDashboardStats> {
  try {
    const res = await apiClient.get<ClientDashboardStats>(`/clients/${clientName}/stats`);
    return res.data;
  } catch {
    // Return realistic mock data when backend is not running
    return {
      activeUsers: 42,
      requestsCount: 12480,
      storageUsedMb: 512,
      systemHealth: "healthy",
      lastSync: new Date().toLocaleTimeString(),
    };
  }
}

/**
 * Fetch recent audit activities for a client
 */
export async function fetchClientActivities(clientName: string): Promise<ClientActivity[]> {
  try {
    const res = await apiClient.get<ClientActivity[]>(`/clients/${clientName}/activities`);
    return res.data;
  } catch {
    return [
      {
        id: "act-1",
        action: "Configuration updated",
        user: "admin@runachan.vitamin2001.in",
        timestamp: "10 mins ago",
        status: "success",
      },
      {
        id: "act-2",
        action: "API Key rotated",
        user: "system",
        timestamp: "2 hours ago",
        status: "success",
      },
      {
        id: "act-3",
        action: "SSL certificate checked",
        user: "cloudflare-bot",
        timestamp: "5 hours ago",
        status: "success",
      },
    ];
  }
}
