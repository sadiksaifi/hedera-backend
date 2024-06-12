import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCoinInfo } from "@/schemas/coin/getInfo";
import { getCoinInfo, getTreasury } from "@/lib/hedera";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";
import { STreasuryData } from "@/schemas/coin";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: STreasuryData }),
    errorHandler(async (req, res) => {
      const query = req.query;
      const tokens = await getTreasury(query);
      res.status(200).json({ data: [...tokens] });
    })
  );

  return router;
};
