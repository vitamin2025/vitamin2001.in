import { malformed } from "./errors";

export function obj(value: unknown, at: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw malformed(`Expected object at ${at}`, at);
  }
  return value as Record<string, unknown>;
}

export function str(record: Record<string, unknown>, key: string, at: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw malformed(`Expected string ${at}.${key}`, `${at}.${key}`);
  }
  return value;
}

export function optStr(
  record: Record<string, unknown>,
  key: string,
  at: string,
): string | null {
  const value = record[key];
  if (value == null || value === "") return null;
  if (typeof value !== "string") {
    throw malformed(`Expected string ${at}.${key}`, `${at}.${key}`);
  }
  return value;
}

export function num(record: Record<string, unknown>, key: string, at: string): number {
  const value = record[key];
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw malformed(`Expected number ${at}.${key}`, `${at}.${key}`);
  }
  return parsed;
}

export function bool(record: Record<string, unknown>, key: string, at: string): boolean {
  const value = record[key];
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false" || value == null) {
    return false;
  }
  throw malformed(`Expected boolean ${at}.${key}`, `${at}.${key}`);
}

export function date(record: Record<string, unknown>, key: string, at: string): Date {
  const parsed = optDate(record, key, at);
  if (!parsed) {
    throw malformed(`Expected date ${at}.${key}`, `${at}.${key}`);
  }
  return parsed;
}

export function optDate(
  record: Record<string, unknown>,
  key: string,
  at: string,
): Date | null {
  const value = record[key];
  if (value == null || value === "") return null;
  const parsed = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw malformed(`Expected date ${at}.${key}`, `${at}.${key}`);
  }
  return parsed;
}

export function list<T>(
  value: unknown,
  at: string,
  item: (raw: unknown, at: string) => T,
): T[] {
  if (!Array.isArray(value)) {
    throw malformed(`Expected array at ${at}`, at);
  }
  return value.map((entry, index) => item(entry, `${at}[${index}]`));
}

export function jsonObject(
  record: Record<string, unknown>,
  key: string,
  at: string,
): Record<string, unknown> {
  const value = record[key];
  if (value == null || value === "") return {};
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      return {};
    } catch {
      return { raw: value };
    }
  }
  throw malformed(`Expected JSON object ${at}.${key}`, `${at}.${key}`);
}

export function describeClient(userAgent: string | null): string {
  if (!userAgent) return "Unknown client";
  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("Chrome/")) return "Chrome";
  if (userAgent.includes("Firefox/")) return "Firefox";
  if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) return "Safari";
  return userAgent.slice(0, 64);
}
