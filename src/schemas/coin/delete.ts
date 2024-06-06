import * as zod from "zod";

// Coin Delete
export const SDeleteCoin = zod.object({
  tokenId: zod.string(),
});
export type TDeleteCoin = zod.infer<typeof SDeleteCoin>;
