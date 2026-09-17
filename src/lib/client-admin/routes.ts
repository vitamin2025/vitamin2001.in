export const clientAdminRoutes = {
  login: (slug: string) => `/client/${encodeURIComponent(slug)}/admin/login`,
  dashboard: (slug: string) => `/client/${encodeURIComponent(slug)}/admin`,
  members: (slug: string) => `/client/${encodeURIComponent(slug)}/admin/members`,
  settings: (slug: string) => `/client/${encodeURIComponent(slug)}/admin/settings`,
  billing: (slug: string) => `/client/${encodeURIComponent(slug)}/admin/billing`,
  audit: (slug: string) => `/client/${encodeURIComponent(slug)}/admin/audit`,
  feature: (slug: string, feature: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/${encodeURIComponent(feature)}`,
  linktree: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/linktree`,
  linktreeSettings: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/linktree/settings`,
  linktreeAnalytics: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/linktree/analytics`,
  publicLinks: (_slug: string) => `/public/links`,
  publicSite: (slug: string) => `/client/${encodeURIComponent(slug)}`,
};

export const clientUserRoutes = {
  login: () => "/client/user",
};
