import { Suspense } from "react";
import { redirect } from "next/navigation";
import { TenantRedirectView } from "./tenant-redirect-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface ApexUserPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ClientUserPage({ searchParams }: ApexUserPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const slug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug : undefined;

  // Direct redirect if tenant slug parameter is present
  if (slug) {
    redirect(`/client/${encodeURIComponent(slug)}/user/login`);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner text="Redirecting to member login..." />
        </div>
      }
    >
      <TenantRedirectView />
    </Suspense>
  );
}
