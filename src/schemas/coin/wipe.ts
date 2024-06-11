import * as zod from "zod";

// Coin Wipe
export const SWipe = zod.object({
  token: zod.string(),
  amount: zod.number(),
  accountId: zod.string(),
});
export type TWipe = zod.infer<typeof SWipe>;
