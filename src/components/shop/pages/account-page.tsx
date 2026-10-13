"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, MapPin, Package, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientAdminAuthCommands, useClientSession } from "@/lib/client-admin";
import { shopErrorMessage } from "@/lib/shop/api";
import { formatDate, formatMoney, orderStateLabel, orderStateTone } from "@/lib/shop/format";
import { useDeleteAddress, useMyOrders, useResetShopSession, useSaveAddress, useSavedAddresses } from "@/lib/shop/hooks";
import { loginHref, useShopStore } from "@/lib/shop/store-context";
import { useHydrated } from "@/lib/shop/use-hydrated";
import type { MyOrderSummary, SavedAddress } from "@/lib/shop/types";
import { cn } from "@/lib/utils";
import { accentLinkClass, AccentButton } from "../accent-button";
import { AddressForm } from "../address-form";
import { FormError } from "../form-fields";
import { AddressBlock } from "../paid-order";
import { ProductImage } from "../product-card";
import { EmptyState } from "../shop-states";

export type AccountTab = "orders" | "addresses";

export function StateBadge({ state }: { state: string }) {
  const tone = orderStateTone(state);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "positive" && "bg-emerald-50 text-emerald-700",
        tone === "negative" && "bg-rose-50 text-rose-700",
        tone === "neutral" && "bg-slate-100 text-slate-700",
      )}
    >
      {orderStateLabel(state)}
    </span>
  );
}

function OrderCard({ order }: { order: MyOrderSummary }) {
  const { basePath } = useShopStore();
  const names = order.lines.map((line) => line.productName);
  return (
    <li>
      <Link
        href={`${basePath}/account/orders/${encodeURIComponent(order.code)}`}
        className="group flex flex-col gap-4 rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center"
      >
        <div className="flex -space-x-3">
          {order.lines.slice(0, 3).map((line, index) => (
            <ProductImage
              key={`${line.productSlug}-${index}`}
              src={line.image}
              alt=""
              className="h-14 w-14 rounded-xl bg-white ring-2 ring-white"
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-900">{order.code}</span>
            <StateBadge state={order.state} />
          </div>
          <p className="mt-1 truncate text-sm text-slate-600">
            {names.slice(0, 2).join(", ")}
            {names.length > 2 && ` and ${names.length - 2} more`}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatDate(order.placedAt)} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="font-semibold tabular-nums text-slate-900">{formatMoney(order.totalMinor, order.currency)}</span>
          <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5" />
        </div>
      </Link>
    </li>
  );
}

function OrdersTab() {
  const { basePath } = useShopStore();
  const [page, setPage] = useState(1);
  const orders = useMyOrders(page);

  if (orders.isPending) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-24 rounded-3xl" />
        ))}
      </div>
    );
  }
  if (orders.isError) {
    return (
      <FormError>
        {shopErrorMessage(orders.error)}{" "}
        <button type="button" onClick={() => orders.refetch()} className="font-semibold underline">
          Try again
        </button>
      </FormError>
    );
  }
  if (!orders.data.items.length) {
    return (
      <EmptyState
        icon={<Package className="h-7 w-7" />}
        title="No orders yet"
        action={
          <Link href={`${basePath}/products`} className={accentLinkClass()}>
            Start shopping
          </Link>
        }
      >
        Orders you place while signed in show up here.
      </EmptyState>
    );
  }

  const pages = Math.max(1, Math.ceil(orders.data.total / orders.data.perPage));
  return (
    <div className={cn("space-y-6", orders.isPlaceholderData && "opacity-60")}>
      <ul className="space-y-3">
        {orders.data.items.map((order) => (
          <OrderCard key={order.code} order={order} />
        ))}
      </ul>
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Newer
          </Button>
          <span className="text-slate-500">
            Page {page} of {pages}
          </span>
          <Button variant="outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Older
          </Button>
        </div>
      )}
    </div>
  );
}

function AddressCard({ address, onEdit }: { address: SavedAddress; onEdit: () => void }) {
  const save = useSaveAddress();
  const remove = useDeleteAddress();
  const [confirming, setConfirming] = useState(false);
  const error = save.error ?? remove.error;
  return (
    <li className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 p-5">
      <div>
        <AddressBlock title={address.fullName} address={{ ...address, fullName: "" }} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {address.defaultShipping && (
            <span className="rounded-full bg-(--shop-accent-soft) px-2 py-0.5 text-xs font-medium text-(--shop-accent-strong)">
              Default delivery
            </span>
          )}
          {address.defaultBilling && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Default billing</span>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-rose-600">{shopErrorMessage(error)}</p>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
        <button type="button" onClick={onEdit} className="text-(--shop-accent) hover:underline">
          Edit
        </button>
        {!address.defaultShipping && (
          <button
            type="button"
            disabled={save.isPending}
            onClick={() => save.mutate({ id: address.id, defaultShipping: true })}
            className="text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            Make default
          </button>
        )}
        {confirming ? (
          <span className="flex items-center gap-3">
            <button
              type="button"
              disabled={remove.isPending}
              onClick={() => remove.mutate(address.id)}
              className="text-rose-600 hover:underline disabled:opacity-50"
            >
              {remove.isPending ? "Removing…" : "Yes, remove"}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-slate-500">
              Keep
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="text-slate-600 hover:text-rose-600">
            Remove
          </button>
        )}
      </div>
    </li>
  );
}

function AddressesTab() {
  const addresses = useSavedAddresses();
  const save = useSaveAddress();
  const [editing, setEditing] = useState<SavedAddress | "new" | null>(null);

  if (addresses.isPending) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-44 rounded-3xl" />
        <Skeleton className="h-44 rounded-3xl" />
      </div>
    );
  }
  if (addresses.isError) {
    return <FormError>{shopErrorMessage(addresses.error)}</FormError>;
  }

  if (editing) {
    const existing = editing === "new" ? null : editing;
    return (
      <section className="rounded-3xl border border-slate-200 p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold">{existing ? "Edit address" : "Add an address"}</h2>
        <AddressForm
          initial={existing}
          submitLabel="Save address"
          pending={save.isPending}
          error={save.isError && shopErrorMessage(save.error)}
          onCancel={() => {
            save.reset();
            setEditing(null);
          }}
          onSubmit={(input) =>
            save.mutate(existing ? { ...input, id: existing.id } : { ...input, defaultShipping: addresses.data.length === 0 }, {
              onSuccess: () => setEditing(null),
            })
          }
        />
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {addresses.data.length === 0 ? (
        <EmptyState icon={<MapPin className="h-7 w-7" />} title="No saved addresses">
          Save an address here or at checkout to deliver to it in one tap.
        </EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {addresses.data.map((address) => (
            <AddressCard key={address.id} address={address} onEdit={() => setEditing(address)} />
          ))}
        </ul>
      )}
      <AccentButton type="button" onClick={() => setEditing("new")}>
        <Plus /> Add an address
      </AccentButton>
    </div>
  );
}

export function AccountPage({ tab }: { tab: AccountTab }) {
  const { basePath, userRoot, profile } = useShopStore();
  const pathname = usePathname();
  const router = useRouter();
  const session = useClientSession();
  const { signOut } = useClientAdminAuthCommands();
  const resetShop = useResetShopSession();
  const hydrated = useHydrated();

  if (!hydrated || session.status === "checking") {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-24 rounded-3xl" />
      </div>
    );
  }

  if (session.status !== "granted") {
    return (
      <EmptyState
        icon={<UserRound className="h-7 w-7" />}
        title="Sign in to your account"
        action={
          <Link href={loginHref(userRoot, pathname)} className={accentLinkClass()}>
            Sign in or create an account
          </Link>
        }
      >
        See your orders from {profile.name}, track deliveries and keep your addresses for a faster checkout.
        {session.status === "unavailable" && <span className="mt-2 block text-rose-600">{session.error.message}</span>}
      </EmptyState>
    );
  }

  const tabs: { id: AccountTab; label: string; icon: typeof Package }[] = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My account</h1>
          <p className="mt-1 text-sm text-slate-500">
            {session.actor.name ? `${session.actor.name} · ` : ""}
            {session.actor.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`${userRoot}/account?back=${encodeURIComponent(`${basePath}/account`)}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <UserRound className="h-4 w-4" /> Profile
          </Link>
          <button
            type="button"
            disabled={signOut.state.status === "running"}
            onClick={async () => {
              await signOut.run();
              await resetShop();
              router.push(basePath);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <nav className="mt-8 flex gap-1 border-b border-slate-200" aria-label="Account sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={id === "orders" ? `${basePath}/account` : `${basePath}/account?tab=${id}`}
            replace
            scroll={false}
            aria-current={tab === id ? "page" : undefined}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
              tab === id
                ? "border-(--shop-accent) text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">{tab === "addresses" ? <AddressesTab /> : <OrdersTab />}</div>
    </div>
  );
}
