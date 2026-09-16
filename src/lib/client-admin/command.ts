"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fieldErrorsFor,
  toAdminError,
  type AdminError,
  type FieldErrors,
} from "@/lib/admin/errors";
import type { UserId } from "@/lib/admin/ids";
import { CLIENT_ADMIN_ROOT, clientAdminKeys } from "./keys";

export type ClientAdminEffect =
  | { on: "members.changed"; actorId: UserId; slug: string }
  | { on: "settings.changed"; actorId: UserId; slug: string }
  | { on: "signedOut" };

export type CommandState =
  | { readonly status: "idle" }
  | { readonly status: "running" }
  | { readonly status: "failed"; readonly error: AdminError };

export type ClientCommand<Args, R = void> = {
  readonly run: (args: Args) => Promise<R>;
  readonly state: CommandState;
  readonly fieldErrors: FieldErrors | null;
  readonly reset: () => void;
};

async function applyEffect(
  queryClient: ReturnType<typeof useQueryClient>,
  effect: ClientAdminEffect,
): Promise<void> {
  if (effect.on === "signedOut") {
    await queryClient.removeQueries({ queryKey: CLIENT_ADMIN_ROOT });
    return;
  }
  if (effect.on === "members.changed") {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: clientAdminKeys.members(effect.actorId, effect.slug),
      }),
      queryClient.invalidateQueries({
        queryKey: clientAdminKeys.context(effect.actorId, effect.slug),
      }),
    ]);
    return;
  }
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: clientAdminKeys.settings(effect.actorId, effect.slug),
    }),
    queryClient.invalidateQueries({
      queryKey: clientAdminKeys.context(effect.actorId, effect.slug),
    }),
  ]);
}

export function useClientAdminCommand<Args, R = void>(spec: {
  readonly send: (args: Args) => Promise<R>;
  readonly effect: (args: Args, result: R) => ClientAdminEffect;
  readonly fields?: readonly string[];
  readonly toast?: (args: Args, result: R) => string;
}): ClientCommand<Args, R> {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: spec.send,
    retry: false,
    onSuccess: async (result, args) => {
      await applyEffect(queryClient, spec.effect(args, result));
      if (spec.toast) {
        const { pushToast } = await import("@/stores/admin-feedback");
        pushToast(spec.toast(args, result));
      }
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
