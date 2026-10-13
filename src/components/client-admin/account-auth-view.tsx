"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LogIn, Newspaper, ShoppingBag, Sparkles, UserPlus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field } from "@/components/admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmailVerificationBanner } from "@/components/common/email-verification-banner";
import { clientUserRoutes, safeRedirectPath, useClientAdminAuthCommands, useClientSession } from "@/lib/client-admin";
import { useClientShop } from "@/lib/shop/client-shop";
import { useClient } from "@/providers/client-provider";
import { fetchActor } from "@/lib/admin/identity";

export type AccountAuthTab = "signin" | "signup";

export interface AccountAuthViewProps {
  slug: string;
  displayName: string;
  initialTab?: AccountAuthTab;
  /** Where to go once signed in; defaults to the central profile. Only same-site paths are followed. */
  redirectTarget?: string;
  /** Runs once after a new account is created and signed in (e.g. following the creator). */
  onSignedUp?: () => Promise<unknown>;
}

/**
 * Sign in or create the one account a person uses across a client's site: the shop, creator
 * memberships and the feed. Shared by `/user/login` and `/user/signup`.
 */
export function AccountAuthView({ slug, displayName, initialTab = "signin", redirectTarget, onSignedUp }: AccountAuthViewProps) {
  const router = useRouter();
  const access = useClientSession();
  const { signIn, signUp, signOut } = useClientAdminAuthCommands();
  const { hasCreatorFeature } = useClient();
  const { data: shop } = useClientShop(slug);

  const target = safeRedirectPath(redirectTarget);
  const [tab, setTab] = useState<AccountAuthTab>(initialTab);
  const [finishing, setFinishing] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  // Signed in (here or in another tab) with somewhere to go: go there.
  useEffect(() => {
    if (access.status === "granted" && target && !finishing) {
      router.replace(target);
    }
  }, [access.status, target, finishing, router]);

  const uses = [
    shop && { icon: ShoppingBag, label: "Shop orders" },
    hasCreatorFeature && { icon: Sparkles, label: "Memberships" },
    hasCreatorFeature && { icon: Newspaper, label: "Community feed" },
  ].filter(Boolean) as { icon: typeof ShoppingBag; label: string }[];

  if (access.status === "checking" || finishing || (access.status === "granted" && target)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text={finishing ? "Setting up your account..." : `Checking your ${displayName} account...`} />
      </div>
    );
  }

  if (access.status === "unavailable") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center p-6">
        <div className="space-y-3">
          <h1 className="text-xl font-semibold text-slate-900">Service unavailable</h1>
          <p className="text-sm text-slate-600">{access.error.message}</p>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (access.status === "granted") {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center gap-4 p-6">
        <EmailVerificationBanner actor={access.actor} />
        <Card className="w-full shadow-lg border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
              You&apos;re signed in
            </CardTitle>
            <CardDescription>
              {access.actor.name ? `${access.actor.name} · ` : ""}
              <span className="font-medium text-slate-900">{access.actor.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link href={clientUserRoutes.profile(slug)} className="flex-1">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 font-medium shadow-sm">
                  <UserRound className="w-4 h-4" />
                  <span>Your profile</span>
                </Button>
              </Link>
              <Link href={`/client/${encodeURIComponent(slug)}`} className="flex-1">
                <Button variant="outline" className="w-full gap-1.5 border-slate-300 text-slate-700">
                  <span>Go to {displayName}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => void signOut.run()}
              disabled={signOut.state.status === "running"}
              className="mt-4 w-full text-center text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-50"
            >
              {signOut.state.status === "running" ? "Signing out..." : "Not you? Sign out"}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const afterAuth = target ?? clientUserRoutes.profile(slug);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setFinishing(true);
      await signIn.run({ email: signInEmail, password: signInPassword });
      router.replace(afterAuth);
    } catch {
      setFinishing(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    try {
      setFinishing(true);
      await signUp.run({ name, email, password });
    } catch {
      setFinishing(false);
      return;
    }
    // Sign-up signs the person in unless the backend first wants the email confirmed.
    const actor = await fetchActor().catch(() => null);
    if (!actor) {
      setFinishing(false);
      setCheckEmail(true);
      return;
    }
    try {
      await onSignedUp?.();
    } catch {
      // Not fatal: the account exists, and the next page can retry (e.g. already following).
    }
    router.replace(afterAuth);
  };

  const signInError =
    signIn.fieldErrors?._form?.[0] ?? (signIn.state.status === "failed" ? signIn.state.error.message : null);
  const signUpError =
    signUp.fieldErrors?._form?.[0] ?? (signUp.state.status === "failed" ? signUp.state.error.message : null);

  const switchTab = (next: AccountAuthTab) => {
    setTab(next);
    setCheckEmail(false);
    setValidationError(null);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center p-6">
      <Card className="w-full shadow-xl border-slate-200">
        <CardHeader className="space-y-2">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <UserRound className="h-5 w-5" />
          </div>
          <CardTitle className="text-center text-2xl font-bold tracking-tight text-slate-900">
            {tab === "signin" ? "Sign in to your account" : "Create your account"}
          </CardTitle>
          <CardDescription className="text-center text-xs text-slate-500">
            One {displayName} account for everything on this site.
          </CardDescription>

          {uses.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1.5 pt-1" aria-label="This account works for">
              {uses.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  <Icon className="h-3 w-3" /> {label}
                </li>
              ))}
            </ul>
          )}

          <div className="flex rounded-xl bg-slate-100 p-1 mt-3" role="tablist">
            {(
              [
                { id: "signin", label: "Sign in", icon: LogIn },
                { id: "signup", label: "Create account", icon: UserPlus },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => switchTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                  tab === id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {tab === "signin" ? (
            <form className="space-y-4" onSubmit={handleSignIn}>
              <Field label="Email" error={signIn.fieldErrors?.email?.[0]}>
                <Input
                  type="email"
                  autoComplete="username"
                  value={signInEmail}
                  onChange={(event) => setSignInEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </Field>
              <Field label="Password" error={signIn.fieldErrors?.password?.[0]}>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={signInPassword}
                  onChange={(event) => setSignInPassword(event.target.value)}
                  placeholder="Your password"
                  required
                />
              </Field>
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              {signInError ? <p className="text-sm text-red-600">{signInError}</p> : null}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                disabled={signIn.state.status === "running"}
              >
                {signIn.state.status === "running" ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          ) : checkEmail ? (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Account created</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We sent a confirmation email to <span className="font-semibold">{email}</span>. Confirm it, then sign in.
              </p>
              <Button
                type="button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                onClick={() => switchTab("signin")}
              >
                Continue to sign in
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSignUp}>
              <Field label="Full name" error={signUp.fieldErrors?.name?.[0]}>
                <Input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </Field>
              <Field label="Email" error={signUp.fieldErrors?.email?.[0]}>
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </Field>
              <Field label="Password" error={signUp.fieldErrors?.password?.[0]}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </Field>
              <Field label="Confirm password" error={validationError ?? undefined}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </Field>
              {signUpError ? <p className="text-sm text-red-600">{signUpError}</p> : null}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                disabled={signUp.state.status === "running"}
              >
                {signUp.state.status === "running" ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
