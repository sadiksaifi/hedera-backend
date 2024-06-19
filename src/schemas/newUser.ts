import * as zod from "zod";

export const SNewUser = zod.object({
  name: zod.string().max(64),
  email: zod.string().max(64).email(),
});
export type TNewUser = zod.infer<typeof SNewUser>;
