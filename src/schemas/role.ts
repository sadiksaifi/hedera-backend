import { z } from "zod";

export const SUpdateTokenRole = z.object({
  token: z.string(),
  publicKey: z.string(),

  roles: z
    .array(
      z.enum([
        "kycKey",
        "freezeKey",
        "pauseKey",
        "wipeKey",
        "supplyKey",
        "metadataKey",
      ]),
      {
        description: "Please provide a valid array of roles",
      }
    )
    .min(1),
});
