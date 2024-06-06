import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCashIn } from "@/schemas/coin/cashin";
import { cashIn } from "@/lib/hedera";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: SCashIn }), async (req, res) => {
    try {
      const body = req.body;
      const cashInReceipt = await cashIn(body);
      return res.status(200).json({ data: { ...cashInReceipt } });
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
  });

  return router;
};
