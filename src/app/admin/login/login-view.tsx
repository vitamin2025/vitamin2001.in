"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/admin";
import { adminRoutes, useAdminAccess, useAuthCommands } from "@/lib/admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export function LoginView() {
  const access = useAdminAccess();
  const { signIn, signOut } = useAuthCommands();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (access.status === "granted") {
      router.replace(adminRoutes.overview());
    }
  }, [access.status, router]);

  if (access.status === "checking" || access.status === "granted") {
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
          <h1 className="text-xl font-semibold">Admin API unavailable</h1>
          <p className="text-sm text-slate-600">{access.error.message}</p>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (access.status === "denied") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="text-sm text-slate-600">
          Signed in as {access.actor.email}, but this account is not a System
          organization owner.
        </p>
        <Button type="button" variant="outline" onClick={() => void signOut.run()}>
          Sign out
        </Button>
      </div>
    );
  }

  const formError = signIn.fieldErrors?._form?.[0];

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Platform admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void signIn.run({ email, password });
            }}
          >
            <Field label="Email" error={signIn.fieldErrors?.email?.[0]}>
              <Input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Field label="Password" error={signIn.fieldErrors?.password?.[0]}>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            {signIn.state.status === "failed" && !formError ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
