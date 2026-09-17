import { Suspense } from "react";
import { AuditView } from "./audit-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function AuditPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading audit log..." />}>
      <AuditView />
    </Suspense>
  );
}
