import * as zod from "zod";

// Coin Pause
export const SPauseToken = zod.object({
  tokenId: zod.string(),
});
export type TPauseToken = zod.infer<typeof SPauseToken>;
