import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SFreeze } from "@/schemas/coin/freeze";
import { freezeStableCoin } from "@/lib/hedera";
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
    validateRequest({ body: SFreeze }),
    errorHandler(async (req, res) => {
      const body = req.body;
      const receipt = await freezeStableCoin(body);
      res.status(200).json({ data: { receipt } });
    })
  );

  return router;
};
