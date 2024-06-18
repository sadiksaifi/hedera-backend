import * as zod from "zod";

export const SNewCoin = zod.object({
  name: zod.string().min(2).max(32),
  symbol: zod.string().min(2).max(8),
  initialSupply: zod.number().gte(0),
  maxTxFee: zod.number().gte(0),
  supply: zod.union([
    zod.object({ type: zod.literal("infinite") }),
    zod.object({
      type: zod.literal("finite"),
      max_supply: zod.string().refine((supply) => {
        return Number(supply) > 0 && /^[0-9]+$/.test(supply);
      }),
    }),
  ]),
  decimals: zod.number().min(0),
  // metadata: zod
  //   .string()
  //   .min(1, { message: "Field can't be empty" })
  //   .max(256, { message: "Max limit of 256 characters exceeded" }),
});
export type TNewCoin = zod.infer<typeof SNewCoin>;
