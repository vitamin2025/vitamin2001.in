import { Mochiy_Pop_One, M_PLUS_Rounded_1c } from "next/font/google";
import { SocialIcon } from "@/components/client-admin/linktree/social-icons";
import type { PublicLinktreeData } from "@/lib/client-admin/linktree/public";

const displayFont = Mochiy_Pop_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const PROFILE_STAMPS = ["COSPLAY", "アニメ", "かわいい"] as const;
const CARD_STAMPS = ["推し", "NEW", "★", "♥"] as const;

function JesterSkull({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className={className} aria-hidden>
      <path d="M40 42L16 16l10 32L40 42z" fill="#120814" stroke="#ff4d9a" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M40 42l24-26-10 32L40 42z" fill="#120814" stroke="#ff4d9a" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="6" fill="#ff4d9a" />
      <circle cx="64" cy="16" r="6" fill="#ff4d9a" />
      <circle cx="16" cy="16" r="2.1" fill="#fce7f3" />
      <circle cx="64" cy="16" r="2.1" fill="#fce7f3" />
      <path d="M20 44h40c4 0 7 3 7 7v5H13v-5c0-4 3-7 7-7z" fill="#120814" stroke="#ff4d9a" strokeWidth="2" />
      <path
        d="M18 56c0-12 10-20 22-20s22 8 22 20v22c0 8-8 14-22 14s-22-6-22-14V56z"
        fill="#fff1f7"
        stroke="#120814"
        strokeWidth="2.4"
      />
      <ellipse cx="31" cy="66" rx="6" ry="7.2" fill="#120814" />
      <ellipse cx="49" cy="66" rx="6" ry="7.2" fill="#120814" />
      <circle cx="33" cy="64" r="1.6" fill="#fce7f3" />
      <circle cx="51" cy="64" r="1.6" fill="#fce7f3" />
      <path d="M40 74l-2.4 3.4h4.8L40 74z" fill="#120814" />
      <ellipse cx="24" cy="76" rx="4.2" ry="2.2" fill="#ff8ac4" opacity="0.9" />
      <ellipse cx="56" cy="76" rx="4.2" ry="2.2" fill="#ff8ac4" opacity="0.9" />
      <path d="M34 84c2 3 10 3 12 0" stroke="#120814" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function KuromiBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 58" fill="none" className={className} aria-hidden>
      <path
        d="M70 29C52 8 22 8 14 24c-6 12 8 24 28 16 8-3 16-7 28-11z"
        fill="#120814"
        stroke="#ff4d9a"
        strokeWidth="2.4"
      />
      <path
        d="M70 29C88 8 118 8 126 24c6 12-8 24-28 16-8-3-16-7-28-11z"
        fill="#120814"
        stroke="#ff4d9a"
        strokeWidth="2.4"
      />
      <path d="M58 38 48 54" stroke="#ff4d9a" strokeWidth="3" strokeLinecap="round" />
      <path d="M82 38 92 54" stroke="#ff4d9a" strokeWidth="3" strokeLinecap="round" />
      <rect x="62" y="20" width="16" height="18" rx="5" fill="#ff4d9a" stroke="#120814" strokeWidth="1.6" />
      <circle cx="70" cy="29" r="3.4" fill="#fce7f3" />
    </svg>
  );
}

function JesterEar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 58" fill="none" className={className} aria-hidden>
      <path
        d="M20 56C6 40 4 20 20 2c16 18 14 38 0 54z"
        fill="#120814"
        stroke="#ff4d9a"
        strokeWidth="2.2"
      />
      <path d="M20 46C12 34 12 20 20 10c8 10 8 24 0 36z" fill="#ff4d9a" />
      <ellipse cx="17" cy="22" rx="3.2" ry="6" fill="#fce7f3" opacity="0.55" />
    </svg>
  );
}

function StarSparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 1.6l1.8 7.2L21 10.6l-7.2 1.8L12 22.4l-1.8-9.8L3 10.6l7.2-1.8L12 1.6z" />
    </svg>
  );
}

function MiniSparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l1.1 4.8L18 8l-4.9 1.2L12 14l-1.1-4.8L6 8l4.9-1.2L12 2z" />
      <path d="M19 13l.6 2.4L22 16l-2.4.6L19 19l-.6-2.4L16 16l2.4-.6L19 13z" />
    </svg>
  );
}

function CuteHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 20.4s-7.4-4.6-9.2-8.8C1.2 8.2 3.4 5 6.8 5c2 0 3.3 1.1 4.2 2.4C12 6.1 13.2 5 15.2 5c3.4 0 5.6 3.2 4 6.6-1.8 4.2-7.2 8.8-7.2 8.8z" />
    </svg>
  );
}

function TinySkull({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.4c-4.2 0-7.6 2.9-7.6 6.8 0 2.4 1.3 4.5 3.3 5.7V17c0 .5.4.9.9.9h1v1.8h4.8V17.9h1c.5 0 .9-.4.9-.9v-2.1c2-1.2 3.3-3.3 3.3-5.7 0-3.9-3.4-6.8-7.6-6.8zM9.5 10a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm5 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zM12 15.4c-1.2 0-2.2-.4-2.6-1h5.2c-.4.6-1.4 1-2.6 1z" />
    </svg>
  );
}

function LaceDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 28" fill="none" className={className} aria-hidden>
      <path
        d="M8 14h92M180 14h92"
        stroke="#ff4d9a"
        strokeWidth="1.6"
        strokeDasharray="5 6"
        opacity="0.7"
      />
      <path
        d="M122 14c4-8 10-8 14 0 4-8 10-8 14 0 4-8 10-8 14 0-6 2-10 8-14 12-4-4-8-10-14-12-4 4-8 10-14 12-4-4-8-10-14-12z"
        fill="#ff4d9a"
      />
      <circle cx="140" cy="12" r="3.2" fill="#fce7f3" />
    </svg>
  );
}

function FallbackCharm({ index, className }: { index: number; className?: string }) {
  const icons = [TinySkull, CuteHeart, StarSparkle, MiniSparkle] as const;
  const Icon = icons[index % icons.length];
  return <Icon className={className} />;
}

export function RunachanLinkPage({ data }: { data: PublicLinktreeData }) {
  const title = data.title;
  const bio = data.bio;
  const avatarUrl = data.avatarUrl;
  const links = data.links;
  const socialLinks = data.socialLinks;

  return (
    <main
      className={`${bodyFont.className} relative flex min-h-screen w-full flex-col items-center overflow-hidden px-4 py-10 text-pink-50`}
    >
      <style>{`
        @keyframes rk-pulse {
          0%, 100% { opacity: 0.42; transform: scale(1); }
          50% { opacity: 0.82; transform: scale(1.1); }
        }
        @keyframes rk-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes rk-twinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.86) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.12) rotate(12deg); }
        }
        @keyframes rk-wiggle {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes rk-bob {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-7px) rotate(4deg); }
        }
        .rk-glow { animation: rk-pulse 4.6s ease-in-out infinite; }
        .rk-float { animation: rk-float 5s ease-in-out infinite; }
        .rk-float-slow { animation: rk-float 6.4s ease-in-out infinite; }
        .rk-twinkle { animation: rk-twinkle 2.8s ease-in-out infinite; }
        .rk-twinkle-d { animation: rk-twinkle 3.4s ease-in-out infinite 0.5s; }
        .rk-wiggle { animation: rk-wiggle 3.8s ease-in-out infinite; }
        .rk-bob { animation: rk-bob 4.2s ease-in-out infinite; }
        .rk-shine {
          background: linear-gradient(115deg, transparent 28%, rgba(255,255,255,0.22) 48%, transparent 66%);
          transform: translateX(-130%);
        }
        .group:hover .rk-shine {
          transform: translateX(130%);
          transition: transform 0.7s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .rk-glow, .rk-float, .rk-float-slow, .rk-twinkle, .rk-twinkle-d, .rk-wiggle, .rk-bob {
            animation: none;
          }
          .group:hover .rk-shine { transform: none; transition: none; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% -8%, rgba(255,77,154,0.38), transparent 52%), radial-gradient(ellipse at 8% 78%, rgba(255,77,154,0.12), transparent 42%), radial-gradient(ellipse at 94% 84%, rgba(192,132,252,0.1), transparent 40%), #07040c",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 45deg, #ff4d9a 0% 25%, transparent 0% 50%)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,182,217,0.7) 1px, transparent 1.35px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden
      />
      <div
        className="rk-glow pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-500/22 blur-3xl"
        aria-hidden
      />

      <StarSparkle className="rk-twinkle pointer-events-none absolute left-7 top-14 h-5 w-5 text-pink-300" />
      <MiniSparkle className="rk-twinkle-d pointer-events-none absolute right-8 top-24 h-6 w-6 text-fuchsia-200/90" />
      <CuteHeart className="rk-float-slow pointer-events-none absolute right-10 top-48 h-5 w-5 text-pink-400/70" />
      <TinySkull className="rk-float pointer-events-none absolute bottom-28 left-5 h-7 w-7 text-pink-500/45" />
      <StarSparkle className="rk-twinkle pointer-events-none absolute bottom-40 right-6 h-4 w-4 text-pink-200/70" />
      <CuteHeart className="rk-float pointer-events-none absolute left-8 top-1/2 h-4 w-4 text-fuchsia-300/50" />
      <TinySkull className="rk-float-slow pointer-events-none absolute right-7 top-[62%] h-6 w-6 text-purple-200/40" />
      <JesterSkull className="rk-bob pointer-events-none absolute -right-2 top-36 hidden h-16 w-16 sm:right-8 sm:block sm:h-20 sm:w-20" />
      <JesterSkull className="rk-wiggle pointer-events-none absolute -left-3 bottom-36 hidden h-14 w-14 opacity-80 sm:left-6 sm:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-90 flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {PROFILE_STAMPS.map((stamp, i) => (
            <span
              key={stamp}
              className={`rounded-md border border-dashed border-pink-300/70 bg-[#120814]/70 px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] text-pink-200/90 ${
                i % 2 === 0 ? "-rotate-2" : "rotate-2"
              }`}
            >
              {stamp}
            </span>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center text-center">
          <div className="rk-float relative">
            <KuromiBow className="absolute -top-14 left-1/2 h-12 w-32 -translate-x-1/2" />
            <JesterEar className="absolute -left-5 top-5 h-12 w-9 rotate-[-28deg]" />
            <JesterEar className="absolute -right-5 top-5 h-12 w-9 rotate-28 scale-x-[-1]" />

            <div className="relative mt-3 h-32 w-32 rotate-[-2.5deg] rounded-4xl border-4 border-pink-300 bg-pink-100/15 p-1 shadow-[0_0_34px_rgba(255,77,154,0.55)]">
              <div className="h-full w-full overflow-hidden rounded-[1.45rem] border-2 border-[#120814] bg-[#1a1024]">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt={title} className="h-full w-full object-cover" />
                ) : (
                  <div className={`${displayFont.className} flex h-full w-full items-center justify-center text-4xl text-pink-200`}>
                    {title.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#120814] bg-pink-400 text-[10px] font-extrabold text-[#120814] shadow-[0_0_12px_rgba(255,77,154,0.6)]">
                ★
              </span>
            </div>
            <TinySkull className="absolute -bottom-2 -right-4 h-7 w-7 text-pink-300" />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarSparkle className="rk-twinkle h-4 w-4 text-pink-300" />
            <h1
              className={`${displayFont.className} bg-clip-text text-3xl leading-tight text-transparent`}
              style={{
                backgroundImage: "linear-gradient(120deg, #fff1f7 0%, #ff4d9a 48%, #e9d5ff 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              {title}
            </h1>
            <MiniSparkle className="rk-twinkle-d h-4 w-4 text-fuchsia-200" />
          </div>
          <p className="mt-1 text-xs font-medium tracking-wide text-pink-200/70">
            cosplay ・ アニメ
          </p>

          {bio && (
            <div className="relative mt-5 max-w-sm rounded-[1.6rem] rounded-tl-md border-2 border-pink-300/55 bg-[#140a1c]/85 px-4 py-3 shadow-[0_0_18px_rgba(255,77,154,0.18)]">
              <span className="absolute -top-2 left-8 h-3.5 w-3.5 rotate-45 border-l-2 border-t-2 border-pink-300/55 bg-[#140a1c]" />
              <p className="break-keep text-sm leading-relaxed text-pretty text-pink-100/80">{bio}</p>
            </div>
          )}
        </div>

        <LaceDivider className="mt-7 h-6 w-full text-pink-400" />

        <div className="mt-5 flex w-full flex-col gap-3.5">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-[1.35rem] border-[3px] border-pink-300/80 bg-[#120814]/90 px-3.5 py-3.5 shadow-[0_0_18px_rgba(255,77,154,0.2)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:rotate-0 hover:border-pink-200 hover:shadow-[0_0_28px_rgba(255,77,154,0.48)] ${
                index % 2 === 0 ? "rotate-[-0.8deg]" : "rotate-[0.8deg]"
              }`}
            >
              <span className="rk-shine pointer-events-none absolute inset-0" />
              <span className="pointer-events-none absolute right-2 top-1.5 rotate-12 text-[9px] font-extrabold tracking-widest text-pink-300/70">
                {CARD_STAMPS[index % CARD_STAMPS.length]}
              </span>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-pink-400/40 bg-pink-500/10 text-pink-200">
                {link.thumbnailUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={link.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <FallbackCharm index={index} className="h-5 w-5" />
                )}
              </div>
              <span className="flex-1 truncate pr-4 text-sm font-bold tracking-wide text-pink-50">
                {link.title}
              </span>
              <CuteHeart className="h-4 w-4 shrink-0 text-pink-300/70 transition-transform group-hover:scale-125 group-hover:text-pink-200" />
            </a>
          ))}
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-300/80 bg-[#120814] text-pink-200 shadow-[0_0_14px_rgba(255,77,154,0.28)] transition-transform hover:-rotate-6 hover:scale-110 hover:border-pink-200 hover:text-white"
              >
                <KuromiBow className="pointer-events-none absolute -top-3 h-5 w-10 opacity-90" />
                <SocialIcon platform={social.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}
      </div>

      <footer className="relative z-10 mt-14 flex items-center gap-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-pink-300/55">
        <TinySkull className="h-3.5 w-3.5 text-pink-400/70" />
        <p>
          Powered by{" "}
          <a
            href="https://vitamin2001.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-pink-200/80 hover:text-pink-100"
          >
            Vitamin
          </a>
        </p>
        <CuteHeart className="h-3.5 w-3.5 text-pink-400/70" />
      </footer>
    </main>
  );
}
