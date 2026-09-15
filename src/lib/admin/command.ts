"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyEffect, type AdminEffect } from "./effects";
import {
  fieldErrorsFor,
  toAdminError,
  type AdminError,
  type FieldErrors,
} from "./errors";
import type { UserId } from "./ids";

export type CommandState =
  | { readonly status: "idle" }
  | { readonly status: "running" }
  | { readonly status: "failed"; readonly error: AdminError };

export type Command<Args, R = void> = {
  readonly run: (args: Args) => Promise<R>;
  readonly state: CommandState;
  readonly fieldErrors: FieldErrors | null;
  readonly reset: () => void;
};

export function useCommand<Args, R = void>(spec: {
  readonly actorId: UserId | null;
  readonly send: (args: Args) => Promise<R>;
  readonly effect: (args: Args, result: R) => AdminEffect;
  readonly fields?: readonly string[];
  readonly toast?: (args: Args, result: R) => string;
  readonly onDone?: (args: Args, result: R) => void;
}): Command<Args, R> {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: spec.send,
    retry: false,
    onSuccess: async (result, args) => {
      await applyEffect(queryClient, spec.actorId, spec.effect(args, result));
      if (spec.toast) {
        const { pushToast } = await import("@/stores/admin-feedback");
        pushToast(spec.toast(args, result));
      }
      spec.onDone?.(args, result);
    },
  });

  const error = mutation.error ? toAdminError(mutation.error) : null;
  const fieldErrors =
    error?.kind === "invalid"
      ? spec.fields
        ? fieldErrorsFor(spec.fields, flattenFields(error.fields))
        : error.fields
      : error?.kind === "rejected" || error?.kind === "conflict"
        ? { _form: [error.message] }
        : null;

  return {
    run: (args) => mutation.mutateAsync(args),
    state: mutation.isPending
      ? { status: "running" }
      : error
        ? { status: "failed", error }
        : { status: "idle" },
    fieldErrors,
    reset: () => mutation.reset(),
  };
}

function flattenFields(fields: FieldErrors): string[] {
  return Object.values(fields).flatMap((messages) => [...messages]);
}
