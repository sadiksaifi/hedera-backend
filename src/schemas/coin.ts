import * as zod from "zod";

export const SNewCoin = zod.object({
  name: zod.string(),
  symbol: zod.string(),
  initialSupply: zod.number(),
  maxTxFee: zod.number(),
});
export type TNewCoin = zod.infer<typeof SNewCoin>;

export const SCashIn = zod.object({
  tokenId: zod.string(),
  amount: zod.number(),
});
export type TCashIn = zod.infer<typeof SCashIn>;
