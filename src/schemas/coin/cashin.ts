import * as zod from "zod";

export const SCashIn = zod.object({
  tokenId: zod.string().refine(
    (id) => {
      const hasArrayOf3Nums = id.split(".").length === 3;

      return hasArrayOf3Nums;
    },
    { message: "Only Supported Format is X.X.XXXXX" }
  ),
  amount: zod.number().gt(0),
});
export type TCashIn = zod.infer<typeof SCashIn>;
