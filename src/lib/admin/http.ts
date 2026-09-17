import axios from "axios";
import { isAdminError, malformed, normalizeError, type AdminError } from "./errors";

function resolveAdminApiBase(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:8000/api";
  const withoutVersion = trimmed.replace(/\/v1$/i, "");
  if (withoutVersion.endsWith("/api")) return withoutVersion;
  return `${withoutVersion}/api`;
}

const base = resolveAdminApiBase(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
);

export const adminHttp = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

export type AdminRequestSpec<T> = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  query?: Readonly<Record<string, string | number | boolean | undefined>>;
  body?: Readonly<Record<string, unknown>>;
  parse: (raw: unknown, at: string) => T;
};

function stripUndefined(
  query?: Readonly<Record<string, string | number | boolean | undefined>>,
): Record<string, string | number | boolean> | undefined {
  if (!query) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

function compact(body: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    out[key] = value;
  }
  return out;
}

async function request<T>(
  prefix: "/admin" | "/auth" | "/org",
  spec: AdminRequestSpec<T>,
): Promise<T> {
  try {
    const response = await adminHttp.request({
      method: spec.method,
      url: `${prefix}${spec.path}`,
      params: stripUndefined(spec.query),
      data: spec.body ? compact(spec.body) : undefined,
    });
    try {
      return spec.parse(response.data, `${prefix}${spec.path}`);
    } catch (error) {
      if (isAdminError(error)) throw error;
      throw malformed(
        error instanceof Error ? error.message : "Unexpected response shape",
        `${prefix}${spec.path}`,
      );
    }
  } catch (error) {
    if (isAdminError(error)) throw error;
    throw normalizeError(error);
  }
}

export function adminRequest<T>(spec: AdminRequestSpec<T>): Promise<T> {
  return request("/admin", spec);
}

export function authRequest<T>(spec: AdminRequestSpec<T>): Promise<T> {
  return request("/auth", spec);
}

export function orgRequest<T>(spec: AdminRequestSpec<T>): Promise<T> {
  return request("/org", spec);
}

export function assertSameSiteInDev(): void {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;
  try {
    const apiHost = new URL(base).hostname;
    const pageHost = window.location.hostname;
    if (base.includes("/v1")) {
      console.warn(
        "NEXT_PUBLIC_API_URL should not include /v1; admin routes live under /api/admin.",
      );
    }
    const apiSite = apiHost.replace(/^www\./, "");
    const pageSite = pageHost.replace(/^www\./, "");
    if (apiSite !== pageSite && apiSite !== "localhost" && pageSite !== "localhost") {
      console.warn(
        `Admin API origin (${apiHost}) and page origin (${pageHost}) may not share a site; SameSite=Lax cookies will not be sent.`,
      );
    }
  } catch {
    // ignore invalid URL in env
  }
}

export type { AdminError };
