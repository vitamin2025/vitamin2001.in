import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productQueryString } from "@/lib/shop/query";
import type { ProductQuery } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

/** Page numbers to show: the first, the last, and two either side of the current one. */
function pageWindow(current: number, last: number): (number | "gap")[] {
  const pages = new Set([1, last, current - 1, current, current + 1].filter((p) => p >= 1 && p <= last));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) out.push("gap");
    out.push(page);
  });
  return out;
}

export function Pagination({
  pagePath,
  query,
  total,
  perPage,
}: {
  pagePath: string;
  query: ProductQuery;
  total: number;
  perPage: number;
}) {
  const last = Math.min(500, Math.ceil(total / perPage));
  const current = query.page ?? 1;
  if (last <= 1) return null;
  const href = (page: number) => `${pagePath}${productQueryString({ ...query, page })}`;
  const arrow = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50";

  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-1.5">
      {current > 1 ? (
        <Link href={href(current - 1)} className={arrow} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-40")} aria-hidden>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}
      {pageWindow(current, last).map((page, index) =>
        page === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-current={page === current ? "page" : undefined}
            className={cn(
              "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium",
              page === current ? "bg-(--shop-accent) text-white" : "text-slate-700 hover:bg-slate-100",
            )}
          >
            {page}
          </Link>
        ),
      )}
      {current < last ? (
        <Link href={href(current + 1)} className={arrow} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-40")} aria-hidden>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
