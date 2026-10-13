"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AccountAuthView } from "@/components/client-admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { clientUserRoutes, safeRedirectPath, useClientSession } from "@/lib/client-admin";
import { useFanFollow } from "@/lib/client-admin/creator";
import { useClient } from "@/providers/client-provider";

/**
 * Create the shared account (the same form as sign-in, on its other tab). On a creator's site a
 * new account also follows the creator for free and lands on the feed, as joining always has.
 */
export default function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ client_name: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { client_name: slug } = use(params);
  const redirect = safeRedirectPath(use(searchParams).redirect);
  const router = useRouter();
  const session = useClientSession();
  const { client, hasCreatorFeature } = useClient();
  const follow = useFanFollow(slug);
  const joining = useRef(false);

  const target = redirect ?? (hasCreatorFeature ? clientUserRoutes.fanFeed(slug) : undefined);

  // Signed in (already, or just now) while joining a creator: follow them and go to the feed.
  useEffect(() => {
    if (session.status !== "granted" || !hasCreatorFeature || redirect || joining.current) return;
    joining.current = true;
    follow
      .mutateAsync()
      .catch(() => undefined)
      .finally(() => router.replace(clientUserRoutes.fanFeed(slug)));
  }, [session.status, hasCreatorFeature, redirect, follow, router, slug]);

  if (session.status === "granted" && hasCreatorFeature && !redirect) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner text={`Joining ${client?.name || slug}'s community...`} />
      </div>
    );
  }

  return (
    <AccountAuthView
      slug={slug}
      displayName={client?.name || slug}
      initialTab="signup"
      redirectTarget={target}
      // Without a redirect the effect above follows once the new session lands.
      onSignedUp={hasCreatorFeature && redirect ? () => follow.mutateAsync() : undefined}
    />
  );
}
