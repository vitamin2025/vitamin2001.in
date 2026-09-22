export const creatorKeys = {
  all: ["creator"] as const,
  profile: (slug: string) => [...creatorKeys.all, "profile", slug] as const,
  tiers: (slug: string) => [...creatorKeys.all, "tiers", slug] as const,
  posts: (slug: string, filters?: Record<string, any>) =>
    [...creatorKeys.all, "posts", slug, filters] as const,
  post: (slug: string, postId: string) =>
    [...creatorKeys.all, "post", slug, postId] as const,
  patrons: (slug: string, filters?: Record<string, any>) =>
    [...creatorKeys.all, "patrons", slug, filters] as const,
  fanMe: (slug: string) => [...creatorKeys.all, "fanMe", slug] as const,
  fanFeed: (slug: string, filters?: Record<string, any>) =>
    [...creatorKeys.all, "fanFeed", slug, filters] as const,
  publicTiers: (slug: string) =>
    [...creatorKeys.all, "publicTiers", slug] as const,
  publicProfile: (slug: string) =>
    [...creatorKeys.all, "publicProfile", slug] as const,
  earnings: (slug: string) => [...creatorKeys.all, "earnings", slug] as const,
  inbox: (slug: string) => [...creatorKeys.all, "inbox", slug] as const,
  comments: (slug: string, postId: string) =>
    [...creatorKeys.all, "comments", slug, postId] as const,
  messages: (slug: string) => [...creatorKeys.all, "messages", slug] as const,
};
