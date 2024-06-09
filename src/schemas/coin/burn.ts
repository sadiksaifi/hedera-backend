import * as zod from "zod";

// Coin Burn
export const SCoinBurn = zod.object({
  // supplyKey: zod.string(),
  token: zod.string().min(2),
  amount: zod.string(),
});
export type TCoinBurn = zod.infer<typeof SCoinBurn>;
