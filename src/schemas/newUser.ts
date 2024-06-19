import * as zod from "zod";

export const SNewUser = zod.object({
  name: zod.string().max(64),
  email: zod.string().max(64).email(),
  hederaAccId: zod.string().max(64).optional(),
  hederaPubKey: zod.string().max(256).optional(),
});
export type TNewUser = zod.infer<typeof SNewUser>;
