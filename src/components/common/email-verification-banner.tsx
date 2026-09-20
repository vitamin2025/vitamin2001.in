"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { authRequest } from "@/lib/admin/http";
import type { Actor } from "@/lib/admin/policy";

export function EmailVerificationBanner({ actor }: { actor?: Actor | null }) {
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!actor || actor.emailVerified || isDismissed) {
    return null;
  }

  const handleResend = async () => {
    setIsSending(true);
    setSentMessage(null);
    setErrorMessage(null);
    try {
      await authRequest({
        method: "POST",
        path: "/send-verification-email",
        body: { email: actor.email },
        parse: () => undefined,
      });
      setSentMessage("Verification link sent! Check your inbox.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification email.";
      setErrorMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative mb-4 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 shadow-sm sm:text-sm">
      <div className="flex items-center gap-2.5">
        <Mail className="h-4 w-4 shrink-0 text-amber-600" />
        <div>
          <span>
            Your email <strong className="font-medium">{actor.email}</strong> is not verified.
          </span>{" "}
          {sentMessage ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {sentMessage}
            </span>
          ) : errorMessage ? (
            <span className="inline-flex items-center gap-1 font-semibold text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errorMessage}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isSending}
              className="inline-flex items-center gap-1 font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend verification email"
              )}
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss banner"
        className="rounded p-1 text-amber-600 hover:bg-amber-100 hover:text-amber-800"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
