export interface CreatorProfile {
  id: string;
  organizationId: string;
  name?: string;
  slug?: string;
  bio: string | null;
  bannerUrl: string | null;
  aboutHtml: string | null;
  socialLinks: Array<{ platform: string; url: string }>;
  theme: Record<string, any> | null;
}

export interface CreatorTier {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  rank: number;
  priceMinor: number;
  currency: string;
  interval: string;
  benefits: string[];
  allowsDm: boolean;
  isActive: boolean;
  patronCount?: number;
}

export interface PostAttachment {
  id: string;
  fileRecordId: string;
  mimeType: string;
  fileName: string;
  sizeBytes?: number;
  caption: string | null;
  position: number;
  signedUrl: string;
}

export interface CreatorPost {
  id: string;
  organizationId: string;
  title: string;
  body?: string | null;
  excerpt?: string | null;
  minTierRank: number;
  status?: string;
  category?: string | null;
  tags?: string[];
  embedUrl?: string | null;
  likeCount: number;
  commentCount: number;
  publishedAt?: string | null;
  scheduledPublishAt?: string | null;
  createdAt: string;
  locked: boolean;
  isLocked?: boolean;
  isLiked?: boolean;
  requiredTierRank?: number;
  requiredTier?: {
    name: string;
    priceMinor: number;
    currency: string;
  } | null;
  attachments?: PostAttachment[];
}

export interface Patron {
  id: string;
  organizationId: string;
  userId: string;
  tierId: string | null;
  tierRank: number;
  tierName?: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  tier?: {
    id: string;
    name: string;
    rank: number;
    allowsDm?: boolean;
  } | null;
  isPatron?: boolean;
}

export interface FeedResponse {
  posts: CreatorPost[];
  items?: CreatorPost[];
  total: number;
  page: number;
  limit: number;
}
