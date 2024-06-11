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
      const body = req.body;
      const transferRx = await transferCoin(body);
      res.status(200).json({ data: { ...transferRx } });
    })
  );

  return router;
};
