"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const MAX_QUANTITY = 99;

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = MAX_QUANTITY,
  disabled,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
}) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-slate-300 bg-white",
        disabled && "opacity-60",
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn(box, "inline-flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 disabled:opacity-40")}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn("min-w-8 text-center font-medium tabular-nums", size === "sm" ? "text-sm" : "text-base")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cn(box, "inline-flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 disabled:opacity-40")}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
