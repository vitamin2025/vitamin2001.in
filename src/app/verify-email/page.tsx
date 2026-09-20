"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { authRequest } from "@/lib/admin/http";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const callbackURL = searchParams.get("callbackURL") || "/client/user";

  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "No verification token found in the URL.",
  );

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function verify() {
      try {
        await authRequest({
          method: "GET",
          path: `/verify-email?token=${encodeURIComponent(token!)}`,
          parse: () => undefined,
        });

        if (isMounted) {
          setStatus("success");
          setTimeout(() => {
            router.push(callbackURL);
          }, 3000);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setStatus("error");
          const msg =
            err instanceof Error
              ? err.message
              : "Verification failed. The token may be expired or invalid.";
          setErrorMessage(msg);
        }
      }
    }

    void verify();

    return () => {
      isMounted = false;
    };
  }, [token, callbackURL, router]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full">
            {status === "loading" && (
              <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            )}
            {status === "error" && (
              <div className="rounded-full bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-8 w-8" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl font-bold">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Email verified successfully!"}
            {status === "error" && "Verification failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we confirm your email address."}
            {status === "success" && "Your email has been confirmed. Redirecting you shortly..."}
            {status === "error" && (errorMessage || "The verification link is invalid or expired.")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "success" && (
            <Link href={callbackURL}>
              <Button className="w-full gap-2">
                Continue to your account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <Link href="/client/user">
                <Button className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
