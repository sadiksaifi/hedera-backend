import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { STransfer } from "@/schemas/coin/transfer";
import { transferCoin } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: STransfer }),
    errorHandler(async (req, res) => {
      const from = res.locals.user?.hederaAcId;
      if (!from) throw new Error("For some reason from not found in locals");
      const body = req.body;
      const transferRx = await transferCoin({ ...body, from });
      res.status(200).json({ data: { ...transferRx } });
    })
  );

  return router;
};
