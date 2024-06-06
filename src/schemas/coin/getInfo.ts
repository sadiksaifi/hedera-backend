import * as zod from "zod";

export const SCoinInfo = zod.object({
  tokenId: zod
    .string()
    .min(2)
    .refine(
      (id) => {
        const correctFormat = id.split(".").length === 3;
        return correctFormat;
      },
      { message: "should of foramt X.X.XXXX" }
    ),
});
export type TCoinInfo = zod.infer<typeof SCoinInfo>;
