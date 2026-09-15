import { Suspense } from "react";
import { SessionsView } from "./sessions-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function SessionsPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading sessions..." />}>
      <SessionsView />
    </Suspense>
  );
}
