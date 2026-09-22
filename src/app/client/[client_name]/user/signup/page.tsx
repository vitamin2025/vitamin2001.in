"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { UserPlus, Globe, LogIn, ArrowRight, CheckCircle2 } from "lucide-react";
import { useClientSession, useClientAdminAuthCommands } from "@/lib/client-admin";
import { useFanFollow } from "@/lib/client-admin/creator";

const _signupContract = {
  createsPatron: true,
  initialRank: 0,
};

export default function FanSignupPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);
  const router = useRouter();
  const session = useClientSession();
  const { signUp } = useClientAdminAuthCommands();
  const follow = useFanFollow(slug);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [followed, setFollowed] = useState(false);

  // If user is already authenticated, follow automatically and redirect to feed
  useEffect(() => {
    if (session.status === "granted" && !followed && !isProcessing) {
      setIsProcessing(true);
      follow
        .mutateAsync()
        .then(() => {
          setFollowed(true);
          router.replace(`/client/${encodeURIComponent(slug)}/user/feed`);
        })
        .catch(() => {
          // Even if already followed or non-fatal, proceed to feed
          setFollowed(true);
          router.replace(`/client/${encodeURIComponent(slug)}/user/feed`);
        });
    }
  }, [session.status, followed, isProcessing, follow, router, slug]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }

    setIsProcessing(true);
    try {
      await signUp.run({ name, email, password });
      // Create free rank 0 patron row by following
      await follow.mutateAsync();
      setFollowed(true);
      router.replace(`/client/${encodeURIComponent(slug)}/user/feed`);
    } catch (err: any) {
      setIsProcessing(false);
      setValidationError(err?.message || "Failed to create account. Please try again.");
    }
  };

  if (session.status === "checking" || (session.status === "granted" && isProcessing)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text={`Joining ${slug}'s community...`} />
      </div>
    );
  }

  const formError = signUp.fieldErrors?._form?.[0] || validationError;

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-md items-center p-6">
      <Card className="w-full shadow-xl border-slate-200">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 font-mono text-xs flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-indigo-600" />
              <span>{slug}.vitamin2001.in</span>
            </Badge>
            <span className="text-xs text-slate-400 font-medium">Free Membership</span>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Join {slug}&apos;s Community
          </CardTitle>

          <CardDescription className="text-xs text-slate-500">
            Sign up to follow {slug} for free, access subscriber posts, and join the conversation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <Field label="Full Name" error={signUp.fieldErrors?.name?.[0]}>
              <Input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </Field>

            <Field label="Email Address" error={signUp.fieldErrors?.email?.[0]}>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fan@example.com"
                required
              />
            </Field>

            <Field label="Password" error={signUp.fieldErrors?.password?.[0]}>
              <Input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </Field>

            <Field label="Confirm Password" error={validationError ?? undefined}>
              <Input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </Field>

            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2"
              disabled={isProcessing || signUp.state.status === "running"}
            >
              {isProcessing || signUp.state.status === "running" ? (
                <span>Creating account & joining...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Join Free Membership</span>
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Already have an account?</span>
            <Link
              href={`/client/${encodeURIComponent(slug)}/user/login?redirect=/client/${encodeURIComponent(slug)}/user/feed`}
              className="font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
