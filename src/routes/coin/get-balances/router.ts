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

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: STreasuryData }),
    async (req, res) => {
      try {
        const query = req.query;
        const tokens = await getTreasury(query);
        res.status(200).json({ data: [...tokens] });
      } catch (error) {
        console.log(error);
        if (
          error instanceof StatusError ||
          error instanceof ReceiptStatusError ||
          error instanceof BadKeyError ||
          error instanceof BadMnemonicError ||
          error instanceof PrecheckStatusError
        )
          return res
            .status(400)
            .json({ message: error.message, name: error.name });

        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  );

  return router;
};
