export type LinktreeButtonStyle = "rounded" | "square" | "pill";

export interface LinktreeTheme {
  backgroundColor?: string;
  buttonColor?: string;
  buttonStyle?: LinktreeButtonStyle;
  fontFamily?: string;
}

export interface LinktreeLink {
  id: string;
  pageId: string;
  title: string;
  originalUrl: string;
  shortioLinkId?: string | null;
  shortUrl?: string | null;
  thumbnailUrl?: string | null;
  position: number;
  isEnabled: boolean;
  tags?: string[];
  scheduledStart?: string | null;
  scheduledEnd?: string | null;
  totalClicks?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinktreeSocialLink {
  id: string;
  pageId: string;
  platform: string;
  url: string;
  position: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LinktreePage {
  id: string;
  organizationId: string;
  slug: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  maxLinks: number;
  isPublished: boolean;
  theme?: LinktreeTheme | null;
  links: LinktreeLink[];
  socialLinks: LinktreeSocialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageInput {
  slug: string;
  title: string;
  bio?: string;
  avatarUrl?: string;
  maxLinks?: number;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  theme?: LinktreeTheme;
}

export interface UpdatePageInput {
  slug?: string;
  title?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  maxLinks?: number;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  theme?: LinktreeTheme | null;
}

export interface CreateLinkInput {
  title: string;
  originalUrl: string;
  thumbnailUrl?: string;
  position?: number;
  tags?: string[];
  scheduledStart?: string | null;
  scheduledEnd?: string | null;
}

export interface UpdateLinkInput {
  title?: string;
  originalUrl?: string;
  thumbnailUrl?: string | null;
  position?: number;
  tags?: string[];
  scheduledStart?: string | null;
  scheduledEnd?: string | null;
}

export interface ReorderLinksInput {
  orderedIds: string[];
}

export interface CreateSocialLinkInput {
  platform: string;
  url: string;
  position?: number;
}

export interface UpdateSocialLinkInput {
  platform?: string;
  url?: string;
  position?: number;
}

export interface ReorderSocialLinksInput {
  orderedIds: string[];
}

export interface PageAnalyticsOverview {
  totalClicks: number;
  totalLinks: number;
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    shortUrl?: string;
  }>;
  clicksOverTime: Array<{
    date: string;
    clicks: number;
  }>;
}

export interface LinkCountryStat {
  country: string;
  clicks: number;
}

export interface LinkTimeSeriesPoint {
  date: string;
  clicks: number;
}

export interface LinkTopReferrer {
  referrer: string;
  clicks: number;
}

export interface LinkRecentClick {
  clickedAt: string;
  country?: string;
  browser?: string;
  os?: string;
}

export interface LinkAnalyticsDetail {
  linkId: string;
  totalClicks: number;
  countries?: LinkCountryStat[];
  timeSeries?: LinkTimeSeriesPoint[];
  topReferrers?: LinkTopReferrer[];
  recentClicks?: LinkRecentClick[];
}

export interface QrCodeResult {
  qrCodeUrl?: string;
  qrCodeSvg?: string;
  shortUrl: string;
}
