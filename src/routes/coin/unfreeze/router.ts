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

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: SUnfreeze }), async (req, res) => {
    try {
      const body = req.body;
      const receipt = await unfreezeStableCoin(body);
      res.status(200).json({ data: { receipt } });
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
