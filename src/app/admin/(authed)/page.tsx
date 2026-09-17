import { Suspense } from "react";
import { OverviewView } from "./overview-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading dashboard..." />}>
      <OverviewView />
    </Suspense>
  );
}
