import { Suspense } from "react";
import { UsersView } from "./users-view";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading users..." />}>
      <UsersView />
    </Suspense>
  );
}
