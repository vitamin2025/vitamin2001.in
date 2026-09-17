export function isAdminError(error: unknown): error is AdminError {
  if (!error || typeof error !== "object") return false;
  const kind = (error as { kind?: unknown }).kind;
  return (
    kind === "unauthenticated" ||
    kind === "forbidden" ||
    kind === "notFound" ||
    kind === "conflict" ||
    kind === "invalid" ||
    kind === "rejected" ||
    kind === "throttled" ||
    kind === "server" ||
    kind === "offline" ||
    kind === "malformed"
  );
}

export type FieldErrors = Readonly<Record<string, readonly string[]>>;

export type AdminError =
  | { readonly kind: "unauthenticated"; readonly message: string }
  | { readonly kind: "forbidden"; readonly message: string }
  | { readonly kind: "notFound"; readonly message: string }
  | { readonly kind: "conflict"; readonly message: string }
  | {
      readonly kind: "invalid";
      readonly message: string;
      readonly fields: FieldErrors;
    }
  | { readonly kind: "rejected"; readonly message: string }
  | {
      readonly kind: "throttled";
      readonly message: string;
      readonly retryAfterMs: number | null;
    }
  | { readonly kind: "server"; readonly message: string; readonly status: number }
  | { readonly kind: "offline"; readonly message: string }
  | { readonly kind: "malformed"; readonly message: string; readonly at: string };

export function describe(error: AdminError): string {
  return error.message;
}

export function toAdminError(error: unknown): AdminError {
  if (isAdminError(error)) return error;
  return normalizeError(error);
}

export function malformed(message: string, at: string): AdminError {
  return { kind: "malformed", message, at };
}

export function fieldErrorsFor(
  knownFields: readonly string[],
  messages: readonly string[],
): FieldErrors {
  const fields: Record<string, string[]> = {};
  for (const message of messages) {
    const lower = message.toLowerCase();
    const match = knownFields.find((field) =>
      lower.includes(field.toLowerCase()),
    );
    const key = match ?? "_form";
    fields[key] = [...(fields[key] ?? []), message];
  }
  return fields;
}

export function retryUnlessAuthz(failureCount: number, error: unknown): boolean {
  const adminError = toAdminError(error);
  if (
    adminError.kind === "unauthenticated" ||
    adminError.kind === "forbidden"
  ) {
    return false;
  }
  return failureCount < 1;
}

function extractMessage(data: unknown): string | string[] {
  if (!data || typeof data !== "object") return "Request failed";
  const message = (data as { message?: unknown }).message;
  if (Array.isArray(message)) return message.map(String);
  if (typeof message === "string" && message.trim()) return message;
  return "Request failed";
}

export function normalizeError(err: unknown): AdminError {
  if (isAdminError(err)) return err;

  if (typeof err === "object" && err !== null && "isAxiosError" in err) {
    const axiosError = err as {
      response?: {
        status: number;
        data?: unknown;
        headers?: Record<string, unknown>;
      };
      message?: string;
    };
    if (!axiosError.response) {
      return { kind: "offline", message: "Unable to reach the API." };
    }

    const status = axiosError.response.status;
    const payload = extractMessage(axiosError.response.data);
    const message = Array.isArray(payload) ? payload.join(" ") : payload;

    if (status === 401) {
      return { kind: "unauthenticated", message: message || "Authentication required" };
    }
    if (status === 403) {
      return {
        kind: "forbidden",
        message: message || "Super-admin privileges required",
      };
    }
    if (status === 404) {
      return { kind: "notFound", message: message || "Not found" };
    }
    if (status === 409) {
      return { kind: "conflict", message: message || "Conflict" };
    }
    if (status === 429) {
      const retryAfter = axiosError.response.headers?.["retry-after"];
      const seconds = typeof retryAfter === "string" ? Number(retryAfter) : NaN;
      return {
        kind: "throttled",
        message: message || "Too many requests",
        retryAfterMs: Number.isFinite(seconds) ? seconds * 1000 : null,
      };
    }
    if (status === 400) {
      if (Array.isArray(payload)) {
        return {
          kind: "invalid",
          message: payload.join(" "),
          fields: fieldErrorsFor([], payload),
        };
      }
      return { kind: "rejected", message };
    }
    if (status >= 500) {
      return { kind: "server", message, status };
    }
    return { kind: "server", message, status };
  }

  if (err instanceof Error) {
    return { kind: "server", message: err.message, status: 0 };
  }

  return { kind: "server", message: "Unexpected error", status: 0 };
}
