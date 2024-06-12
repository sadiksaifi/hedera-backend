import { z } from "zod";

export const SPermission = z.object({
  userId: z.string().min(2),
  grant: z.string().min(2),
});
