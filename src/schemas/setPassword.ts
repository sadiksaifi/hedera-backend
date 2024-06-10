import * as zod from "zod";

export const SNewUserPassword = zod.object({
  password: zod
    .string()
    .min(8)
    .max(64)
    .refine((password) => {
      const isNums = /[0-9]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);

      return isNums && hasLowerCase && hasUpperCase;
    }),
});
