"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={cn(
        "w-full max-w-md rounded-xl border border-slate-200 bg-white p-0 shadow-lg backdrop:bg-slate-900/40",
      )}
    >
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="px-5 py-4 text-sm text-slate-700">{children}</div>
      {footer ? (
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
