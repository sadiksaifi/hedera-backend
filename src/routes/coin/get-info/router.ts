import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCoinInfo } from "@/schemas/coin/getInfo";
import { getCoinInfo } from "@/lib/hedera";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get("/", validateRequest({ query: SCoinInfo }), async (req, res) => {
    try {
      const { tokenId, ...token } = await getCoinInfo(req.query);
      res.status(200).json({
        data: {
          ...token,
          supplyType: token.supplyType?.toString(),
          supply: token.totalSupply.toString(),
          tokenId: tokenId.toString(),
        },
      });
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
