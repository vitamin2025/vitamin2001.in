import type { UserId } from "./ids";

export const adminRoutes = {
  login: () => "/admin/login",
  overview: () => "/admin",
  users: (query?: { q?: string; page?: number }) => {
    const params = new URLSearchParams();
    if (query?.q) params.set("q", query.q);
    if (query?.page && query.page > 1) params.set("page", String(query.page));
    const qs = params.toString();
    return qs ? `/admin/users?${qs}` : "/admin/users";
  },
  userNew: () => "/admin/users/new",
  user: (id: UserId | string) => `/admin/users/${encodeURIComponent(id)}`,
  orgs: () => "/admin/organizations",
  orgNew: () => "/admin/organizations/new",
  org: (id: string) => `/admin/organizations/${encodeURIComponent(id)}`,
  sessions: () => "/admin/sessions",
  audit: () => "/admin/audit",
  storage: (query?: { clientId?: string; category?: string; page?: number }) => {
    const params = new URLSearchParams();
    if (query?.clientId) params.set("clientId", query.clientId);
    if (query?.category) params.set("category", query.category);
    if (query?.page && query.page > 1) params.set("page", String(query.page));
    const qs = params.toString();
    return qs ? `/admin/storage?${qs}` : "/admin/storage";
  },
  entityTrail: (entity: { type: string; id: string }) =>
    `/admin/audit/${encodeURIComponent(entity.type)}/${encodeURIComponent(entity.id)}`,
};
