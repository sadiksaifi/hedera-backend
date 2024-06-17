import * as zod from "zod";

export const STransfer = zod.object({
  id: zod.string().min(2),
  privateKey: zod.string().min(2),
  to: zod.string().min(2),
  amount: zod.number().gt(0, { message: "Can't transfer 0 coins" }),
});
export type TTransfer = zod.infer<typeof STransfer>;
