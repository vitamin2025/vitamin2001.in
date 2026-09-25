import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { SocialIcon } from "@/components/client-admin/linktree/social-icons";
import type { ClientConfig } from "@/types/client";
import type { PublicLinktreeData } from "@/lib/client-admin/linktree/public";

export function DefaultLinkPage({
  data,
  client,
  clientName,
}: {
  data: PublicLinktreeData | null;
  client: ClientConfig;
  clientName: string;
}) {
  const title = data?.title || client.name;
  const bio =
    data?.bio ||
    client.tagline ||
    `Welcome to our official links directory. Connect with us and explore our platforms below.`;
  const avatarUrl = data?.avatarUrl;

  const theme = data?.theme || {
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

  const links =
    data?.links && data.links.length > 0
      ? data.links
      : [
          {
            id: "placeholder-1",
            title: "Official Website",
            href: `https://${clientName}.vitamin2001.in`,
            thumbnailUrl: null,
            position: 0,
          },
          {
            id: "placeholder-2",
            title: "Community Discord & Telegram",
            href: "https://discord.gg",
            thumbnailUrl: null,
            position: 1,
          },
          {
            id: "placeholder-3",
            title: "Latest Announcements & Blog",
            href: "https://medium.com",
            thumbnailUrl: null,
            position: 2,
          },
        ];

  const socialLinks =
    data?.socialLinks && data.socialLinks.length > 0
      ? data.socialLinks
      : [
          {
            id: "soc-1",
            platform: "twitter",
            url: "https://x.com",
            position: 0,
          },
          {
            id: "soc-2",
            platform: "github",
            url: "https://github.com",
            position: 1,
          },
          {
            id: "soc-3",
            platform: "website",
            url: "https://vitamin2001.in",
            position: 2,
          },
        ];

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-between px-4 py-12 transition-colors duration-200"
      style={{
        background: backgroundColor,
        fontFamily: fontFamily,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-radial-[at_top] from-white/10 to-transparent opacity-60"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-120 flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/20 bg-white/10 shadow-xl ring-4 ring-black/10">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={avatarUrl} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-white">
                {title.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="mt-4 text-xl font-bold tracking-tight text-white drop-shadow-sm">{title}</h1>

          {bio && (
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80 drop-shadow-xs">{bio}</p>
          )}
        </div>

        <div className="mt-8 flex w-full flex-col gap-3.5">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex w-full items-center justify-between px-5 py-3.5 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] ${buttonRadiusClass}`}
              style={{ backgroundColor: buttonColor }}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/10 text-white/80">
                {link.thumbnailUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={link.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <LinkIcon className="h-4 w-4" />
                )}
              </div>

              <span className="flex-1 truncate px-3 text-sm font-medium tracking-wide">{link.title}</span>

              <div className="flex h-7 w-7 shrink-0 items-center justify-center opacity-60 transition-opacity group-hover:opacity-100">
                <ExternalLink className="h-4 w-4" />
              </div>
            </a>
          ))}
        </div>

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
    </main>
  );
}
