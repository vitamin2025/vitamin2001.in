"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmailVerificationBanner } from "@/components/common/email-verification-banner";
import { ArrowRight, CheckCircle2, Globe, LogIn, UserPlus } from "lucide-react";
import { useClientSession, useClientAdminAuthCommands } from "@/lib/client-admin";

export interface FanLoginViewProps {
  slug: string;
  displayName: string;
  tagline?: string;
  redirectTarget?: string;
}

export function FanLoginView({
  slug,
  displayName,
  tagline,
  redirectTarget,
}: FanLoginViewProps) {
  const router = useRouter();
  const access = useClientSession();
  const { signIn, signUp, signOut } = useClientAdminAuthCommands();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpValidationErr, setSignUpValidationErr] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Auto redirect if granted and redirectTarget provided
  useEffect(() => {
    if (access.status === "granted" && redirectTarget) {
      router.replace(redirectTarget);
    }
  }, [access.status, redirectTarget, router]);

  if (access.status === "checking") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text={`Verifying session for ${displayName}...`} />
      </div>
    );
  }

  if (access.status === "unavailable") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center p-6">
        <div className="space-y-3">
          <h1 className="text-xl font-semibold text-slate-900">Service Unavailable</h1>
          <p className="text-sm text-slate-600">{access.error.message}</p>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Already authenticated view
  if (access.status === "granted") {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center gap-4 p-6">
        <EmailVerificationBanner actor={access.actor} />
        <Card className="w-full shadow-lg border-slate-200">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-mono text-xs">
                {slug}.vitamin2001.in
              </Badge>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 pt-2">
              Signed in to {displayName}
            </CardTitle>
            <CardDescription>
              Account: <span className="font-medium text-slate-900">{access.actor.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                Welcome back, {access.actor.name || "Subscriber"}!
              </p>
              <p className="text-xs text-slate-600">
                You are authenticated on {displayName}&apos;s fan portal. You have access to subscriber updates, posts, and community features.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link href={`/client/${slug}`} className="flex-1">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 font-medium shadow-sm">
                  <span>Go to {displayName}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => void signOut.run()}
                disabled={signOut.state.status === "running"}
                className="text-slate-700 border-slate-300"
              >
                {signOut.state.status === "running" ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Anonymous: Login & Signup Forms
  const signInFormError = signIn.fieldErrors?._form?.[0];
  const signUpFormError = signUp.fieldErrors?._form?.[0];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpValidationErr(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpValidationErr("Passwords do not match");
      return;
    }

    if (signUpPassword.length < 8) {
      setSignUpValidationErr("Password must be at least 8 characters long");
      return;
    }

    try {
      await signUp.run({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      });
      setSignUpSuccess(true);
    } catch {
      // Error is caught and surfaced by command state
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center p-6">
      <Card className="w-full shadow-xl border-slate-200">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-mono text-xs flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-600" />
              <span>{slug}.vitamin2001.in</span>
            </Badge>
            <span className="text-xs text-slate-400 font-medium">Fan Portal</span>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {activeTab === "signin" ? `Sign in to ${displayName}` : `Join ${displayName}`}
          </CardTitle>

          <CardDescription className="text-xs text-slate-500">
            {tagline ? (
              <span className="italic">{tagline}</span>
            ) : activeTab === "signin" ? (
              `Access exclusive content and creator updates on ${displayName}`
            ) : (
              `Create your fan account to support ${displayName}`
            )}
          </CardDescription>

          {/* Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mt-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setSignUpSuccess(false);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "signin"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setSignUpSuccess(false);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === "signin" ? (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void signIn.run({ email: signInEmail, password: signInPassword });
              }}
            >
              <Field label="Email" error={signIn.fieldErrors?.email?.[0]}>
                <Input
                  type="email"
                  autoComplete="username"
                  value={signInEmail}
                  onChange={(event) => setSignInEmail(event.target.value)}
                  placeholder="fan@example.com"
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

              {signInFormError ? <p className="text-sm text-red-600">{signInFormError}</p> : null}
              {signIn.state.status === "failed" && !signInFormError ? (
                <p className="text-sm text-red-600">{signIn.state.error.message}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                disabled={signIn.state.status === "running"}
              >
                {signIn.state.status === "running" ? "Signing in..." : `Sign in to ${displayName}`}
              </Button>
            </form>
          ) : signUpSuccess ? (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Account Created!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Welcome to <span className="font-semibold">{displayName}</span>. A confirmation email has been sent to{" "}
                <span className="font-semibold">{signUpEmail}</span>.
              </p>
              <Button
                type="button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                onClick={() => {
                  setActiveTab("signin");
                  setSignUpSuccess(false);
                }}
              >
                Continue to Sign In
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSignUp}>
              <Field label="Full Name" error={signUp.fieldErrors?.name?.[0]}>
                <Input
                  type="text"
                  autoComplete="name"
                  value={signUpName}
                  onChange={(event) => setSignUpName(event.target.value)}
                  placeholder="Your Name"
                  required
                />
              </Field>

              <Field label="Email address" error={signUp.fieldErrors?.email?.[0]}>
                <Input
                  type="email"
                  autoComplete="email"
                  value={signUpEmail}
                  onChange={(event) => setSignUpEmail(event.target.value)}
                  placeholder="fan@example.com"
                  required
                />
              </Field>

              <Field label="Password" error={signUp.fieldErrors?.password?.[0]}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={signUpPassword}
                  onChange={(event) => setSignUpPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </Field>

              <Field label="Confirm Password" error={signUpValidationErr ?? undefined}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={signUpConfirmPassword}
                  onChange={(event) => setSignUpConfirmPassword(event.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </Field>

              {signUpFormError ? <p className="text-sm text-red-600">{signUpFormError}</p> : null}
              {signUp.state.status === "failed" && !signUpFormError ? (
                <p className="text-sm text-red-600">{signUp.state.error.message}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                disabled={signUp.state.status === "running"}
              >
                {signUp.state.status === "running" ? "Creating account..." : `Join ${displayName}`}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
