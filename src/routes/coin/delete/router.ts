import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { deleteStableCoin } from "@/lib/hedera";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";
import { SDeleteCoin } from "@/schemas/coin/delete";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.delete(
    "/",
    validateRequest({ query: SDeleteCoin }),
    async (req, res) => {
      try {
        const body = req.query;
        const message = await deleteStableCoin(body);
        console.log(message);
        res.status(200).json({ data: message });
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
