import * as zod from "zod";
import { SFreeze } from "./freeze";

export const SUnfreeze = SFreeze;
export type TUnfreeze = zod.infer<typeof SUnfreeze>;
