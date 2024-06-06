import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { burn } from "@/lib/hedera";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";
import { SCoinBurn } from "@/schemas/coin/burn";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.delete("/", validateRequest({ body: SCoinBurn }), async (req, res) => {
    try {
      const body = req.body;
      const ashes = await burn(body);
      res.status(200).json({ ...ashes });
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
