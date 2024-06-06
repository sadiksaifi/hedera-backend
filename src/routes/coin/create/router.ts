import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { createStableCoin } from "@/lib/hedera";
import { SNewCoin } from "@/schemas/coin/create";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SNewCoin }),
    async (req, res, next) => {
      try {
        const body = req.body;
        const coin = await createStableCoin(body);
        return res.status(200).json({ data: coin });
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
