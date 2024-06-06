import * as zod from "zod";

export const SFreeze = zod.object({
  addressId: zod.string().min(3),
  tokenId: zod.string().min(3),
});
export type TFreeze = zod.infer<typeof SFreeze>;
