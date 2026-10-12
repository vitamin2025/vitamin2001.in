"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X, ArrowLeft } from "lucide-react";
import { useClientSession } from "@/lib/client-admin";
import { useCart, useResetShopSession } from "@/lib/shop/hooks";
import { useShopStore } from "@/lib/shop/store-context";
import { cn } from "@/lib/utils";
import { mainSiteUrl, POLICY_LINKS } from "./site-links";

export interface ShopNavCollection {
  readonly slug: string;
  readonly name: string;
}

function StoreMark({ size = "md" }: { size?: "md" | "lg" }) {
  const { profile } = useShopStore();
  const box = size === "lg" ? "h-12 w-12 text-lg" : "h-9 w-9 text-sm";
  if (profile.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.logo}
        alt=""
        className={cn(box, "rounded-lg object-contain bg-white ring-1 ring-slate-200")}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        box,
        "inline-flex items-center justify-center rounded-lg bg-(--shop-accent) font-bold text-white",
      )}
    >
      {profile.name.charAt(0).toUpperCase()}
    </span>
  );
}

function SearchForm({ onDone, className }: { onDone?: () => void; className?: string }) {
  const { basePath } = useShopStore();
  const router = useRouter();
  const [term, setTerm] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = term.trim();
    router.push(q ? `${basePath}/products?q=${encodeURIComponent(q)}` : `${basePath}/products`);
    onDone?.();
  };

  return (
    <form role="search" onSubmit={submit} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        maxLength={100}
        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-(--shop-accent) focus:bg-white focus:ring-2 focus:ring-(--shop-accent-ring)"
      />
    </form>
  );
}

/**
 * After sign-in or sign-out the API swaps this browser's shop session (and merges a guest cart),
 * so drop the cart and account data cached under the old one.
 */
function ShopSessionSync() {
  const session = useClientSession();
  const resetShop = useResetShopSession();
  const identity =
    session.status === "granted" ? session.actor.id : session.status === "anonymous" ? "" : null;
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (identity === null) return;
    if (previous.current !== null && previous.current !== identity) void resetShop();
    previous.current = identity;
  }, [identity, resetShop]);
  return null;
}

function CartButton() {
  const { basePath } = useShopStore();
  const { data: cart } = useCart();
  const count = cart?.itemCount ?? 0;
  return (
    <Link
      href={`${basePath}/cart`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
      aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-(--shop-accent) px-1 text-[11px] font-semibold leading-5 text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export interface ShopShellProps {
  readonly collections: readonly ShopNavCollection[];
  readonly children: ReactNode;
}

/** The shared storefront's header, menu and footer. */
export function ShopShell({ collections, children }: ShopShellProps) {
  const { profile, basePath, siteRoot } = useShopStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { href: `${basePath}/products`, label: "Shop all" },
    ...collections.slice(0, 5).map((collection) => ({
      href: `${basePath}/collections/${collection.slug}`,
      label: collection.name,
    })),
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <ShopSessionSync />
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href={basePath} className="flex min-w-0 items-center gap-2.5">
            <StoreMark />
            <span className="truncate text-base font-semibold tracking-tight">{profile.name}</span>
          </Link>
          <nav aria-label="Shop" className="ml-6 hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  isActive(link.href)
                    ? "bg-(--shop-accent-soft) text-(--shop-accent-strong)"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <SearchForm className="mr-2 hidden w-64 md:block" />
            <Link
              href={`${basePath}/account`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
              aria-label="Your account"
            >
              <User className="h-5 w-5" />
            </Link>
            <CartButton />
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col gap-5 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <StoreMark /> {profile.name}
              </span>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SearchForm onDone={() => setMenuOpen(false)} />
            <nav aria-label="Shop" className="flex flex-col">
              {[{ href: basePath, label: "Home" }, ...navLinks, { href: `${basePath}/account`, label: "Account" }].map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
            {!profile.isHouseShop && (
              <Link
                href={siteRoot}
                className="mt-auto inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" /> Back to {profile.name}
              </Link>
            )}
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-semibold">
              <StoreMark /> {profile.name}
            </div>
            {profile.description && (
              <p className="max-w-sm text-sm leading-relaxed text-slate-500">{profile.description}</p>
            )}
          </div>
          <nav aria-label="Shop links" className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-900">Shop</span>
            <Link href={`${basePath}/products`} className="text-slate-500 hover:text-slate-900">
              All products
            </Link>
            <Link href={`${basePath}/cart`} className="text-slate-500 hover:text-slate-900">
              Cart
            </Link>
            <Link href={`${basePath}/account`} className="text-slate-500 hover:text-slate-900">
              Orders & account
            </Link>
            {!profile.isHouseShop && (
              <Link href={siteRoot} className="text-slate-500 hover:text-slate-900">
                {profile.name} home
              </Link>
            )}
          </nav>
          <nav aria-label="Policies" className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-900">Help</span>
            {POLICY_LINKS.map((link) => (
              <a key={link.path} href={mainSiteUrl(link.path)} className="text-slate-500 hover:text-slate-900">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
          Payments are processed securely by PayU. Powered by vitamin2001.in
        </div>
      </footer>
    </div>
  );
}
