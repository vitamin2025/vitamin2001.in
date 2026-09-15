"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SearchFilterBar({
  value,
  onSearch,
  filters,
  action,
}: {
  value: string;
  onSearch: (q: string) => void;
  filters?: {
    key: string;
    label: string;
    value: string;
    options: [string, string][];
    onChange: (value: string) => void;
  }[];
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-56 flex-1">
        <Input
          value={value}
          placeholder="Search"
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      {filters?.map((filter) => (
        <div key={filter.key} className="w-40">
          <p className="mb-1 text-xs font-medium text-slate-500">{filter.label}</p>
          <Select
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
          >
            {filter.options.map(([optionValue, optionLabel]) => (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            ))}
          </Select>
        </div>
      ))}
      {action}
    </div>
  );
}
