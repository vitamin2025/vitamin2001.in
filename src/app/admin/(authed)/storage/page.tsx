import { Suspense } from "react";
import { StorageView } from "./storage-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function StoragePage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading storage..." />}>
      <StorageView />
    </Suspense>
  );
}
