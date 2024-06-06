import * as zod from "zod";

// Coin Burn
export const SCoinBurn = zod.object({
  // supplyKey: zod.string(),
  token: zod.string().min(2),
  amount: zod.number().gt(0),
});
export type TCoinBurn = zod.infer<typeof SCoinBurn>;
