import type { Metadata } from "next";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { getClientConfigOrFallback } from "@/config/clients";
import { SocialIcon } from "@/components/client-admin/linktree/social-icons";
import type { LinktreePage } from "@/lib/client-admin/linktree/types";

interface PublicLinktreeProps {
  params: Promise<{ client_name: string }>;
}

async function fetchPublicPage(slug: string): Promise<LinktreePage | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const normalizedBase = apiBase.replace(/\/+$/, "").replace(/\/v1$/i, "");
  const url = `${normalizedBase}/v1/p/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PublicLinktreeProps): Promise<Metadata> {
  const { client_name } = await params;
  const page = await fetchPublicPage(client_name);
  const client = getClientConfigOrFallback(client_name);

  const title = page?.ogTitle || page?.title || `${client.name} — Official Links`;
  const description =
    page?.ogDescription ||
    page?.bio ||
    client.tagline ||
    `Official links and social profiles for ${client.name}.`;
  const images = page?.ogImage
    ? [page.ogImage]
    : page?.avatarUrl
      ? [page.avatarUrl]
      : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: page?.ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export default async function PublicLinktreePage({ params }: PublicLinktreeProps) {
  const { client_name } = await params;
  const page = await fetchPublicPage(client_name);
  const client = getClientConfigOrFallback(client_name);

  // Fallback placeholder data if backend isn't populated yet
  const title = page?.title || client.name;
  const bio =
    page?.bio ||
    client.tagline ||
    `Welcome to our official links directory. Connect with us and explore our platforms below.`;
  const avatarUrl = page?.avatarUrl;

  const theme = page?.theme || {
    backgroundColor: "#0f172a",
    buttonColor: "#4f46e5",
    buttonStyle: "pill" as const,
    fontFamily: "Inter",
  };

  const backgroundColor = theme.backgroundColor || "#0f172a";
  const buttonColor = theme.buttonColor || "#4f46e5";
  const buttonStyle = theme.buttonStyle || "pill";
  const fontFamily = theme.fontFamily || "Inter";

  const buttonRadiusClass =
    buttonStyle === "square"
      ? "rounded-none"
      : buttonStyle === "rounded"
        ? "rounded-xl"
        : "rounded-full";

  // Filter links: only enabled links that are currently within their schedule window
  const now = new Date();
  const rawLinks = page?.links || [
    {
      id: "placeholder-1",
      pageId: "placeholder",
      title: "Official Website",
      originalUrl: `https://${client_name}.vitamin2001.in`,
      shortUrl: `https://${client_name}.vitamin2001.in`,
      position: 0,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "placeholder-2",
      pageId: "placeholder",
      title: "Community Discord & Telegram",
      originalUrl: "https://discord.gg",
      shortUrl: "https://discord.gg",
      position: 1,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "placeholder-3",
      pageId: "placeholder",
      title: "Latest Announcements & Blog",
      originalUrl: "https://medium.com",
      shortUrl: "https://medium.com",
      position: 2,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const links = rawLinks
    .filter((l) => {
      if (!l.isEnabled) return false;
      if (l.scheduledStart && new Date(l.scheduledStart) > now) return false;
      if (l.scheduledEnd && new Date(l.scheduledEnd) < now) return false;
      return true;
    })
    .sort((a, b) => a.position - b.position);

  const rawSocial = page?.socialLinks || [
    {
      id: "soc-1",
      pageId: "placeholder",
      platform: "twitter",
      url: "https://x.com",
      position: 0,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "soc-2",
      pageId: "placeholder",
      platform: "github",
      url: "https://github.com",
      position: 1,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "soc-3",
      pageId: "placeholder",
      platform: "website",
      url: "https://vitamin2001.in",
      position: 2,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const socialLinks = rawSocial
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.position - b.position);

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-between px-4 py-12 transition-colors duration-200"
      style={{
        background: backgroundColor,
        fontFamily: fontFamily,
      }}
    >
      {/* Background subtle radial overlay for visual polish */}
      <div
        className="pointer-events-none absolute inset-0 bg-radial-[at_top] from-white/10 to-transparent opacity-60"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col items-center">
        {/* Header Profile Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/20 bg-white/10 shadow-xl ring-4 ring-black/10">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-white">
                {title.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="mt-4 text-xl font-bold tracking-tight text-white drop-shadow-sm">
            {title}
          </h1>

          {bio && (
            <p className="mt-2 max-w-sm text-sm text-white/80 leading-relaxed drop-shadow-xs">
              {bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="mt-8 flex w-full flex-col gap-3.5">
          {links.map((link) => {
            const destination = link.shortUrl || link.originalUrl;
            return (
              <a
                key={link.id}
                href={destination}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex w-full items-center justify-between px-5 py-3.5 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] ${buttonRadiusClass}`}
                style={{
                  backgroundColor: buttonColor,
                }}
              >
                {/* Optional Left Thumbnail */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/10 text-white/80">
                  {link.thumbnailUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={link.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </div>

                {/* Title */}
                <span className="flex-1 px-3 truncate text-sm font-medium tracking-wide">
                  {link.title}
                </span>

                {/* Right Arrow */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center opacity-60 transition-opacity group-hover:opacity-100">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Social Icons Bar */}
        {socialLinks.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-sm backdrop-blur-xs transition-transform hover:scale-110 hover:bg-white/20 active:scale-95"
              >
                <SocialIcon platform={social.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 mt-12 text-center text-xs text-white/50">
        <p className="flex items-center justify-center gap-1">
          <span>Powered by</span>
          <a
            href="https://vitamin2001.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white/80 transition-colors hover:text-white hover:underline"
          >
            Vitamin
          </a>
        </p>
      </footer>
    </main>
  );
}
