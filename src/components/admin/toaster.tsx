"use client";

import { useSyncExternalStore } from "react";
import { getServerToasts, getToasts, subscribeToasts } from "@/stores/admin-feedback";

export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
