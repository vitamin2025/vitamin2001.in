"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  running?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  running = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={running}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={running}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
          >
            {running ? "Deleting..." : "Delete"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600">{description}</p>
    </Dialog>
  );
}
