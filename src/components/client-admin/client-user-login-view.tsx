"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field } from "@/components/admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmailVerificationBanner } from "@/components/common/email-verification-banner";
import {
  useClientAdminAuthCommands,
  useClientSession,
} from "@/lib/client-admin";

export function ClientUserLoginView() {
  const access = useClientSession();
  const { signIn, signUp, signOut } = useClientAdminAuthCommands();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpValidationErr, setSignUpValidationErr] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  if (access.status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner text="Checking session..." />
      </div>
    );
  }

  if (access.status === "unavailable") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <div className="space-y-3">
          <h1 className="text-xl font-semibold">API unavailable</h1>
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
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
        <EmailVerificationBanner actor={access.actor} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Signed in</CardTitle>
            <CardDescription>
              Signed in as <span className="font-medium text-slate-900">{access.actor.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Welcome back, {access.actor.name || "User"}! A member workspace is not available yet.
            </p>
            <Button type="button" variant="outline" onClick={() => void signOut.run()}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      // Error handled by command state
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {activeTab === "signin" ? "Sign in to your account" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {activeTab === "signin"
              ? "Enter your credentials to access your account"
              : "Sign up to start using vitamin2001 services"}
          </CardDescription>

          <div className="flex rounded-lg bg-slate-100 p-1 mt-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setSignUpSuccess(false);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                activeTab === "signin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setSignUpSuccess(false);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
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
                  required
                />
              </Field>
              <Field label="Password" error={signIn.fieldErrors?.password?.[0]}>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={signInPassword}
                  onChange={(event) => setSignInPassword(event.target.value)}
                  required
                />
              </Field>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
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
                className="w-full"
                disabled={signIn.state.status === "running"}
              >
                {signIn.state.status === "running" ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          ) : signUpSuccess ? (
            <div className="space-y-4 py-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Account created!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We have sent a verification link to <span className="font-semibold">{signUpEmail}</span>.
                You can use your account now or verify your email at any time.
              </p>
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setActiveTab("signin");
                  setSignUpSuccess(false);
                }}
              >
                Go to Sign In
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
                  placeholder="John Doe"
                  required
                />
              </Field>

              <Field label="Email address" error={signUp.fieldErrors?.email?.[0]}>
                <Input
                  type="email"
                  autoComplete="email"
                  value={signUpEmail}
                  onChange={(event) => setSignUpEmail(event.target.value)}
                  placeholder="john@example.com"
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
                  required
                />
              </Field>

              {signUpFormError ? <p className="text-sm text-red-600">{signUpFormError}</p> : null}
              {signUp.state.status === "failed" && !signUpFormError ? (
                <p className="text-sm text-red-600">{signUp.state.error.message}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={signUp.state.status === "running"}
              >
                {signUp.state.status === "running" ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
