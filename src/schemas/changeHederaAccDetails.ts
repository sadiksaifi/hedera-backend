import { z } from "zod";

export const SHederaDetails = z.object({
  hederaAccId: z.string().min(2),
  hederaPubKey: z.string().min(2),
});
