import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SUnfreeze } from "@/schemas/coin/unfreeze";
import { unfreezeStableCoin } from "@/lib/hedera";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SUnfreeze }),
    errorHandler(async (req, res) => {
      const body = req.body;
      const receipt = await unfreezeStableCoin(body);
      res.status(200).json({ data: { receipt } });
    })
  );

  return router;
};
