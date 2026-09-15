"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ListResult } from "@/lib/admin";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

export type DataTableColumn<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
};

export function DataTable<T>({
  result,
  columns,
  rowHref,
  onPage,
  empty,
}: {
  result: ListResult<T>;
  columns: DataTableColumn<T>[];
  rowHref?: (row: T) => string;
  onPage?: (page: number) => void;
  empty: string;
}) {
  if (result.status === "loading") {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (result.status === "failed" && result.error) {
    return <ErrorState error={result.error} onRetry={result.reload} />;
  }

  if (result.items.length === 0) {
    return <EmptyState>{empty}</EmptyState>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className={column.align === "right" ? "text-right" : undefined}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((row, index) => {
              const href = rowHref?.(row);
              return (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.header}
                      className={column.align === "right" ? "text-right" : undefined}
                    >
                      {href && column === columns[0] ? (
                        <Link href={href} className="font-medium text-indigo-700 hover:underline">
                          {column.cell(row)}
                        </Link>
                      ) : (
                        column.cell(row)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {onPage && result.page.totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {result.page.page} of {result.page.totalPages} ({result.page.total}{" "}
            total)
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={result.page.page <= 1}
              onClick={() => onPage(result.page.page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={result.page.page >= result.page.totalPages}
              onClick={() => onPage(result.page.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
