"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Info, Lock, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientSession } from "@/lib/client-admin";
import { isShopApiError, shopErrorMessage } from "@/lib/shop/api";
import { addressLines, formatMoney } from "@/lib/shop/format";
import {
  orderPageUrl,
  useCart,
  usePay,
  useSavedAddresses,
  useSetBillingAddress,
  useSetContact,
  useSetShipping,
  useSetShippingAddress,
  useShippingOptions,
} from "@/lib/shop/hooks";
import { loginHref, useShopStore } from "@/lib/shop/store-context";
import { useHydrated } from "@/lib/shop/use-hydrated";
import type { Address, Cart, ShippingOptions } from "@/lib/shop/types";
import { cn } from "@/lib/utils";
import { AccentButton, accentLinkClass } from "../accent-button";
import { AddressForm, normalizeIndianPhone, phoneForField } from "../address-form";
import { FormError, TextField } from "../form-fields";
import { OrderSummary } from "../order-summary";
import { EmptyState } from "../shop-states";

type StepName = "contact" | "address" | "shipping" | "billing";
type StepState = "done" | "open" | "locked";

function Step({
  number,
  title,
  state,
  summary,
  onChange,
  children,
}: {
  number: number;
  title: string;
  state: StepState;
  summary?: ReactNode;
  onChange?: () => void;
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border p-5 transition sm:p-6",
        state === "open" ? "border-slate-300 bg-white shadow-sm" : "border-slate-200 bg-white",
        state === "locked" && "opacity-60",
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            state === "done" ? "bg-(--shop-accent) text-white" : "bg-slate-100 text-slate-600",
            state === "open" && "bg-(--shop-accent-soft) text-(--shop-accent-strong)",
          )}
          aria-hidden
        >
          {state === "done" ? <Check className="h-4 w-4" /> : number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-h-8 items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {state === "done" && onChange && (
              <button type="button" onClick={onChange} className="text-sm font-medium text-(--shop-accent) hover:underline">
                Change
              </button>
            )}
          </div>
          {state === "done" && summary && <div className="mt-1.5 text-sm text-slate-600">{summary}</div>}
          {state === "open" && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </section>
  );
}

function AddressText({ address }: { address: Address }) {
  return (
    <address className="not-italic leading-relaxed">
      {addressLines(address).map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </address>
  );
}

function sameAddress(a: Address | null, b: Address | null): boolean {
  if (!a || !b) return a === b;
  return addressLines(a).join("\n") === addressLines(b).join("\n");
}

function SignInPrompt({ children }: { children: ReactNode }) {
  const { userRoot } = useShopStore();
  const pathname = usePathname();
  return (
    <FormError>
      {children}{" "}
      <Link href={loginHref(userRoot, pathname)} className="font-semibold underline">
        Sign in
      </Link>
    </FormError>
  );
}

function ContactForm({ cart, onDone }: { cart: Cart; onDone: () => void }) {
  const setContact = useSetContact();
  const { refetch } = useCart();
  const [fields, setFields] = useState(() => ({
    firstName: cart.customer?.firstName ?? "",
    lastName: cart.customer?.lastName ?? "",
    email: cart.customer?.email ?? "",
    phone: phoneForField(cart.customer?.phone),
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof typeof fields, string>>>({});
  const set = (name: keyof typeof fields) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const phone = normalizeIndianPhone(fields.phone);
    const next: typeof errors = {};
    if (!fields.firstName.trim()) next.firstName = "Enter your first name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = "Enter a valid email address.";
    if (!phone) next.phone = "Enter a 10-digit mobile number.";
    setErrors(next);
    if (Object.keys(next).length || !phone) return;
    setContact.mutate(
      {
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim() || undefined,
        email: fields.email.trim(),
        phone,
      },
      {
        onSuccess: onDone,
        onError: (error) => {
          // Signed in meanwhile (another tab): the cart already has the account's details.
          if (isShopApiError(error) && error.code === "ALREADY_SIGNED_IN") void refetch().then(onDone);
        },
      },
    );
  };

  const error = setContact.error;
  const needsSignIn = isShopApiError(error) && error.code === "SIGN_IN_REQUIRED";

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          autoComplete="given-name"
          value={fields.firstName}
          onChange={set("firstName")}
          maxLength={60}
          error={errors.firstName}
        />
        <TextField
          label="Last name"
          optional
          autoComplete="family-name"
          value={fields.lastName}
          onChange={set("lastName")}
          maxLength={60}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={set("email")}
          maxLength={254}
          error={errors.email}
          hint="We'll send the order confirmation and invoice here."
        />
        <TextField
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="98765 43210"
          value={fields.phone}
          onChange={set("phone")}
          maxLength={16}
          error={errors.phone}
        />
      </div>
      {needsSignIn ? (
        <SignInPrompt>This email already has an account. Sign in to use it.</SignInPrompt>
      ) : (
        error && !(isShopApiError(error) && error.code === "ALREADY_SIGNED_IN") && (
          <FormError>{shopErrorMessage(error)}</FormError>
        )
      )}
      <AccentButton type="submit" disabled={setContact.isPending}>
        {setContact.isPending ? "Saving…" : "Continue"}
      </AccentButton>
    </form>
  );
}

function ShippingAddressForm({
  cart,
  signedIn,
  onDone,
  onCancel,
}: {
  cart: Cart;
  signedIn: boolean;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const saved = useSavedAddresses(signedIn);
  const setAddress = useSetShippingAddress();
  const [choice, setChoice] = useState<string | null>(null);
  const [saveToAccount, setSaveToAccount] = useState(true);
  const addresses = signedIn ? saved.data ?? [] : [];
  const current =
    choice ??
    addresses.find((address) => sameAddress(address, cart.shippingAddress))?.id ??
    addresses.find((address) => address.defaultShipping)?.id ??
    addresses[0]?.id ??
    "new";

  const onError = (error: Error) => {
    if (isShopApiError(error) && error.code === "ADDRESS_NOT_FOUND") void saved.refetch();
  };
  const error = setAddress.error;
  const errorText =
    error &&
    (isShopApiError(error) && error.code === "SIGN_IN_REQUIRED" ? (
      <SignInPrompt>Your session ended.</SignInPrompt>
    ) : (
      <FormError>{shopErrorMessage(error)}</FormError>
    ));

  if (signedIn && saved.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    );
  }

  const initial: Partial<Address> = cart.shippingAddress ?? {
    fullName: [cart.customer?.firstName, cart.customer?.lastName].filter(Boolean).join(" "),
    phoneNumber: cart.customer?.phone ?? null,
  };

  return (
    <div className="space-y-4">
      {addresses.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="sr-only">Saved addresses</legend>
          {addresses.map((address) => (
            <label
              key={address.id}
              className={cn(
                "flex cursor-pointer gap-3 rounded-2xl border p-4 text-sm transition",
                current === address.id ? "border-(--shop-accent) bg-(--shop-accent-soft)" : "border-slate-200 hover:border-slate-300",
              )}
            >
              <input
                type="radio"
                name="saved-address"
                checked={current === address.id}
                onChange={() => setChoice(address.id)}
                className="mt-1 accent-(--shop-accent)"
              />
              <span className="text-slate-700">
                <AddressText address={address} />
                {address.defaultShipping && (
                  <span className="mt-1.5 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                    Default
                  </span>
                )}
              </span>
            </label>
          ))}
          <label
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-medium transition",
              current === "new" ? "border-(--shop-accent) bg-(--shop-accent-soft)" : "border-slate-200 hover:border-slate-300",
            )}
          >
            <input
              type="radio"
              name="saved-address"
              checked={current === "new"}
              onChange={() => setChoice("new")}
              className="accent-(--shop-accent)"
            />
            <MapPin className="h-4 w-4 text-slate-500" /> Use a new address
          </label>
        </fieldset>
      )}

      {current === "new" ? (
        <AddressForm
          initial={addresses.length ? null : initial}
          submitLabel="Deliver here"
          pending={setAddress.isPending}
          error={errorText}
          onCancel={onCancel}
          extra={
            signedIn && (
              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={saveToAccount}
                  onChange={(event) => setSaveToAccount(event.target.checked)}
                  className="h-4 w-4 accent-(--shop-accent)"
                />
                Save this address to my account
              </label>
            )
          }
          onSubmit={(address) =>
            setAddress.mutate(
              { address, saveToAccount: signedIn && saveToAccount ? true : undefined },
              { onSuccess: onDone, onError },
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {errorText}
          <div className="flex items-center gap-3">
            <AccentButton
              type="button"
              disabled={setAddress.isPending}
              onClick={() => setAddress.mutate({ addressId: current }, { onSuccess: onDone, onError })}
            >
              {setAddress.isPending ? "Saving…" : "Deliver here"}
            </AccentButton>
            {onCancel && (
              <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ShippingMethodForm({ cart, onDone }: { cart: Cart; onDone: () => void }) {
  const options = useShippingOptions(cart.checkout.hasShippingAddress);
  const setShipping = useSetShipping();
  const [picked, setPicked] = useState<Record<number, string[]>>({});
  const current = new Set(cart.shipping.map((method) => method.methodId));

  if (options.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
      </div>
    );
  }
  if (options.isError) {
    return (
      <FormError>
        {shopErrorMessage(options.error)}{" "}
        <button type="button" onClick={() => options.refetch()} className="font-semibold underline">
          Try again
        </button>
      </FormError>
    );
  }

  const groups: ShippingOptions["sellers"] = options.data.sellers;
  if (groups.every((group) => group.options.length === 0)) {
    return (
      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        We can&apos;t deliver to this address yet. Check the PIN code, or try another address.
      </p>
    );
  }

  /** A seller store picks one method. The marketplace lists every seller's methods together: one per seller. */
  const chosenIn = (index: number): string[] => {
    const group = groups[index];
    const fromCart = group.options.filter((option) => current.has(option.methodId)).map((option) => option.methodId);
    return picked[index] ?? (fromCart.length ? fromCart : group.options.slice(0, 1).map((option) => option.methodId));
  };
  const choose = (index: number, methodId: string, multiple: boolean) => {
    const before = chosenIn(index);
    const next = multiple
      ? before.includes(methodId)
        ? before.filter((id) => id !== methodId)
        : [...before, methodId]
      : [methodId];
    setPicked((current) => ({ ...current, [index]: next }));
  };
  const methodIds = groups.flatMap((_, index) => chosenIn(index));

  const submit = () =>
    setShipping.mutate(methodIds, {
      onSuccess: onDone,
      onError: (error) => {
        if (isShopApiError(error) && error.code === "SHIPPING_METHOD_INVALID") void options.refetch();
      },
    });

  return (
    <div className="space-y-5">
      {groups.map((group, index) => {
        const multiple = group.seller === null && group.options.length > 1;
        const chosen = chosenIn(index);
        return (
          <fieldset key={group.seller?.slug ?? "marketplace"} className="space-y-3">
            <legend className="mb-1 text-sm text-slate-500">
              {multiple ? "Choose one delivery option for each seller in your cart." : "Choose how you'd like it delivered."}
            </legend>
            {group.options.map((option) => (
              <label
                key={option.methodId}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm transition",
                  chosen.includes(option.methodId)
                    ? "border-(--shop-accent) bg-(--shop-accent-soft)"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={`shipping-${index}`}
                  checked={chosen.includes(option.methodId)}
                  onChange={() => choose(index, option.methodId, multiple)}
                  className="accent-(--shop-accent)"
                />
                <span className="flex-1">
                  <span className="block font-medium text-slate-900">{option.name}</span>
                  {option.description && <span className="block text-slate-500">{option.description}</span>}
                </span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {option.priceMinor ? formatMoney(option.priceMinor, cart.currency) : "Free"}
                </span>
              </label>
            ))}
          </fieldset>
        );
      })}
      {setShipping.isError && <FormError>{shopErrorMessage(setShipping.error)}</FormError>}
      <AccentButton type="button" onClick={submit} disabled={setShipping.isPending || methodIds.length === 0}>
        {setShipping.isPending ? "Saving…" : "Continue"}
      </AccentButton>
    </div>
  );
}

function BillingForm({ cart, onDone }: { cart: Cart; onDone: () => void }) {
  const setBilling = useSetBillingAddress();
  const differs = Boolean(cart.billingAddress) && !sameAddress(cart.billingAddress, cart.shippingAddress);
  const [separate, setSeparate] = useState(differs);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2.5 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={!separate}
          onChange={(event) => setSeparate(!event.target.checked)}
          className="h-4 w-4 accent-(--shop-accent)"
        />
        Same as the delivery address
      </label>
      {separate ? (
        <AddressForm
          initial={differs ? cart.billingAddress : null}
          submitLabel="Save billing address"
          pending={setBilling.isPending}
          error={setBilling.isError && <FormError>{shopErrorMessage(setBilling.error)}</FormError>}
          onCancel={onDone}
          onSubmit={(address) => setBilling.mutate({ address }, { onSuccess: onDone })}
        />
      ) : (
        <div className="space-y-4">
          {setBilling.isError && <FormError>{shopErrorMessage(setBilling.error)}</FormError>}
          <AccentButton
            type="button"
            disabled={setBilling.isPending}
            onClick={() =>
              differs ? setBilling.mutate({ sameAsShipping: true }, { onSuccess: onDone }) : onDone()
            }
          >
            {setBilling.isPending ? "Saving…" : "Done"}
          </AccentButton>
        </div>
      )}
    </div>
  );
}

function PayPanel({ cart }: { cart: Cart }) {
  const pay = usePay();
  const { checkout } = cart;
  const missing = [
    !checkout.hasContact && "your contact details",
    !checkout.hasShippingAddress && "a delivery address",
    !checkout.hasShippingMethod && "a delivery option",
  ].filter((item): item is string => Boolean(item));
  const leaving = pay.isSuccess && pay.data !== null;

  const error = pay.error;
  let errorText: string | null = null;
  if (error) {
    const code = isShopApiError(error) ? error.code : null;
    errorText =
      code === "PAYMENTS_UNAVAILABLE"
        ? "Online payment isn't available right now. Please try again in a little while."
        : code === "INVALID_RETURN_URL"
          ? "This shop can't take payments at this web address. Please contact the seller."
          : shopErrorMessage(error);
  }

  return (
    <div className="space-y-3">
      <AccentButton
        size="lg"
        className="w-full"
        disabled={!checkout.readyToPay || pay.isPending || leaving}
        onClick={() => pay.mutate(cart.code)}
      >
        <Lock />
        {pay.isPending ? "Connecting to PayU…" : leaving ? "Taking you to PayU…" : `Pay ${formatMoney(cart.totalMinor, cart.currency)}`}
      </AccentButton>
      {missing.length > 0 && (
        <p className="text-center text-xs text-slate-500">Add {missing.join(", ")} to pay.</p>
      )}
      {errorText && <FormError>{errorText}</FormError>}
      <p className="text-center text-xs leading-relaxed text-slate-500">
        You&apos;ll pay on PayU&apos;s secure page with UPI, cards, netbanking or wallets, then come back here.
      </p>
    </div>
  );
}

export function CheckoutPage() {
  const { basePath, userRoot } = useShopStore();
  const pathname = usePathname();
  const session = useClientSession();
  const { data: cart, isPending, isError, error, refetch } = useCart();
  const [editing, setEditing] = useState<StepName | null>(null);
  const hydrated = useHydrated();
  const signedIn = session.status === "granted";
  const done = () => setEditing(null);

  if (!hydrated || isPending) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-4">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState title="We couldn't load your checkout" action={<Button onClick={() => refetch()}>Try again</Button>}>
        {shopErrorMessage(error)}
      </EmptyState>
    );
  }

  if (!cart.lines.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-7 w-7" />}
        title="Your cart is empty"
        action={
          <Link href={`${basePath}/products`} className={accentLinkClass()}>
            Browse products
          </Link>
        }
      >
        Add something to your cart to check out.
      </EmptyState>
    );
  }

  const { checkout } = cart;
  const contactState: StepState = checkout.hasContact && editing !== "contact" ? "done" : "open";
  const addressState: StepState = !checkout.hasContact
    ? "locked"
    : checkout.hasShippingAddress && editing !== "address"
      ? "done"
      : "open";
  const shippingState: StepState = !checkout.hasShippingAddress
    ? "locked"
    : checkout.hasShippingMethod && editing !== "shipping"
      ? "done"
      : "open";
  const billingState: StepState = !checkout.hasShippingAddress ? "locked" : editing === "billing" ? "open" : "done";

  const customer = cart.customer;
  const contactSummary = session.status === "granted" ? (
    <p>
      Signed in as <span className="font-medium text-slate-800">{session.actor.email}</span>
    </p>
  ) : (
    customer && (
      <p>
        {[customer.firstName, customer.lastName].filter(Boolean).join(" ")} · {customer.email}
        {customer.phone && ` · ${customer.phone}`}
      </p>
    )
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <Link href={`${basePath}/cart`} className="text-sm font-medium text-(--shop-accent) hover:underline">
          Back to cart
        </Link>
      </div>

      {cart.state === "ArrangingPayment" && cart.code && (
        <p className="mt-5 flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            You started paying for this order. If you completed the payment,{" "}
            <a href={orderPageUrl(basePath, cart.code)} className="font-semibold underline">
              see your order
            </a>
            . Otherwise you can pay again below.
          </span>
        </p>
      )}

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Step
            number={1}
            title="Contact details"
            state={contactState}
            summary={contactSummary}
            onChange={signedIn ? undefined : () => setEditing("contact")}
          >
            {session.status === "checking" ? (
              <Skeleton className="h-32 rounded-2xl" />
            ) : (
              <div className="space-y-4">
                {!signedIn && (
                  <p className="text-sm text-slate-500">
                    Have an account?{" "}
                    <Link href={loginHref(userRoot, pathname)} className="font-medium text-(--shop-accent) hover:underline">
                      Sign in
                    </Link>{" "}
                    to use your saved addresses and see your orders later.
                  </p>
                )}
                <ContactForm cart={cart} onDone={done} />
              </div>
            )}
          </Step>

          <Step
            number={2}
            title="Delivery address"
            state={addressState}
            summary={cart.shippingAddress && <AddressText address={cart.shippingAddress} />}
            onChange={() => setEditing("address")}
          >
            <ShippingAddressForm
              cart={cart}
              signedIn={signedIn}
              onDone={done}
              onCancel={checkout.hasShippingAddress ? done : undefined}
            />
          </Step>

          <Step
            number={3}
            title="Delivery option"
            state={shippingState}
            summary={
              cart.shipping.length > 0 && (
                <p>
                  {cart.shipping.map((method) => method.name).join(", ")} ·{" "}
                  {cart.shippingMinor ? formatMoney(cart.shippingMinor, cart.currency) : "Free"}
                </p>
              )
            }
            onChange={() => setEditing("shipping")}
          >
            <ShippingMethodForm cart={cart} onDone={done} />
          </Step>

          <Step
            number={4}
            title="Billing address"
            state={billingState}
            summary={
              cart.billingAddress && !sameAddress(cart.billingAddress, cart.shippingAddress) ? (
                <AddressText address={cart.billingAddress} />
              ) : (
                <p>Same as the delivery address. This goes on your GST invoice.</p>
              )
            }
            onChange={() => setEditing("billing")}
          >
            <BillingForm cart={cart} onDone={done} />
          </Step>
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummary cart={cart} showLines footer={<PayPanel cart={cart} />} />
        </div>
      </div>
    </div>
  );
}
