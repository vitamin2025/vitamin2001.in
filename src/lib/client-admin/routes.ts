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
  creator: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/creator`,
  creatorProfile: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/creator/profile`,
  creatorTiers: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/creator/tiers`,
  creatorPosts: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/creator/posts`,
  creatorPatrons: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/creator/patrons`,
  creatorEarnings: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/creator/earnings`,
  creatorInbox: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/admin/features/creator/inbox`,
  publicLinks: (_slug?: string) => {
    void _slug;
    return `/public/links`;
  },
  publicSite: (slug: string) => `/client/${encodeURIComponent(slug)}`,
};

export const clientUserRoutes = {
  login: () => "/client/user",
  fanLogin: (slug: string) => `/client/${encodeURIComponent(slug)}/user/login`,
  fanSignup: (slug: string) => `/client/${encodeURIComponent(slug)}/user/signup`,
  fanFeed: (slug: string) => `/client/${encodeURIComponent(slug)}/user/feed`,
  fanPost: (slug: string, postId: string) =>
    `/client/${encodeURIComponent(slug)}/user/post/${encodeURIComponent(postId)}`,
  fanAccount: (slug: string) => `/client/${encodeURIComponent(slug)}/user/account`,
  fanJoin: (slug: string) => `/client/${encodeURIComponent(slug)}/user/join`,
  fanMessages: (slug: string) => `/client/${encodeURIComponent(slug)}/user/messages`,
  membership: (slug: string) =>
    `/client/${encodeURIComponent(slug)}/public/membership`,
};
