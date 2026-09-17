import { ExternalLink } from "lucide-react";
import { SocialIcon } from "@/components/client-admin/linktree/social-icons";
import type { PublicLinktreeData } from "@/lib/client-admin/linktree/public";

function SkullMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c-4.4 0-8 3.1-8 7.4 0 2.6 1.4 4.9 3.5 6.2V18c0 .6.4 1 1 1h1v2h5v-2h1c.6 0 1-.4 1-1v-2.4c2.1-1.3 3.5-3.6 3.5-6.2C20 5.1 16.4 2 12 2zm-2.2 8.2a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zM12 16.2c-1.3 0-2.4-.5-2.8-1.1h5.6c-.4.6-1.5 1.1-2.8 1.1z" />
    </svg>
  );
}

function StarSparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l1.4 6.6L20 10l-6.6 1.4L12 18l-1.4-6.6L4 10l6.6-1.4L12 2z" />
    </svg>
  );
}

function KuromiBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 56" fill="none" className={className} aria-hidden>
      <path
        d="M8 28c0-14 12-24 28-18 6 2 10 7 14 12 2-8 10-16 22-16s20 8 22 16c4-5 8-10 14-12 16-6 28 4 28 18s-12 24-28 18c-8-3-14-10-18-16-3 8-10 16-18 16s-15-8-18-16c-4 6-10 13-18 16C20 52 8 42 8 28z"
        fill="#1a1024"
        stroke="#ff4d9a"
        strokeWidth="2.5"
      />
      <circle cx="60" cy="28" r="8" fill="#ff4d9a" />
      <circle cx="60" cy="28" r="3.5" fill="#fce7f3" />
    </svg>
  );
}

export function RunachanLinkPage({ data }: { data: PublicLinktreeData }) {
  const title = data.title;
  const bio = data.bio;
  const avatarUrl = data.avatarUrl;
  const links = data.links;
  const socialLinks = data.socialLinks;

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center overflow-hidden px-4 py-12 text-pink-50">
      <style>{`
        @keyframes kuromi-pulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes kuromi-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .kuromi-glow { animation: kuromi-pulse 4.5s ease-in-out infinite; }
        .kuromi-float { animation: kuromi-float 5s ease-in-out infinite; }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, rgba(255,77,154,0.28), transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(168,85,247,0.18), transparent 45%), #0b0710",
        }}
        aria-hidden
      />
      <div
        className="kuromi-glow pointer-events-none absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full bg-pink-500/20 blur-3xl"
        aria-hidden
      />

      <StarSparkle className="pointer-events-none absolute left-8 top-16 h-5 w-5 text-pink-400/80" />
      <StarSparkle className="pointer-events-none absolute right-10 top-28 h-4 w-4 text-fuchsia-300/70" />
      <SkullMark className="pointer-events-none absolute bottom-24 left-6 h-7 w-7 text-pink-500/40" />
      <SkullMark className="pointer-events-none absolute right-8 top-1/2 h-6 w-6 text-purple-300/40" />

      <div className="relative z-10 mx-auto flex w-full max-w-110 flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <div className="kuromi-float relative">
            <KuromiBow className="absolute -top-10 left-1/2 h-16 w-36 -translate-x-1/2" />
            <div className="relative mt-4 h-28 w-28 overflow-hidden rounded-full border-[3px] border-pink-400 bg-[#1a1024] shadow-[0_0_28px_rgba(255,77,154,0.55)]">
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={avatarUrl} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-black text-pink-200">
                  {title.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-pink-400/90">
            Kuromi club
          </p>
          <h1
            className="mt-1 text-3xl font-black tracking-tight text-transparent"
            style={{
              backgroundImage: "linear-gradient(120deg, #fce7f3 0%, #ff4d9a 45%, #e9d5ff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              fontFamily: '"Comic Sans MS", "Snell Roundhand", cursive',
            }}
          >
            {title}
          </h1>
          {bio && (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-pink-100/75">{bio}</p>
          )}
        </div>

        <div className="mt-8 flex w-full flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-pink-400/40 bg-[#140a1c]/80 px-4 py-3.5 shadow-[0_0_18px_rgba(255,77,154,0.18)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-[0_0_28px_rgba(255,77,154,0.4)]"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-pink-300 to-transparent opacity-70" />
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-pink-400/30 bg-pink-500/10 text-pink-200">
                {link.thumbnailUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={link.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <SkullMark className="h-5 w-5" />
                )}
              </div>
              <span className="flex-1 truncate text-sm font-semibold tracking-wide text-pink-50">
                {link.title}
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-pink-300/70 transition-colors group-hover:text-pink-200" />
            </a>
          ))}
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-400/40 bg-[#1a1024] text-pink-200 shadow-[0_0_12px_rgba(255,77,154,0.25)] transition-transform hover:scale-110 hover:border-pink-300 hover:text-white"
              >
                <SocialIcon platform={social.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}
      </div>

      <footer className="relative z-10 mt-14 text-center text-[11px] uppercase tracking-[0.2em] text-pink-300/50">
        <p>
          Powered by{" "}
          <a
            href="https://vitamin2001.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-pink-200/80 hover:text-pink-100"
          >
            Vitamin
          </a>
        </p>
      </footer>
    </main>
  );
}
