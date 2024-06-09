import * as zod from "zod";

export const SChangeRole = zod.object({
  id: zod.string(),
  role: zod.enum(["MEMBER", "ADMIN", "MASTER"]),
});
