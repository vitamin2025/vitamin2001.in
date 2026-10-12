/**
 * Shapes of the backend shop API (`/api/v1/shop`). Money is in paise with tax included:
 * `59000` is ₹590.00. See docs/shop-storefront-guide.md in vitamin2001.in_BE.
 */

export interface PriceRange {
  readonly minMinor: number;
  readonly maxMinor: number;
  readonly currency: string;
}

export interface Seller {
  readonly slug: string;
  readonly name: string;
  readonly description: string | null;
  readonly logo: string | null;
  readonly banner: string | null;
  /** The storefront's accent colour, `#rrggbb`, set in the client admin. Missing from older APIs. */
  readonly accentColor?: string | null;
  readonly isHouseShop: boolean;
}

export interface ProductSummary {
  readonly productId: string;
  readonly slug: string;
  readonly name: string;
  readonly image: string | null;
  readonly price: PriceRange;
  readonly inStock: boolean;
}

export interface FacetValueCount {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly count: number;
}

export interface FacetGroup {
  readonly code: string;
  readonly name: string;
  readonly values: readonly FacetValueCount[];
}

export interface ProductList {
  readonly items: readonly ProductSummary[];
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
  readonly facets: readonly FacetGroup[];
  readonly collections: readonly { slug: string; name: string; count: number }[];
}

export const PRODUCT_SORTS = [
  "relevance",
  "name_asc",
  "name_desc",
  "price_asc",
  "price_desc",
] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export interface ProductQuery {
  readonly q?: string;
  readonly collection?: string;
  /** Facet value ids: comma is AND, pipe is OR. */
  readonly facets?: string;
  readonly inStock?: boolean;
  readonly sort?: ProductSort;
  readonly page?: number;
  readonly perPage?: number;
}

export interface ProductOption {
  readonly group: string;
  readonly code: string;
  readonly name: string;
}

export interface ProductVariant {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly priceMinor: number;
  readonly currency: string;
  readonly stockLevel: string;
  readonly inStock: boolean;
  readonly image: string | null;
  readonly options: readonly ProductOption[];
}

export interface ProductDetail {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  /** HTML from the shop admin. */
  readonly description: string;
  readonly image: string | null;
  readonly images: readonly string[];
  readonly price: PriceRange | null;
  readonly inStock: boolean;
  readonly seller: { slug: string; name: string } | null;
  readonly facets: readonly {
    id: string;
    code: string;
    name: string;
    facet: { code: string; name: string };
  }[];
  readonly collections: readonly { slug: string; name: string }[];
  readonly optionGroups: readonly {
    code: string;
    name: string;
    options: readonly { code: string; name: string }[];
  }[];
  readonly variants: readonly ProductVariant[];
}

export interface CollectionNode {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly image: string | null;
  readonly children: readonly CollectionNode[];
}

export interface CollectionDetail {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly image: string | null;
  readonly breadcrumbs: readonly { slug: string; name: string }[];
  readonly children: readonly { slug: string; name: string; image: string | null }[];
}

export interface Address {
  readonly fullName: string;
  readonly company: string | null;
  readonly streetLine1: string;
  readonly streetLine2: string | null;
  readonly city: string;
  /** The state. */
  readonly province: string;
  readonly postalCode: string;
  readonly countryCode: string;
  readonly phoneNumber: string | null;
}

export interface AddressInput {
  fullName: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode?: string;
  phoneNumber: string;
}

export interface SavedAddress extends Address {
  readonly id: string;
  readonly defaultShipping: boolean;
  readonly defaultBilling: boolean;
}

export interface CartLine {
  readonly id: string;
  readonly variantId: string;
  readonly sku: string;
  readonly productSlug: string;
  readonly productName: string;
  readonly variantName: string;
  readonly image: string | null;
  readonly quantity: number;
  readonly unitPriceMinor: number;
  readonly linePriceMinor: number;
}

export interface Cart {
  readonly code: string | null;
  readonly state: string | null;
  readonly store: { slug: string; name: string };
  readonly currency: string;
  readonly itemCount: number;
  readonly lines: readonly CartLine[];
  readonly couponCodes: readonly string[];
  readonly discounts: readonly { description: string; amountMinor: number }[];
  readonly subTotalMinor: number;
  readonly shippingMinor: number;
  readonly taxMinor: number;
  readonly totalMinor: number;
  readonly customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  } | null;
  readonly shippingAddress: Address | null;
  readonly billingAddress: Address | null;
  readonly shipping: readonly { methodId: string; name: string; priceMinor: number }[];
  readonly checkout: {
    readonly hasContact: boolean;
    readonly hasShippingAddress: boolean;
    readonly hasShippingMethod: boolean;
    readonly readyToPay: boolean;
  };
}

export interface ShippingOption {
  readonly methodId: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly priceMinor: number;
}

export interface ShippingOptions {
  readonly sellers: readonly {
    seller: { slug: string; name: string } | null;
    options: readonly ShippingOption[];
  }[];
}

export interface ContactInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
}

export interface PayResponse {
  readonly txnid: string;
  readonly orderCode: string;
  readonly amountMinor: number;
  readonly currency: string;
  readonly payu: { url: string; fields: Record<string, string> };
}

export type PaymentStatus =
  | "pending"
  | "paid"
  | "confirmed"
  | "failed"
  | "cancelled"
  | "review";

/** The order as it was paid for, saved by the backend when the payment settled. */
export interface OrderSnapshot {
  readonly code: string;
  readonly state: string;
  readonly placedAt: string | null;
  readonly currency: string;
  readonly customer: { name: string; email: string; phone: string | null } | null;
  readonly shippingAddress: Address | null;
  readonly billingAddress: Address | null;
  readonly lines: readonly {
    productSlug: string;
    productName: string;
    variantName: string;
    sku: string;
    image: string | null;
    quantity: number;
    taxRate: number;
    unitPriceMinor: number;
    taxableMinor: number;
    taxMinor: number;
    totalMinor: number;
  }[];
  readonly shipping: readonly {
    name: string;
    taxableMinor: number;
    taxMinor: number;
    totalMinor: number;
  }[];
  readonly discounts: readonly { description: string; amountMinor: number }[];
  readonly couponCodes: readonly string[];
  readonly taxSummary: readonly {
    description: string;
    rate: number;
    taxableMinor: number;
    taxMinor: number;
  }[];
  readonly itemCount: number;
  readonly subTotalMinor: number;
  readonly shippingMinor: number;
  readonly taxableMinor: number;
  readonly taxMinor: number;
  readonly totalMinor: number;
}

export interface Invoice {
  readonly number: string;
  readonly url: string;
}

/** A seller's shipment of a paid order, from the shop's shipping updates. */
export interface Shipment {
  readonly seller: { slug: string; name: string } | null;
  readonly status: "shipped" | "delivered";
  readonly trackingCodes: readonly string[];
  readonly updatedAt: string;
}

export interface OrderStatus {
  readonly code: string;
  readonly store: { slug: string; name: string };
  readonly payment: {
    readonly status: PaymentStatus;
    readonly txnid: string;
    readonly amountMinor: number;
    readonly currency: string;
  };
  readonly order: OrderSnapshot | null;
  readonly invoice: Invoice | null;
  /** Shipping updates so far, newest first. Missing from APIs older than this field. */
  readonly shipments?: readonly Shipment[];
}

export interface MyOrderSummary {
  readonly code: string;
  readonly state: string;
  readonly placedAt: string;
  readonly currency: string;
  readonly itemCount: number;
  readonly totalMinor: number;
  readonly lines: readonly {
    productSlug: string;
    productName: string;
    variantName: string;
    quantity: number;
    image: string | null;
  }[];
}

export interface MyOrders {
  readonly items: readonly MyOrderSummary[];
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
}

export interface Fulfillment {
  readonly state: string;
  readonly method: string;
  readonly trackingCode: string | null;
  readonly createdAt: string;
}

export interface MyOrder extends Omit<Cart, "checkout" | "code" | "state"> {
  readonly code: string;
  readonly state: string;
  readonly placedAt: string;
  readonly invoice: Invoice | null;
  readonly fulfillments: readonly Fulfillment[];
  readonly payments: readonly {
    state: string;
    method: string;
    amountMinor: number;
    createdAt: string;
  }[];
}
