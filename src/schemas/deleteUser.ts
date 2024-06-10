import * as zod from "zod";

export const SDeleteUser = zod.object({
  id: zod.string().max(64),
});
export type TAuthUser = zod.infer<typeof SDeleteUser>;
