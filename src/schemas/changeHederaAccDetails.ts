import { z } from "zod";

export const SHederaDetails = z.object({
  hederaAccId: z.string().min(2).optional(),
  hederaPubKey: z.string().min(2).optional(),
  hederaPvtKey: z.string().min(2).optional(),
});
