"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False on the server and while React hydrates, true after. The shop's header starts the cart and
 * session requests, and a page that streams in later can hydrate after they answered: pages whose
 * first render depends on them show their loading state until this is true, as the server did.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
