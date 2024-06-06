import * as zod from "zod";

export const SAssociateCoin = zod.object({
  account: zod.object({
    key: zod.string().min(2),
    id: zod.string().min(2),
  }),
  tokenId: zod.string().min(2),
});
export type TAssociateCoin = zod.infer<typeof SAssociateCoin>;
