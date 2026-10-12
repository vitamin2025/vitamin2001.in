import * as React from "react";
import { cn } from "@/lib/utils";

/** The shop's main action button, in the store's accent colour. */
export const AccentButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: "md" | "lg" }
>(({ className, size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-(--shop-accent) font-semibold text-white shadow-sm transition hover:bg-(--shop-accent-strong) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--shop-accent-ring) disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4",
      size === "lg" ? "h-12 px-7 text-base" : "h-10 px-5 text-sm",
      className,
    )}
    {...props}
  />
));
AccentButton.displayName = "AccentButton";

/** Accent-coloured link styled as a button. */
export function accentLinkClass(size: "md" | "lg" = "md"): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full bg-(--shop-accent) font-semibold text-white shadow-sm transition hover:bg-(--shop-accent-strong) [&_svg]:size-4",
    size === "lg" ? "h-12 px-7 text-base" : "h-10 px-5 text-sm",
  );
}

export function outlineLinkClass(): string {
  return "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-800 transition hover:bg-slate-50 [&_svg]:size-4";
}
