"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  LogOut,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useClient } from "@/providers/client-provider";
import { useClientAdminAuthCommands, useClientSession } from "@/lib/client-admin";
import type { Actor } from "@/lib/admin/identity";
import { clientUserRoutes } from "@/lib/client-admin/routes";
import { useUpdateProfile } from "@/lib/client-admin/profile";
import { useClientShop } from "@/lib/shop/client-shop";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Only same-site paths are followed back, so `?back=` can't send people elsewhere. */
function safeBackPath(raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

function Notice({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      className={
        tone === "error"
          ? "flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
          : "flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function Avatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";
  if (imageUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- user-supplied URL on any host
      <img
        src={imageUrl}
        alt=""
        onError={() => setFailed(true)}
        className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-sm"
      />
    );
  }
  return (
    <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold ring-2 ring-white shadow-sm">
      {initials}
    </div>
  );
}

function ProfileForm({ actor }: { actor: Actor }) {
  const update = useUpdateProfile();
  const [name, setName] = useState(actor.name);
  const [image, setImage] = useState(actor.imageUrl ?? "");
  const [clientError, setClientError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = name.trim() !== actor.name || image.trim() !== (actor.imageUrl ?? "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setClientError(null);
    setSaved(false);
    const trimmedName = name.trim();
    const trimmedImage = image.trim();
    if (!trimmedName) {
      setClientError("Please enter your name.");
      return;
    }
    if (trimmedImage && !/^https?:\/\//i.test(trimmedImage)) {
      setClientError("The photo must be a web address starting with http:// or https://.");
      return;
    }
    try {
      await update.run({ name: trimmedName, image: trimmedImage });
      setSaved(true);
    } catch {
      // Shown from the command state
    }
  };

  const serverError =
    update.state.status === "failed" ? update.state.error.message || "Could not save your profile." : null;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="profile-name" className="text-xs text-slate-600">
          Full name
        </Label>
        <Input
          id="profile-name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-email" className="text-xs text-slate-600">
          Email
        </Label>
        <Input id="profile-email" value={actor.email} disabled readOnly />
        <p className="text-[11px] text-slate-400">Your email is your sign-in and can&apos;t be changed here.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-image" className="text-xs text-slate-600">
          Photo URL
        </Label>
        <Input
          id="profile-image"
          name="image"
          type="url"
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
            setSaved(false);
          }}
          placeholder="https://…"
        />
        <p className="text-[11px] text-slate-400">Leave empty to show your initials.</p>
      </div>

      {clientError && <Notice tone="error">{clientError}</Notice>}
      {serverError && <Notice tone="error">{serverError}</Notice>}
      {saved && !dirty && <Notice tone="success">Your profile has been saved.</Notice>}

      <Button
        type="submit"
        disabled={!dirty || update.state.status === "running"}
        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
      >
        {update.state.status === "running" ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const { changePassword } = useClientAdminAuthCommands();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setClientError(null);
    setSaved(false);
    if (newPassword.length < 8) {
      setClientError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setClientError("The new passwords don't match.");
      return;
    }
    try {
      await changePassword.run({ currentPassword, newPassword });
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Shown from the command state
    }
  };

  const serverError =
    changePassword.state.status === "failed"
      ? changePassword.state.error.message || "Could not change your password. Please check your current password."
      : null;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="current-password" className="text-xs text-slate-600">
          Current password
        </Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="new-password" className="text-xs text-slate-600">
            New password
          </Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-password" className="text-xs text-slate-600">
            Confirm new password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
      </div>

      {clientError && <Notice tone="error">{clientError}</Notice>}
      {serverError && <Notice tone="error">{serverError}</Notice>}
      {saved && <Notice tone="success">Your password has been changed.</Notice>}

      <Button type="submit" variant="outline" disabled={changePassword.state.status === "running"} className="text-xs font-semibold">
        {changePassword.state.status === "running" ? "Changing..." : "Change password"}
      </Button>
    </form>
  );
}

function SpaceLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof ShoppingBag;
  title: string;
  description: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-900">{title}</span>
          <span className="block text-xs text-slate-500">{description}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
      </Link>
    </li>
  );
}

/**
 * The signed-in user's own profile, shared by every feature: the shop, creator memberships and
 * (later) the feed link here to view and edit name, photo and password.
 */
export default function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ client_name: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { client_name: slug } = use(params);
  const back = safeBackPath(use(searchParams).back);
  const router = useRouter();
  const { client, hasCreatorFeature } = useClient();
  const session = useClientSession();
  const { signOut } = useClientAdminAuthCommands();
  const { data: shop } = useClientShop(slug);

  const homeHref = `/client/${encodeURIComponent(slug)}`;
  const backHref = back ?? homeHref;

  if (session.status === "checking") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text="Loading your profile..." />
      </div>
    );
  }

  if (session.status !== "granted") {
    const returnTo = `${clientUserRoutes.profile(slug)}${back ? `?back=${encodeURIComponent(back)}` : ""}`;
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm text-center shadow-2xs border-slate-200">
          <CardHeader>
            <UserRound className="mx-auto h-8 w-8 text-indigo-600" />
            <CardTitle className="text-base font-bold">Sign in to see your profile</CardTitle>
            <CardDescription className="text-xs">
              {session.status === "unavailable"
                ? session.error.message
                : "Your profile is shared across the shop, memberships and feed."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`${clientUserRoutes.fanLogin(slug)}?redirect=${encodeURIComponent(returnTo)}`}>
              <Button className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white">Sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { actor } = session;

  const handleSignOut = async () => {
    await signOut.run();
    router.replace(homeHref);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{back ? "Back" : `Back to ${client?.name || slug}`}</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signOut.state.status === "running"}
            className="text-xs text-slate-600 gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        <div className="flex items-center gap-4">
          <Avatar key={actor.imageUrl ?? ""} name={actor.name || actor.email} imageUrl={actor.imageUrl} />
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-slate-900 truncate">{actor.name || "Your profile"}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="truncate">{actor.email}</span>
              {actor.emailVerified && (
                <span className="inline-flex items-center gap-0.5 text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </p>
          </div>
        </div>

        <Card className="shadow-2xs border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <UserRound className="h-4 w-4 text-indigo-600" />
              <span>Personal details</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Shown on your orders, memberships and posts across {client?.name || slug}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm key={`${actor.name}|${actor.imageUrl ?? ""}`} actor={actor} />
          </CardContent>
        </Card>

        <Card className="shadow-2xs border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-indigo-600" />
              <span>Password</span>
            </CardTitle>
            <CardDescription className="text-xs">Change the password you sign in with.</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>

        {(shop || hasCreatorFeature) && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Your accounts</h2>
            <ul className="space-y-2">
              {shop && (
                <SpaceLink
                  href={`/client/${encodeURIComponent(slug)}/shop/account`}
                  icon={ShoppingBag}
                  title="Shop"
                  description="Orders, deliveries and saved addresses"
                />
              )}
              {hasCreatorFeature && (
                <SpaceLink
                  href={clientUserRoutes.creatorAccount(slug)}
                  icon={Sparkles}
                  title="Creator membership"
                  description="Your tier, renewal date and cancellation"
                />
              )}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
