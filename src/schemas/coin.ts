import * as zod from "zod";

// Treasury Data
export const STreasuryData = zod.object({ accountId: zod.string() });
export type TTreasuryData = zod.infer<typeof STreasuryData>;
