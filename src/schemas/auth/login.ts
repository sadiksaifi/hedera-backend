import * as zod from "zod";

export const SLogin = zod.object({
  username: zod.string().min(2),
  password: zod
    .string()
    .min(8)
    .refine((password) => {
      const isNums = /[0-9]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);

      return isNums && hasLowerCase && hasUpperCase;
    }),
});
export type TLogin = zod.infer<typeof SLogin>;
