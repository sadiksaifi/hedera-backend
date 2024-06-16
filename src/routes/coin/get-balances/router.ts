import { Router } from "express";
import { getTreasury } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    errorHandler(async (_, res) => {
      if (!res.locals.user?.hederaAcId)
        throw new Error("Your hedera account id is not found");

      const tokens = await getTreasury({
        accountId: res.locals.user.hederaAcId,
      });
      res.status(200).json({ data: [...tokens] });
    })
  );

  return router;
};
