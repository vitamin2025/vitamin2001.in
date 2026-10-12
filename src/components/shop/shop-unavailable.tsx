"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CloudOff, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./shop-states";

/** The shop API didn't answer (the shop may be starting up). */
export function ShopUnavailable() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={<CloudOff className="h-7 w-7" />}
        title="The shop is waking up"
        action={
          <Button onClick={() => startTransition(() => router.refresh())} disabled={pending} className="gap-2">
            <RotateCw className={pending ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Try again
          </Button>
        }
      >
        We couldn&apos;t load the shop just now. Please try again in a moment.
      </EmptyState>
    </div>
  );
}
