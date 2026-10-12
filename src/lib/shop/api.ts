/**
 * Calls the backend shop API. Works in server components (catalog, with Next's data cache) and in
 * the browser (cart, checkout, orders, account, with the api.vitamin2001.in cookies).
 */

/** `NEXT_PUBLIC_API_URL` is the API root ending in `/api`, as the admin client resolves it. */
function resolveApiBase(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:8000/api";
  const withoutVersion = trimmed.replace(/\/v1$/i, "");
  if (withoutVersion.endsWith("/api")) return withoutVersion;
  return `${withoutVersion}/api`;
}

export const SHOP_API_BASE = `${resolveApiBase(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
)}/v1/shop`;

/** The shop sleeps when idle; the API retries for up to 20 s while it starts. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * The store a request is for: a seller's slug, or `null` for the house shop that vitamin2001.in
 * shows (the API's plain routes).
 */
export type StoreSlug = string | null;

export function storePrefix(seller: StoreSlug): string {
  return seller ? `/sellers/${encodeURIComponent(seller)}` : "";
}

/** An answer from the shop API that wasn't 2xx. Switch on `code`, never on `message`. */
export class ShopApiError extends Error {
  constructor(
    readonly status: number,
    /** Stable error code, e.g. `STORE_NOT_FOUND`. Null for validation and rate-limit errors. */
    readonly code: string | null,
    message: string,
  ) {
    super(message);
    this.name = "ShopApiError";
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export function isShopApiError(error: unknown): error is ShopApiError {
  return error instanceof ShopApiError;
}

/** A message fit to show a shopper. */
export function shopErrorMessage(error: unknown): string {
  if (isShopApiError(error)) {
    if (error.status === 429) return "Too many requests. Please wait a moment and try again.";
    return error.message || "Something went wrong. Please try again.";
  }
  return "We couldn't reach the shop. Check your connection and try again.";
}

async function toError(response: Response): Promise<ShopApiError> {
  let code: string | null = null;
  let message = `The shop answered ${response.status}.`;
  try {
    const body = (await response.json()) as { code?: unknown; message?: unknown };
    if (typeof body.code === "string") code = body.code;
    if (typeof body.message === "string") message = body.message;
    else if (Array.isArray(body.message)) message = body.message.join(" ");
  } catch {
    // not JSON
  }
  return new ShopApiError(response.status, code, message);
}

export interface ShopFetchOptions {
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly body?: unknown;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  /** Seconds Next may cache a server-side GET. Leave unset for no caching. */
  readonly revalidate?: number;
  readonly tags?: readonly string[];
}

export async function shopFetch<T>(path: string, options: ShopFetchOptions = {}): Promise<T> {
  const url = new URL(`${SHOP_API_BASE}${path}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value === undefined || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const isServer = typeof window === "undefined";
  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: isServer ? undefined : "include",
      signal: controller.signal,
      ...(isServer
        ? options.revalidate !== undefined
          ? { next: { revalidate: options.revalidate, tags: options.tags ? [...options.tags] : undefined } }
          : { cache: "no-store" as const }
        : {}),
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ShopApiError(503, "SHOP_UNAVAILABLE", "The shop is taking too long to answer. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) throw await toError(response);
  return (await response.json()) as T;
}
