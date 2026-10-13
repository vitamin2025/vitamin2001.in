"use client";

import { authRequest } from "@/lib/admin/http";
import { useCommand, type Command } from "@/lib/admin/command";

export type ProfileInput = {
  readonly name: string;
  /** A photo URL, or "" to remove the photo. */
  readonly image: string;
};

/** Saves the signed-in user's own name and photo (Better Auth `update-user`). */
export function useUpdateProfile(): Command<ProfileInput, void> {
  return useCommand<ProfileInput, void>({
    actorId: null,
    fields: ["name", "image"],
    send: async (input) => {
      await authRequest({
        method: "POST",
        path: "/update-user",
        body: { name: input.name, image: input.image },
        parse: () => undefined,
      });
    },
    effect: () => ({ on: "session.changed" }),
  });
}
