import * as zod from "zod";

export const SAssociateCoin = zod.object({
  userId: zod.string().min(2),
  tokenId: zod.string().min(2),
});
export type TAssociateCoin = zod.infer<typeof SAssociateCoin>;
