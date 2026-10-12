"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { isShopApiError, shopFetch, storePrefix, type StoreSlug } from "./api";
import { postToPayu } from "./payu";
import { useShopStore } from "./store-context";
import type {
  AddressInput,
  Cart,
  ContactInput,
  MyOrder,
  MyOrders,
  OrderStatus,
  PayResponse,
  SavedAddress,
  ShippingOptions,
} from "./types";

export const shopKeys = {
  all: (seller: StoreSlug) => ["shop", seller ?? "~house"] as const,
  cart: (seller: StoreSlug) => [...shopKeys.all(seller), "cart"] as const,
  shippingOptions: (seller: StoreSlug) => [...shopKeys.all(seller), "shipping-options"] as const,
  order: (seller: StoreSlug, code: string) => [...shopKeys.all(seller), "order", code] as const,
  me: (seller: StoreSlug) => [...shopKeys.all(seller), "me"] as const,
  myOrders: (seller: StoreSlug, page: number) => [...shopKeys.me(seller), "orders", page] as const,
  myOrder: (seller: StoreSlug, code: string) => [...shopKeys.me(seller), "order", code] as const,
  addresses: (seller: StoreSlug) => [...shopKeys.me(seller), "addresses"] as const,
};

/** Every cart and checkout answer is the whole cart: it replaces what the page shows. */
function storeCart(queryClient: QueryClient, seller: StoreSlug, cart: Cart): void {
  queryClient.setQueryData(shopKeys.cart(seller), cart);
}

/**
 * Runs a cart change. `CART_LOCKED` (a payment was being set up) is retried once after the
 * cart is read again, as the API asks.
 */
async function cartChange(
  seller: StoreSlug,
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<Cart> {
  const run = () => shopFetch<Cart>(`${storePrefix(seller)}${path}`, { method, body });
  try {
    return await run();
  } catch (error) {
    if (isShopApiError(error) && error.code === "CART_LOCKED") {
      await shopFetch<Cart>(`${storePrefix(seller)}/cart`);
      return run();
    }
    throw error;
  }
}

function useCartMutation<TInput>(
  request: (seller: StoreSlug, input: TInput) => Promise<Cart>,
) {
  const { seller } = useShopStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TInput) => request(seller, input),
    onSuccess: (cart) => {
      storeCart(queryClient, seller, cart);
      void queryClient.invalidateQueries({ queryKey: shopKeys.shippingOptions(seller) });
    },
    onError: (error) => {
      // The cart moved on (stock, another tab, a payment): show what it is now.
      if (isShopApiError(error) && error.status !== 400 && error.status !== 429) {
        void queryClient.invalidateQueries({ queryKey: shopKeys.cart(seller) });
      }
    },
  });
}

export function useCart() {
  const { seller } = useShopStore();
  return useQuery({
    queryKey: shopKeys.cart(seller),
    queryFn: () => shopFetch<Cart>(`${storePrefix(seller)}/cart`),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useAddToCart() {
  return useCartMutation((seller, input: { variantId: string; quantity: number }) =>
    cartChange(seller, "/cart/items", "POST", input),
  );
}

export function useUpdateCartLine() {
  return useCartMutation((seller, input: { lineId: string; quantity: number }) =>
    cartChange(seller, `/cart/items/${encodeURIComponent(input.lineId)}`, "PATCH", {
      quantity: input.quantity,
    }),
  );
}

export function useRemoveCartLine() {
  return useCartMutation((seller, lineId: string) =>
    cartChange(seller, `/cart/items/${encodeURIComponent(lineId)}`, "DELETE"),
  );
}

export function useApplyCoupon() {
  return useCartMutation((seller, code: string) =>
    cartChange(seller, "/cart/coupons", "POST", { code }),
  );
}

export function useRemoveCoupon() {
  return useCartMutation((seller, code: string) =>
    cartChange(seller, `/cart/coupons/${encodeURIComponent(code)}`, "DELETE"),
  );
}

export function useSetContact() {
  return useCartMutation((seller, input: ContactInput) =>
    cartChange(seller, "/checkout/contact", "PUT", input),
  );
}

export type AddressChoice =
  | { readonly address: AddressInput; readonly saveToAccount?: boolean }
  | { readonly addressId: string };

export function useSetShippingAddress() {
  return useCartMutation((seller, input: AddressChoice) =>
    cartChange(seller, "/checkout/shipping-address", "PUT", input),
  );
}

export function useSetBillingAddress() {
  return useCartMutation((seller, input: AddressChoice | { sameAsShipping: true }) =>
    cartChange(seller, "/checkout/billing-address", "PUT", input),
  );
}

export function useShippingOptions(enabled: boolean) {
  const { seller } = useShopStore();
  return useQuery({
    queryKey: shopKeys.shippingOptions(seller),
    queryFn: () => shopFetch<ShippingOptions>(`${storePrefix(seller)}/checkout/shipping-options`),
    enabled,
    staleTime: 0,
  });
}

export function useSetShipping() {
  return useCartMutation((seller, methodIds: string[]) =>
    cartChange(seller, "/checkout/shipping", "PUT", { methodIds }),
  );
}

/** The page PayU sends the shopper back to, on this site. */
export function orderPageUrl(basePath: string, code?: string): string {
  const url = `${window.location.origin}${basePath}/order/success`;
  return code ? `${url}?order=${encodeURIComponent(code)}` : url;
}

/**
 * Starts a PayU payment and leaves the page. If PayU already took a payment for this cart, the
 * shopper is sent to the order page instead.
 */
export function usePay() {
  const { seller, basePath } = useShopStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cartCode: string | null) => {
      try {
        const pay = await shopFetch<PayResponse>(`${storePrefix(seller)}/checkout/pay`, {
          method: "POST",
          body: { returnUrl: orderPageUrl(basePath) },
        });
        postToPayu(pay.payu);
        return pay;
      } catch (error) {
        if (isShopApiError(error) && error.code === "PAYMENT_IN_PROGRESS" && cartCode) {
          window.location.assign(orderPageUrl(basePath, cartCode));
          return null;
        }
        throw error;
      }
    },
    onError: () => void queryClient.invalidateQueries({ queryKey: shopKeys.cart(seller) }),
  });
}

/** How often the order page asks while a payment is open, and for how long. */
const ORDER_POLL_MS = 10_000;
const ORDER_POLL_FOR_MS = 5 * 60_000;

/**
 * The order page: payment status and the order as paid for. Polls while PayU or the shop is
 * still confirming, for up to five minutes.
 */
export function useOrderStatus(code: string | null) {
  const { seller } = useShopStore();
  const [startedAt] = useState(() => Date.now());
  const query = useQuery({
    queryKey: shopKeys.order(seller, code ?? ""),
    queryFn: () =>
      shopFetch<OrderStatus>(`${storePrefix(seller)}/orders/${encodeURIComponent(code ?? "")}`),
    enabled: Boolean(code),
    retry: (count, error) => !(isShopApiError(error) && error.isNotFound) && count < 2,
    refetchInterval: (current) => {
      const status = current.state.data?.payment.status;
      const waiting = status === "pending" || status === "paid";
      return waiting && Date.now() - startedAt < ORDER_POLL_FOR_MS ? ORDER_POLL_MS : false;
    },
    staleTime: 0,
  });
  const status = query.data?.payment.status;
  /** Still unconfirmed after five minutes: the email will follow. */
  const stillConfirming =
    (status === "pending" || status === "paid") &&
    query.dataUpdatedAt - startedAt >= ORDER_POLL_FOR_MS - ORDER_POLL_MS;
  return { ...query, stillConfirming };
}

export function useMyOrders(page: number, enabled = true) {
  const { seller } = useShopStore();
  return useQuery({
    queryKey: shopKeys.myOrders(seller, page),
    queryFn: () =>
      shopFetch<MyOrders>(`${storePrefix(seller)}/me/orders`, {
        query: { page, perPage: 10 },
      }),
    enabled,
    placeholderData: keepPreviousData,
    retry: (count, error) => !(isShopApiError(error) && error.status === 401) && count < 1,
  });
}

export function useMyOrder(code: string, enabled = true) {
  const { seller } = useShopStore();
  return useQuery({
    queryKey: shopKeys.myOrder(seller, code),
    queryFn: () =>
      shopFetch<MyOrder>(`${storePrefix(seller)}/me/orders/${encodeURIComponent(code)}`),
    enabled: enabled && Boolean(code),
    retry: false,
  });
}

export function useSavedAddresses(enabled = true) {
  const { seller } = useShopStore();
  return useQuery({
    queryKey: shopKeys.addresses(seller),
    queryFn: async () =>
      (await shopFetch<{ items: SavedAddress[] }>(`${storePrefix(seller)}/me/addresses`)).items,
    enabled,
    retry: false,
  });
}

export type SavedAddressInput = AddressInput & {
  defaultShipping?: boolean;
  defaultBilling?: boolean;
};

export function useSaveAddress() {
  const { seller } = useShopStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: (SavedAddressInput & { id?: undefined }) | (Partial<SavedAddressInput> & { id: string })) =>
      shopFetch<SavedAddress>(
        `${storePrefix(seller)}/me/addresses${id ? `/${encodeURIComponent(id)}` : ""}`,
        { method: id ? "PATCH" : "POST", body: input },
      ),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: shopKeys.addresses(seller) }),
  });
}

export function useDeleteAddress() {
  const { seller } = useShopStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      shopFetch<{ deleted: true }>(`${storePrefix(seller)}/me/addresses/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: shopKeys.addresses(seller) }),
  });
}

/**
 * After sign-in or sign-out the API swaps this browser's shop session on the next call (and
 * merges a guest cart into the account's). Drop what this store has cached.
 */
export function useResetShopSession() {
  const { seller } = useShopStore();
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: shopKeys.all(seller) });
}
