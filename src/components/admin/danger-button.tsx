"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminAction, Permit, Verdict } from "@/lib/admin";

export function DangerButton<A extends AdminAction>({
  verdict,
  label,
  confirm,
  variant = "destructive",
  onConfirm,
}: {
  verdict: Verdict<A>;
  label: string;
  variant?: "destructive" | "outline";
  confirm: {
    title: string;
    body?: string;
    reasonField?: string;
    passwordField?: string;
    typeToConfirm?: string;
  };
  onConfirm: (
    permit: Permit<A>,
    extra: { reason?: string; password?: string },
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [typed, setTyped] = useState("");

  const disabled = !verdict.allowed;
  const confirmReady =
    !confirm.typeToConfirm || typed === confirm.typeToConfirm;

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant={variant}
        disabled={disabled}
        title={!verdict.allowed ? verdict.reason : verdict.warning}
        onClick={() => {
          if (!verdict.allowed) return;
          setOpen(true);
        }}
      >
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={confirm.title}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!verdict.allowed || !confirmReady}
              onClick={() => {
                if (!verdict.allowed) return;
                onConfirm(verdict.permit, {
                  reason: reason || undefined,
                  password: password || undefined,
                });
                setOpen(false);
                setReason("");
                setPassword("");
                setTyped("");
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        {confirm.body ? <p className="mb-3">{confirm.body}</p> : null}
        {verdict.allowed && verdict.warning ? (
          <p className="mb-3 text-amber-700">{verdict.warning}</p>
        ) : null}
        {confirm.reasonField ? (
          <Textarea
            className="mb-3"
            placeholder={confirm.reasonField}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        ) : null}
        {confirm.passwordField ? (
          <Input
            className="mb-3"
            type="password"
            placeholder={confirm.passwordField}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        ) : null}
        {confirm.typeToConfirm ? (
          <Input
            placeholder={`Type ${confirm.typeToConfirm} to confirm`}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
        ) : null}
      </Dialog>
    </>
  );
}
