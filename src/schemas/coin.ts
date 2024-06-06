import * as zod from "zod";

// Coin getter schema
export const SCoinInfo = zod.object({
  tokenId: zod.string(),
});
export type TCoinInfo = zod.infer<typeof SCoinInfo>;

// New Coin
export const SNewCoin = zod.object({
  name: zod.string(),
  symbol: zod.string(),
  initialSupply: zod.number(),
  maxTxFee: zod.number(),
});
export type TNewCoin = zod.infer<typeof SNewCoin>;

// Coin Delete
export const SDeleteCoin = zod.object({
  tokenId: zod.string(),
});
export type TDeleteCoin = zod.infer<typeof SDeleteCoin>;

// Cash In
export const SCashIn = zod.object({
  tokenId: zod.string(),
  amount: zod.number(),
});
export type TCashIn = zod.infer<typeof SCashIn>;

// Associate
export const SAssociateCoin = zod.object({
  account: zod.object({
    key: zod.string().min(2),
    id: zod.string().min(2),
  }),
  tokenId: zod.string().min(2),
});
export type TAssociateCoin = zod.infer<typeof SAssociateCoin>;

// Transfer
export const STransfer = zod.object({
  id: zod.string(),
  from: zod.string(),
  to: zod.string(),
  amount: zod.number(),
});
export type TTransfer = zod.infer<typeof STransfer>;

// Freeze
export const SFreeze = zod.object({
  addressId: zod.string(),
  tokenId: zod.string(),
});
export type TFreeze = zod.infer<typeof SFreeze>;

// Unfreeze
export const SUnfreeze = SFreeze;
export type TUnfreeze = zod.infer<typeof SUnfreeze>;

// Treasury Data
export const STreasuryData = zod.object({ accountId: zod.string() });
export type TTreasuryData = zod.infer<typeof STreasuryData>;
