"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  presetColors?: string[];
  disabled?: boolean;
}

export function ColorPicker({
  value = "#1a1a2e",
  onChange,
  className,
  presetColors = [
    "#0f172a",
    "#1e293b",
    "#312e81",
    "#1e1b4b",
    "#064e3b",
    "#701a75",
    "#831843",
    "#4c1d95",
    "#ffffff",
    "#f8fafc",
    "#4f46e5",
    "#e11d48",
  ],
  disabled = false,
}: ColorPickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-slate-200 shadow-xs dark:border-slate-800">
          <input
            type="color"
            value={value.startsWith("#") && value.length === 7 ? value : "#000000"}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="absolute -top-2 -left-2 h-14 w-14 cursor-pointer border-0 p-0"
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="#ffffff or linear-gradient(...)"
          disabled={disabled}
          className="font-mono text-xs"
        />
      </div>
      {presetColors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(color)}
              className={cn(
                "h-5 w-5 rounded-full border border-slate-300 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:border-slate-700",
                value.toLowerCase() === color.toLowerCase() && "ring-2 ring-indigo-500 ring-offset-1",
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
