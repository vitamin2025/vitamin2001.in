import { Suspense } from "react";
import { OrgsView } from "./orgs-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading organizations..." />}>
      <OrgsView />
    </Suspense>
  );
}
