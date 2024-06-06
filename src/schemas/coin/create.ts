import * as zod from "zod";

export const SNewCoin = zod.object({
  name: zod.string().min(2).max(32),
  symbol: zod.string().min(2).max(8),
  initialSupply: zod.number().gte(0),
  maxTxFee: zod.number().gte(0),
});
export type TNewCoin = zod.infer<typeof SNewCoin>;
