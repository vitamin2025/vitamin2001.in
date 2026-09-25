import React from "react";
import Image from "next/image";
import {
  Gift,
  Mail,
  Link2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { SocialIcon } from "@/components/client-admin/linktree/social-icons";
import type {
  PublicLinktreeData,
  PublicLinktreeLink,
  PublicLinktreeSocial,
} from "@/lib/client-admin/linktree/public";

/* Ribbon Bow Component */
function PinkRibbonBow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Left loop */}
      <path
        d="M48 20C36 6 12 6 8 20c-4 12 14 18 36 6z"
        fill="#ff75b5"
        stroke="#ffd1e6"
        strokeWidth="1.6"
      />
      <path
        d="M44 20C34 11 18 11 15 20c-3 8 10 11 26 3z"
        fill="#ff4d9a"
        opacity="0.8"
      />
      {/* Right loop */}
      <path
        d="M52 20C64 6 88 6 92 20c4 12-14 18-36 6z"
        fill="#ff75b5"
        stroke="#ffd1e6"
        strokeWidth="1.6"
      />
      <path
        d="M56 20C66 11 82 11 85 20c3 8-10 11-26 3z"
        fill="#ff4d9a"
        opacity="0.8"
      />
      {/* Ribbon tails */}
      <path
        d="M43 25L28 44l14-3 5-16z"
        fill="#ff4d9a"
        stroke="#ffd1e6"
        strokeWidth="1.2"
      />
      <path
        d="M57 25L72 44l-14-3-5-16z"
        fill="#ff4d9a"
        stroke="#ffd1e6"
        strokeWidth="1.2"
      />
      {/* Center knot */}
      <ellipse
        cx="50"
        cy="20"
        rx="6"
        ry="5"
        fill="#ff8ac4"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle cx="49" cy="18" r="1.5" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

/* Hand-drawn Star Doodle */
function SketchStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      className={className}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M24 3L29.5 17L44 18L33 28L36 43L24 35L12 43L15 28L4 18L18.5 17L24 3z" />
    </svg>
  );
}

/* Cute Doodle Cat Face */
function DoodleCat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      stroke="currentColor"
      className={className}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Ears & Head */}
      <path d="M8 12L4 4l9 3c3-2 10-2 14 0l9-3-4 8c3 4 3 9 1 12-3 4-8 5-13 5s-10-1-13-5c-2-3-2-8 1-12z" />
      {/* Eyes */}
      <circle cx="15" cy="17" r="1.5" fill="currentColor" />
      <circle cx="25" cy="17" r="1.5" fill="currentColor" />
      {/* Nose & Mouth */}
      <path d="M19 20h2l-1 1z" fill="currentColor" />
      <path d="M17 22c1.5 1.5 2.5 1.5 3 0 0.5 1.5 1.5 1.5 3 0" />
      {/* Whiskers */}
      <path d="M11 18L5 17M11 20L4 21M29 18l6-1M29 20l7 1" />
    </svg>
  );
}

/* 4-pointed Sparkle Star */
function TwinkleStar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M12 0C12 7.5 12 12 12 12C12 12 7.5 12 0 12C7.5 12 12 12 12 12C12 12 12 16.5 12 24C12 16.5 12 12 12 12C12 12 16.5 12 24 12C16.5 12 12 12 12 12Z" />
    </svg>
  );
}

/* Pushpin / Tape graphic for sticky note */
function Pushpin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <ellipse cx="10" cy="8" rx="4.5" ry="3.5" fill="#f43f5e" />
      <circle cx="9" cy="7" r="1" fill="#fecdd3" />
      <path d="M10 11.5V17" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* Helper to resolve icons and subtitles */
function resolveLinkDetails(link: PublicLinktreeLink) {
  const rawTitle = link.title || "";
  let title = rawTitle;
  let subtitle = "";

  // Check for custom delimiter: "Title | Subtitle" or "Title — Subtitle" or "Title :: Subtitle"
  if (rawTitle.includes("|")) {
    const parts = rawTitle.split("|");
    title = parts[0].trim();
    subtitle = parts.slice(1).join("|").trim();
  } else if (rawTitle.includes("—")) {
    const parts = rawTitle.split("—");
    title = parts[0].trim();
    subtitle = parts.slice(1).join("—").trim();
  } else if (rawTitle.includes("::")) {
    const parts = rawTitle.split("::");
    title = parts[0].trim();
    subtitle = parts.slice(1).join("::").trim();
  }

  const lowerTitle = title.toLowerCase();
  const lowerUrl = (link.href || "").toLowerCase();

  // Determine icon & default subtitle if none provided
  let icon = <Link2 className="h-5 w-5 text-pink-300" />;

  if (lowerTitle.includes("instagram") || lowerUrl.includes("instagram.com")) {
    icon = <SocialIcon platform="instagram" className="h-5 w-5 text-pink-300" />;
    if (!subtitle) subtitle = "where the cosplay happens";
  } else if (
    lowerTitle.includes("throne") ||
    lowerUrl.includes("throne.com") ||
    lowerTitle.includes("gift") ||
    lowerTitle.includes("support")
  ) {
    icon = <Gift className="h-5 w-5 text-pink-300" />;
    if (!subtitle) subtitle = "send Runa something cute";
  } else if (
    lowerTitle.includes("email") ||
    lowerTitle.includes("collab") ||
    lowerTitle.includes("contact") ||
    lowerUrl.startsWith("mailto:")
  ) {
    icon = <Mail className="h-5 w-5 text-pink-300" />;
    if (!subtitle) subtitle = "let's create something together";
  } else if (
    lowerTitle.includes("elsewhere") ||
    lowerTitle.includes("links") ||
    lowerTitle.includes("social")
  ) {
    icon = <Link2 className="h-5 w-5 text-pink-300" />;
    if (!subtitle) subtitle = "all my socials";
  } else {
    icon = <Sparkles className="h-5 w-5 text-pink-300" />;
    if (!subtitle) subtitle = "tap to explore";
  }

  return { title, subtitle, icon };
}

/* Default links matching the reference mockup */
const FALLBACK_LINKS: PublicLinktreeLink[] = [
  {
    id: "fb-ig",
    title: "Instagram",
    href: "https://instagram.com/runachan.exe",
    position: 0,
  },
  {
    id: "fb-throne",
    title: "Throne",
    href: "https://throne.com/runachan",
    position: 1,
  },
  {
    id: "fb-email",
    title: "Email / Collaborate",
    href: "mailto:collab@runachan.exe",
    position: 2,
  },
  {
    id: "fb-socials",
    title: "Find Me Elsewhere",
    href: "#links",
    position: 3,
  },
];

/* Default social links matching Runachan */
const FALLBACK_SOCIALS: PublicLinktreeSocial[] = [
  {
    id: "fb-soc-ig",
    platform: "instagram",
    url: "https://instagram.com/runachan.exe",
    position: 0,
  },
];

export function RunachanLinkPage({ data }: { data: PublicLinktreeData | null }) {
  const avatarUrl = data?.avatarUrl || "/clients/runachan/default-avatar.jpg";
  const links = data?.links && data.links.length > 0 ? data.links : FALLBACK_LINKS;
  const socialLinks =
    data?.socialLinks && data.socialLinks.length > 0
      ? data.socialLinks
      : !data
        ? FALLBACK_SOCIALS
        : [];

  // Custom bio or the signature Runa tagline
  const isCorporateBio =
    !data?.bio ||
    data.bio.toLowerCase().includes("welcome to the official links page");

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-x-hidden bg-[#07030a] text-pink-100 selection:bg-pink-500 selection:text-white">
      {/* Subtle Noise / Ambient Glow Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(244,114,182,0.18) 0%, transparent 60%), radial-gradient(ellipse at 85% 25%, rgba(236,72,153,0.12) 0%, transparent 45%), radial-gradient(ellipse at 15% 65%, rgba(217,70,239,0.08) 0%, transparent 50%)",
        }}
        aria-hidden
      />

      {/* Manga Sketch Overlay in Top-Right Corner */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-0 h-96 w-72 sm:h-[460px] sm:w-96 select-none overflow-hidden opacity-[0.22] mix-blend-screen"
        aria-hidden
      >
        <Image
          src="/clients/runachan/manga-bg.jpg"
          alt=""
          fill
          className="object-cover object-top [mask-image:radial-gradient(ellipse_at_top_right,black_30%,transparent_75%)]"
          priority
        />
      </div>

      {/* Floating Sparkle Stars */}
      <TwinkleStar className="pointer-events-none absolute left-6 top-28 h-4 w-4 text-pink-300/80 animate-pulse" />
      <TwinkleStar className="pointer-events-none absolute right-8 top-56 h-3.5 w-3.5 text-pink-400/70 animate-pulse [animation-delay:1.2s]" />
      <TwinkleStar className="pointer-events-none absolute left-10 top-[420px] h-3 w-3 text-pink-300/60 animate-pulse [animation-delay:0.7s]" />
      <TwinkleStar className="pointer-events-none absolute right-12 top-[520px] h-3.5 w-3.5 text-pink-400/80 animate-pulse [animation-delay:1.8s]" />

      {/* Main Column Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-col items-center px-4 pt-6 pb-2">
        {/* ======================================================== */}
        {/* TOP BAR: 3 Columns                                       */}
        {/* ======================================================== */}
        <header
          className="font-runa-mono flex w-full items-start justify-between text-[10px] tracking-[0.18em] text-pink-200/70"
        >
          {/* Top Left */}
          <div className="flex flex-col space-y-0.5 leading-tight text-left">
            <span>2D GIRLS</span>
            <span>3D PROBLEMS</span>
            <span className="text-pink-300 font-semibold">SAME ME.</span>
          </div>

          {/* Top Center: Japanese Kanji & Handle */}
          <div className="flex flex-col items-center text-center">
            <div className="font-runa-jp flex items-center gap-1 text-sm font-semibold tracking-widest text-pink-100">
              <span>月奈</span>
              <span className="text-xs text-pink-300">☾</span>
            </div>
            <span className="text-[10px] lowercase tracking-[0.2em] text-pink-300/80">
              runachan.exe
            </span>
          </div>

          {/* Top Right */}
          <div className="flex flex-col items-end space-y-0.5 leading-tight text-right">
            <span>KOLKATA</span>
            <span className="text-pink-400/60 text-[8px]">×</span>
            <span>COSPLAY</span>
            <span className="text-pink-400/60 text-[8px]">×</span>
            <span>ANIME</span>
            <span className="text-pink-400/60 text-[8px]">×</span>
            <span className="text-pink-300 font-semibold">CHAOS</span>
          </div>
        </header>

        {/* ======================================================== */}
        {/* HERO SECTION: Framed Photo + Bow + Sticky Note          */}
        {/* ======================================================== */}
        <section className="relative mt-8 flex flex-col items-center">
          {/* Left Vertical Japanese text */}
          <div
            className="font-runa-jp pointer-events-none absolute -left-12 top-6 hidden text-[11px] font-medium tracking-[0.28em] text-pink-300/75 sm:block"
            style={{ writingMode: "vertical-rl" }}
            aria-hidden
          >
            かわいいけど、強いよ。
          </div>

          {/* Left Star Doodle with Fiction/Freedom/Finance */}
          <div className="pointer-events-none absolute -left-20 top-28 hidden flex-col items-center text-center sm:flex" aria-hidden>
            <SketchStar className="h-10 w-10 text-pink-300/80 rotate-[-12deg]" />
            <div className="font-runa-title mt-1 text-[10px] leading-tight tracking-wider text-pink-200/80">
              <div>Fiction</div>
              <div>Freedom</div>
              <div>Finance</div>
            </div>
            <div className="mt-1 h-[1px] w-6 bg-pink-400/40" />
          </div>

          {/* Photo Frame Container */}
          <div className="relative group">
            {/* Outer pink border with delicate double-line and glow */}
            <div className="relative h-48 w-48 sm:h-52 sm:w-52 rounded-md border-2 border-pink-400/70 p-1.5 shadow-[0_0_30px_rgba(255,77,154,0.32)] transition-transform duration-300 group-hover:scale-[1.02]">
              {/* Corner accents */}
              <span className="absolute -top-1 -left-1 text-[10px] text-pink-300 font-bold">✦</span>
              <span className="absolute -top-1 -right-1 text-[10px] text-pink-300 font-bold">✦</span>
              <span className="absolute -bottom-1 -left-1 text-[10px] text-pink-300 font-bold">✦</span>
              <span className="absolute -bottom-1 -right-1 text-[10px] text-pink-300 font-bold">✦</span>

              {/* Photo inside */}
              <div className="relative h-full w-full overflow-hidden rounded-sm bg-[#120814]">
                <Image
                  src={avatarUrl}
                  alt={data?.title || "Runachan"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Bottom Center Pink Bow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
                <PinkRibbonBow className="h-8 w-18 drop-shadow-[0_2px_8px_rgba(255,77,154,0.6)]" />
              </div>
            </div>

            {/* Pinned Sticky Note on Bottom Right */}
            <div
              className="absolute -right-7 -bottom-6 z-20 flex flex-col items-center justify-center rounded-sm bg-[#fce7f3] px-2.5 py-2 text-[#2a0e20] shadow-[0_4px_14px_rgba(0,0,0,0.55)] rotate-[4deg] transition-transform duration-300 hover:rotate-0"
              style={{
                border: "1px solid rgba(244,114,182,0.4)",
              }}
            >
              {/* Pushpin at top of note */}
              <Pushpin className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-4 drop-shadow" />

              <div
                className="font-runa-hand flex flex-col items-center text-center text-[13px] font-bold leading-[1.15] text-[#3b122e] pt-1"
              >
                <span>fictional</span>
                <span>women</span>
                <span>real</span>
                <span>eyeliner</span>
                <span className="text-[12px] text-pink-600 mt-0.5">♡</span>
              </div>
            </div>
          </div>

          {/* Main Title & Identity */}
          <div className="mt-8 flex flex-col items-center text-center">
            <h1
              className="font-runa-title flex items-center gap-2 text-4xl sm:text-5xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-pink-200 to-rose-200 drop-shadow-[0_2px_12px_rgba(255,105,180,0.35)]"
            >
              <span>{data?.title || "Runachan"}</span>
              <span className="text-2xl sm:text-3xl text-pink-400 font-light drop-shadow">♡</span>
            </h1>

            {/* Subtitle Badge */}
            <div
              className="font-runa-mono mt-2 text-[11px] font-medium tracking-[0.22em] text-pink-200/80 uppercase"
            >
              COSPLAY ・ アニメ ・ KOLKATA
            </div>

            {/* Signature Tagline or Bio */}
            <div className="mt-3.5 flex flex-col items-center text-center text-xs leading-relaxed text-pink-200/90 font-medium">
              {!isCorporateBio ? (
                <p className="max-w-xs">{data?.bio}</p>
              ) : (
                <>
                  <p>A little Bengali. A little anime.</p>
                  <p className="mt-0.5 flex items-center gap-1 font-semibold text-pink-100">
                    <span>A lot of Runa.</span>
                    <span className="text-pink-400">♡</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* LINK BUTTONS & SIDE ANNOTATIONS                          */}
        {/* ======================================================== */}
        <section className="relative mt-8 w-full">
          {/* Left Floating Note: Thanks for being here ♡ + Cat */}
          <div
            className="pointer-events-none absolute -left-20 top-20 hidden flex-col items-center text-center sm:flex"
            aria-hidden
          >
            <div
              className="font-runa-hand text-[14px] leading-tight text-pink-300/80 rotate-[-6deg]"
            >
              <div>Thanks</div>
              <div>for being</div>
              <div>here ♡</div>
            </div>
            <DoodleCat className="mt-2 h-7 w-7 text-pink-300/70 rotate-[-4deg]" />
          </div>

          {/* Right Floating Note: ずっと、好き。 + Good people watch anime */}
          <div
            className="pointer-events-none absolute -right-22 top-6 hidden flex-col items-center text-center sm:flex"
            aria-hidden
          >
            <div
              className="font-runa-jp text-[10px] leading-tight tracking-widest text-pink-300/70"
            >
              <div>ずっと、</div>
              <div>好き。</div>
            </div>
            <div className="my-1.5 h-[1px] w-5 bg-pink-400/40" />
            <div
              className="font-runa-hand mt-1 text-[13px] leading-snug text-pink-300/80 rotate-[4deg]"
            >
              <div>Good</div>
              <div>people</div>
              <div>watch</div>
              <div>anime</div>
              <div className="text-pink-400 text-center">♡</div>
            </div>
          </div>

          {/* Interactive Link Cards */}
          <div className="flex w-full flex-col gap-3">
            {links.map((link) => {
              const { title, subtitle, icon } = resolveLinkDetails(link);

              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-pink-400/30 bg-[#140818]/85 px-4 py-3.5 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-[#1a0a20] hover:shadow-[0_0_24px_rgba(255,77,154,0.35)]"
                >
                  {/* Subtle shine sweep on hover */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                  {/* Left: Icon & Text */}
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    {/* Icon container */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pink-400/30 bg-pink-500/10 text-pink-300 transition-colors group-hover:border-pink-300 group-hover:bg-pink-500/20">
                      {link.thumbnailUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={link.thumbnailUrl}
                          alt=""
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        icon
                      )}
                    </div>

                    {/* Title + Subtitle */}
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="truncate text-sm font-semibold tracking-wide text-pink-50 group-hover:text-white">
                        {title}
                      </span>
                      {subtitle && (
                        <span className="truncate text-[11px] font-normal text-pink-300/70 group-hover:text-pink-200/90">
                          {subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Chevron Arrow */}
                  <ChevronRight className="h-4 w-4 shrink-0 text-pink-400/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-pink-300" />
                </a>
              );
            })}
          </div>

          {/* Social Profile Links */}
          {socialLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-400/40 bg-[#140818]/90 text-pink-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:bg-pink-500/20 hover:text-white hover:shadow-[0_0_22px_rgba(255,77,154,0.5)]"
                >
                  <SocialIcon
                    platform={social.platform}
                    className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* QUOTE BANNER                                             */}
        {/* ======================================================== */}
        <section className="mt-10 flex flex-col items-center text-center">
          <p
            className="font-runa-mono text-[10px] sm:text-[11px] font-medium tracking-[0.24em] text-pink-200/75 uppercase"
          >
            “ FICTIONAL WOMEN
          </p>
          <p
            className="font-runa-mono text-[10px] sm:text-[11px] font-medium tracking-[0.24em] text-pink-200/75 uppercase mt-0.5"
          >
            MAKE REAL DAYS BRIGHTER. ”
          </p>
          <div className="mt-2 h-[1px] w-8 bg-pink-400/40" />
        </section>
      </div>

      {/* ======================================================== */}
      {/* FOOTER & KOLKATA SKYLINE ARTWORK                         */}
      {/* ======================================================== */}
      <footer className="relative mt-8 w-full overflow-hidden">
        {/* Kolkata Skyline Backdrop */}
        <div className="relative h-48 sm:h-56 w-full">
          <Image
            src="/clients/runachan/kolkata-skyline.jpg"
            alt="Kolkata night skyline with Howrah bridge and river reflection"
            fill
            className="object-cover object-bottom"
            priority
          />
          {/* Gradient fade from top into dark background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07030a] via-[#07030a]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07030a] to-transparent" />

          {/* Skyline Overlay Badges */}
          <div
            className="font-runa-mono absolute inset-x-0 bottom-3 mx-auto flex max-w-[440px] items-end justify-between px-4 text-[9px] font-medium tracking-[0.2em] text-pink-200/75"
          >
            {/* Bottom Left: Kolkata to the World */}
            <div className="flex flex-col text-left leading-tight">
              <span>KOLKATA</span>
              <span>TO</span>
              <span className="text-pink-300 font-semibold">THE WORLD</span>
            </div>

            {/* Bottom Center: Chibi Mascot with hearts */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-pink-400">♡</span>
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-pink-400/70 shadow-[0_0_12px_rgba(255,77,154,0.5)]">
                  <Image
                    src="/clients/runachan/chibi-mascot.jpg"
                    alt="runachan chibi"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs text-pink-400">♡</span>
              </div>
              <span className="mt-1 text-[9px] lowercase tracking-[0.22em] text-pink-300/80">
                runachan.exe
              </span>
            </div>

            {/* Bottom Right: Same Girl Different Cosplay */}
            <div className="flex flex-col items-end text-right leading-tight">
              <span className="text-xs text-pink-300">☾</span>
              <span>SAME GIRL</span>
              <span>DIFFERENT</span>
              <span className="text-pink-300 font-semibold">COSPLAY</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
