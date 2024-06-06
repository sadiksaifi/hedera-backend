import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SAssociateCoin } from "@/schemas/coin/associate";
import { associate } from "@/lib/hedera";
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
    validateRequest({ body: SAssociateCoin }),
    async (req, res) => {
      try {
        const body = req.body;
        console.log(body);
        const associateRx = await associate(body);
        res.status(200).json({ data: { ...associateRx, status: 200 } });
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
